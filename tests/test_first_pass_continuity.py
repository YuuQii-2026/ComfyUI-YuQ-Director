import copy
import ast
import json
from pathlib import Path
from types import SimpleNamespace

import pytest

torch = pytest.importorskip("torch")
st = pytest.importorskip("safetensors.torch")

from test_native_continuity import core, decoder
from theodore_director import first_pass_continuity as native
from theodore_director.duration import calculate_h3_frames
from theodore_director.manifest import commit_shot_result
from theodore_director.native_continuity import contextual_merge_sources
from theodore_director.paths import build_output_paths
from theodore_director.schema import DEFAULT_PLAN, load_plan
from theodore_director.second_pass_relay import invalid_reason, streams
from theodore_director.selection import select_shot
from theodore_director.video_results import read_video_result_metadata, write_video_result_metadata


def plan_for(frames=39, audio=39):
    value = copy.deepcopy(DEFAULT_PLAN)
    value["continuity"].update(videoContextFrames=frames, audioContextFrames=audio)
    value["shots"] = [{"id": f"shot_{n}", "title": str(n), "prompt": "test", "durationSeconds": 5,
                       "enabled": True, "latentRelay": True} for n in range(3)]
    return load_plan(value)


def empty(plan, index, dtype=torch.float32):
    count, _ = calculate_h3_frames(5, is_first=index == 0, context_frames=plan.continuity.video_context_frames)
    return {"samples": [torch.zeros(1, 24, (count-5)//17*5+2, 2, 4, dtype=dtype),
                        torch.zeros(1, 32, 2, round(count/24*40), dtype=dtype)]}


def simulated_sample(target):
    from comfy.nested_tensor import NestedTensor

    # Model-free sampler oracle: zero-mask regions retain their input exactly.
    parts = [part + mask.to(part) * 0.25 for part, mask in zip(streams(target), target["noise_mask"].unbind())]
    return {**target, "samples": NestedTensor(parts)}


def finish(root, plan, index, dtype=torch.float32):
    shot = select_shot(plan, index)
    _, target, info, _ = native.prepare_target(plan, shot, [], empty(plan, index, dtype), root)
    previous_meta = read_video_result_metadata(root/info["parent"]) if info.get("parent") else None
    count = previous_meta.relay["deliveredFrames"] if previous_meta else 0
    soundtrack = object()
    media = SimpleNamespace(frame_rate=24, images=torch.zeros(count, 2, 4, 3), audio=soundtrack)
    def save(frames, audio, path):
        assert len(frames) == count and audio is soundtrack
        path.write_bytes(b"context copy")
    accepted, info = native.finalize(simulated_sample(target), decoder(), info, root,
        lambda path: SimpleNamespace(get_components=lambda: media), save)
    paths = build_output_paths(plan, shot.shot, index)
    video = root / f"{paths.video_prefix}_00001_.mp4"
    tail = root / f"{paths.tail_prefix}_00001_.png"
    video.parent.mkdir(parents=True, exist_ok=True)
    tail.parent.mkdir(parents=True, exist_ok=True)
    video.write_bytes(b"video")
    tail.write_bytes(b"tail")
    info = native.commit_metadata(root, plan, shot, paths, video, info)
    write_video_result_metadata(video, stage="first_pass", shot_id=shot.shot.id, plan_hash=plan.plan_hash, relay=info)
    commit_shot_result(result_path=root/paths.shot_result_path, manifest_path=root/paths.manifest_path,
        shot_id=shot.shot.id, shot_hash=shot.shot_hash, plan_hash=plan.plan_hash,
        video_path=video, tail_path=tail, latent_path=root/info["state"], latent_required=True)
    return accepted, info, video


@pytest.mark.parametrize("frames", [5, 22, 39, 56])
@pytest.mark.parametrize("audio_frames", [0, 10, 24, 39])
@pytest.mark.parametrize("dtype", [torch.float32, torch.float16, torch.bfloat16])
def test_native_av_prefix_is_preserved_and_new_content_remains_generatable(tmp_path, frames, audio_frames, dtype):
    plan = plan_for(frames, audio_frames)
    parent, _, _ = finish(tmp_path, plan, 0, dtype)
    original = empty(plan, 1, dtype)
    conditioning = [[object(), {"minimax_keyframes": [{"resolved_frame_index": 0}, {"resolved_frame_index": 120}],
                               "minimax_refs": ["actor"]}]]
    changed, target, info, trim = native.prepare_target(plan, select_shot(plan, 1), conditioning, original, tmp_path)
    prefix = native.context_tokens(frames)
    start, end = info["audioStart"], info["audioEnd"]
    assert trim == frames
    assert info["frames"] - trim == info["deliveredFrames"]
    assert end == round(frames/24*40)
    assert end-start == min(end, round((audio_frames or frames)/24*40))
    video, audio = streams(target)
    assert torch.equal(video[:, :, :prefix], streams(parent)[0][:, :, -prefix:])
    assert torch.equal(audio[..., start:end], streams(parent)[1][..., -(end-start):])
    vm, am = target["noise_mask"].unbind()
    assert not vm[:, :, :prefix].any() and vm[:, :, prefix:].all()
    assert not am[..., start:end].any() and am[..., end:].all()
    assert not any(part.any() for part in original["samples"])
    assert len(conditioning[0][1]["minimax_keyframes"]) == 2
    assert changed[0][1]["minimax_keyframes"] == [{"resolved_frame_index": 120}]
    assert changed[0][1]["minimax_refs"] == ["actor"]
    accepted = native.accept_sample(simulated_sample(target), info, tmp_path)
    assert torch.equal(streams(accepted)[0][:, :, :prefix], streams(parent)[0][:, :, -prefix:])
    assert torch.equal(streams(accepted)[1][..., start:end], streams(parent)[1][..., -(end-start):])
    assert "noise_mask" not in accepted


def test_first_shot_and_disabled_relay_do_not_read_any_history(tmp_path):
    plan = plan_for()
    for index in [0, 1]:
        if index:
            value = plan.to_dict()
            value["shots"][1]["latentRelay"] = False
            plan = load_plan(value)
        count, _ = calculate_h3_frames(5, is_first=True)
        _, target, info, trim = native.prepare_target(plan, select_shot(plan, index), [], empty(plan, 0), tmp_path)
        assert trim == 0 and "parent" not in info and info["frames"] == count
        assert all(mask.all() for mask in target["noise_mask"].unbind())


@pytest.mark.parametrize("part", [0, 1])
def test_failed_mask_is_rejected_before_state_save(tmp_path, part):
    plan = plan_for()
    finish(tmp_path, plan, 0)
    _, target, info, _ = native.prepare_target(plan, select_shot(plan, 1), [], empty(plan, 1), tmp_path)
    streams(target)[part].add_(0.5)
    with pytest.raises(ValueError, match="保护区"):
        native.accept_sample(target, info, tmp_path)
    assert not (tmp_path/info["runPrefix"]/"latent_context/native_firstpass"/f"{info['key']}.safetensors").exists()


@pytest.mark.parametrize("fault", ["video", "state", "missing", "manifest", "meta", "plan", "geometry", "dtype", "fps", "duration", "nonfinite"])
def test_stale_states_and_incompatible_grids_fail_before_sampling(tmp_path, fault):
    plan = plan_for()
    _, info, parent = finish(tmp_path, plan, 0)
    target = empty(plan, 1)
    if fault == "video": parent.write_bytes(b"replacement video")
    if fault == "state": (tmp_path/info["state"]).write_bytes(b"replacement state")
    if fault == "missing": (tmp_path/info["state"]).unlink()
    if fault == "manifest": (tmp_path/info["resultPath"]).write_text("{}", encoding="utf-8")
    if fault == "meta": parent.with_name(parent.name+".theodore.json").unlink()
    if fault == "geometry": target["samples"][0] = torch.zeros(1,24,target["samples"][0].shape[2],2,6)
    if fault == "dtype": target = empty(plan, 1, torch.float16)
    if fault == "nonfinite": target["samples"][0].fill_(float("nan"))
    if fault in {"plan", "fps", "duration"}:
        value = plan.to_dict()
        if fault == "plan": value["shots"][0]["prompt"] = "changed"
        if fault == "fps": value["defaults"]["fps"] = 25
        if fault == "duration": value["continuity"]["durationMode"] = "legacy_generation_duration"
        plan = load_plan(value)
    with pytest.raises(ValueError):
        native.prepare_target(plan, select_shot(plan, 1), [], target, tmp_path)


def test_three_shot_merge_uses_exact_context_copies_and_preserves_audio(tmp_path):
    plan = plan_for()
    first, first_info, left = finish(tmp_path, plan, 0)
    second, info, middle = finish(tmp_path, plan, 1)
    _, third_info, right = finish(tmp_path, plan, 2)
    selected = contextual_merge_sources(tmp_path, [left, middle, right])
    assert selected == [tmp_path/info["decodeContext"]["path"], tmp_path/third_info["decodeContext"]["path"], right]
    assert contextual_merge_sources(tmp_path, [left]) == [left]
    assert contextual_merge_sources(tmp_path, [right, left]) == [right, left]
    assert len(native.decode_parent_context(second, decoder(), info, tmp_path)[0]) == first_info["deliveredFrames"]
    assert left.read_bytes() == middle.read_bytes() == b"video"
    assert torch.equal(st.load_file(str(tmp_path/first_info["state"]))["video"], streams(first)[0])
    assert not invalid_reason(tmp_path, read_video_result_metadata(right))
    selected[0].write_bytes(b"changed context")
    with pytest.raises(ValueError, match="已变化"):
        contextual_merge_sources(tmp_path, [left, middle])


def test_regenerating_parent_invalidates_existing_descendants(tmp_path):
    plan = plan_for()
    finish(tmp_path, plan, 0)
    _, info, child = finish(tmp_path, plan, 1)
    finish(tmp_path, plan, 0)
    assert invalid_reason(tmp_path, read_video_result_metadata(child))
    with pytest.raises(ValueError):
        native.check_parent(tmp_path, info)


def test_disk_history_changes_invalidate_comfy_node_cache(tmp_path):
    plan = plan_for()
    first = select_shot(plan, 0)
    second = select_shot(plan, 1)
    independent = native.cache_fingerprint(plan, first, tmp_path)
    missing = native.cache_fingerprint(plan, second, tmp_path)
    _, info, parent = finish(tmp_path, plan, 0)
    completed = native.cache_fingerprint(plan, second, tmp_path)
    assert missing != completed
    assert completed == native.cache_fingerprint(plan, second, tmp_path)
    (tmp_path/info["state"]).write_bytes(b"modified state")
    assert native.cache_fingerprint(plan, second, tmp_path) != completed
    assert native.cache_fingerprint(plan, first, tmp_path) == independent


@pytest.mark.parametrize("fault", ["multibatch", "wrong_length", "profile"])
def test_decode_rejects_invalid_batch_shape_or_window(tmp_path, fault):
    plan = plan_for()
    finish(tmp_path, plan, 0)
    _, target, info, _ = native.prepare_target(plan, select_shot(plan, 1), [], empty(plan, 1), tmp_path)
    latent = native.accept_sample(target, info, tmp_path)
    vae = decoder()
    if fault == "multibatch": vae.decode = lambda v: torch.zeros(2,141,2,4,3)
    if fault == "wrong_length": vae.decode = lambda v: torch.zeros(1,12,2,4,3)
    if fault == "profile": vae.first_stage_model.noncausal = True
    with pytest.raises(ValueError):
        native.decode_parent_context(latent, vae, info, tmp_path)


def test_new_workflow_uses_native_mask_path_and_retains_secondpass_branch():
    directory = Path(__file__).parents[1]/"workflows"
    flow = json.loads((directory/"YuQ导播台-一采原生保护测试.json").read_text(encoding="utf-8"))
    original = json.loads((directory/"YuQ导播台-原生接力测试.json").read_text(encoding="utf-8"))
    nodes = {item["id"]: item for item in flow["nodes"]}
    edges = {row[0]: row for row in flow["links"]}
    assert len(nodes) == len(flow["nodes"])
    assert len(edges) == len(flow["links"])
    for number, origin, slot, target, input_slot, kind in flow["links"]:
        assert number in nodes[origin]["outputs"][slot]["links"]
        assert nodes[target]["inputs"][input_slot]["link"] == number
        assert nodes[origin]["order"] < nodes[target]["order"]
    for item in flow["nodes"]:
        for port in item.get("inputs", []):
            if port.get("link") is not None: assert port["link"] in edges
        for port in item.get("outputs", []):
            assert all(number in edges for number in port.get("links", []) or [])
    def source(number, input_slot):
        row = edges[nodes[number]["inputs"][input_slot]["link"]]
        return row[1], row[2]
    assert source(663,4) == (660,1)
    assert source(664,0) == (663,0)
    assert source(392,2) == (660,3)
    assert source(400,8) == (664,1)
    assert all(source(number,0) == (664,0) for number in [122,121,393])
    assert not {125,388,389,390,391,651,652} & nodes.keys()
    old_nodes = {n["id"]: n for n in original["nodes"]}
    for number in [620,621,622,623]:
        assert nodes[number]["type"] == old_nodes[number]["type"]
        assert nodes[number]["inputs"] == old_nodes[number]["inputs"]
    project = next(n for n in flow["nodes"] if n["type"] == "TheodoreDirector_Project")
    plan = load_plan(project["widgets_values"][0])
    assert plan.continuity.video_context_frames == plan.continuity.audio_context_frames == 39


@pytest.mark.parametrize("frames", [5, 22, 39, 56])
@pytest.mark.parametrize("dtype", [torch.float32, torch.float16, torch.bfloat16])
def test_firstpass_decode_matches_unbroken_timeline_with_actual_core_windows(tmp_path, frames, dtype):
    source = Path(__file__).parents[2] / ".codex/tmp/continuity-research-20261114/sources/Comfy-Org__ComfyUI-stable/comfy/ldm/minimax/vae.py"
    if not source.is_file():
        pytest.skip("pinned ComfyUI source required for temporal contract test")
    tree = ast.parse(source.read_text(encoding="utf-8"))
    klass = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "MiniMaxH3VideoVAE")
    names = {"blend", "decode_output_shape", "_decode_temporal_pad_frames", "_decode_temporal_frame_plan",
             "_decode_temporal_chunks", "decode_temporal"}
    functions = [n for n in klass.body if isinstance(n, ast.FunctionDef) and n.name in names]
    namespace = {"torch": torch}
    future = ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0)
    exec(compile(ast.fix_missing_locations(ast.Module(body=[future, *functions], type_ignores=[])), str(source), "exec"), namespace)
    model = type("NativeTemporal", (), {name: namespace[name] for name in names})()
    for key, value in vars(decoder().first_stage_model).items():
        setattr(model, key, value)
    model.vae_ratio_t, model.frame_pre_padding, model.vae_ratio = 4, 3, 1
    model.decoder = SimpleNamespace(out_channels=3)
    model._finalize_pixels = lambda x: x
    # Real upstream chunking/blending, with a deterministic stand-in neural layer.
    model._adaptive_decode = lambda z: (z[:, :3] + z[:, :3].mean(dim=2, keepdim=True)).repeat_interleave(4, dim=2)
    def decode(video):
        buffer = torch.empty(model.decode_output_shape(video.shape), dtype=video.dtype)
        return model.decode_temporal(video, output_buffer=buffer).movedim(1, -1)
    vae = SimpleNamespace(first_stage_model=model, decode=decode)
    plan = plan_for(frames)
    previous, parent_info, _ = finish(tmp_path, plan, 0, dtype)
    _, target, info, _ = native.prepare_target(plan, select_shot(plan, 1), [], empty(plan, 1, dtype), tmp_path)
    prefix = info["videoPrefixTokens"]
    current = streams(target)[0]
    current[:, :, prefix:] = torch.randn(current[:, :, prefix:].shape, generator=torch.Generator().manual_seed(87)).to(dtype)
    corrected_left, _ = native.decode_parent_context(target, vae, info, tmp_path)
    right = decode(current)[0, frames:]
    previous_v = streams(previous)[0]
    full = decode(torch.cat((previous_v, current[:, :, prefix:]), dim=2))[0]
    assert torch.equal(torch.cat((corrected_left, right)), full)
    assert not torch.equal(torch.cat((decode(previous_v)[0], right)), full)
    assert len(corrected_left) == parent_info["deliveredFrames"]


def test_actual_core_inpaint_wrapper_preserves_only_the_selected_av_prefix(tmp_path):
    source = Path(__file__).parents[2] / ".codex/tmp/continuity-research-20261114/sources/Comfy-Org__ComfyUI-stable/comfy/samplers.py"
    if not source.is_file():
        pytest.skip("pinned ComfyUI source required for mask contract test")
    tree = ast.parse(source.read_text(encoding="utf-8"))
    klass = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "KSamplerX0Inpaint")
    namespace = {}
    exec(compile(ast.Module(body=[klass], type_ignores=[]), str(source), "exec"), namespace)
    plan = plan_for()
    finish(tmp_path, plan, 0)
    _, target, info, _ = native.prepare_target(plan, select_shot(plan, 1), [], empty(plan, 1), tmp_path)
    parts = streams(target)
    packed = torch.cat([part.flatten(1) for part in parts], dim=1)
    mask = torch.cat([m.expand_as(part).flatten(1) for m, part in zip(target["noise_mask"].unbind(), parts)], dim=1)
    base = SimpleNamespace(scale_latent_inpaint=lambda **kw: kw["latent_image"])
    class Model:
        inner_model = base
        def __call__(self, x, sigma, **kwargs): return x*0+123
    wrapper = namespace["KSamplerX0Inpaint"](Model(), torch.tensor([0.8, 0]))
    wrapper.latent_image, wrapper.noise = packed, packed*0
    output = wrapper(packed*0, torch.tensor([0.8]), mask)
    assert torch.equal(output[mask == 0], packed[mask == 0])
    assert (output[mask == 1] == 123).all()
