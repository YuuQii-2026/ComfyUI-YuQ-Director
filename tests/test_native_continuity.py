import ast
import importlib.util
import json
from pathlib import Path
import sys
from types import ModuleType, SimpleNamespace

import pytest

torch = pytest.importorskip("torch")
st = pytest.importorskip("safetensors.torch")

from theodore_director import native_continuity as native
from theodore_director.postprocess import validate_merge_selections
from theodore_director.second_pass_relay import finalize_images, fingerprint, state_path, streams
from theodore_director.video_results import read_video_result_metadata, write_video_result_metadata
from test_second_pass_relay import fixture, parse, complete


@pytest.fixture(autouse=True)
def core(monkeypatch):
    package = ModuleType("comfy")
    package.__path__ = []
    nested = ModuleType("comfy.nested_tensor")
    pinned = Path(__file__).parents[2] / ".codex/tmp/continuity-research-20261114/sources/Comfy-Org__ComfyUI-stable/comfy/nested_tensor.py"
    if pinned.is_file():
        spec = importlib.util.spec_from_file_location("comfy.nested_tensor", pinned)
        nested = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(nested)
    else:
        class NestedTensor:
            def __init__(self, tensors):
                self.tensors = list(tensors)
                self.is_nested = True
            def unbind(self):
                return self.tensors
        nested.NestedTensor = NestedTensor
    base = ModuleType("comfy.model_base")
    base.MiniMaxH3 = type("MiniMaxH3", (), {key: lambda *a, **kw: None for key in (
        "_denoise_mask_conds", "_denoise_mask_values", "_token_grid_masks", "scale_latent_inpaint")})
    package.nested_tensor = nested
    monkeypatch.setitem(sys.modules, "comfy", package)
    monkeypatch.setitem(sys.modules, "comfy.nested_tensor", nested)
    monkeypatch.setitem(sys.modules, "comfy.model_base", base)


def chain(root, frames=22, dtype=torch.float32):
    plan, paths = fixture(root)
    plan["continuity"]["videoContextFrames"] = frames
    first = parse(root, plan, paths, continuityMode=native.POLICY)
    previous = torch.randn(1, 24, 37, 2, 4, dtype=dtype, generator=torch.Generator().manual_seed(42))
    audio = torch.randn(1, 32, 2, 207, dtype=dtype)
    first.media.update(trim=0, original_frames=124)
    finalize_images(torch.zeros(124, 2, 4, 3), {"samples": [previous, audio]}, {"samples": audio}, first, root)
    parent = root / f"{first.output_prefix}_00002_.mp4"
    parent.write_bytes(b"parent video")
    write_video_result_metadata(parent, stage="second_pass", shot_id=first.shot.shot.id,
        plan_hash=first.plan.plan_hash, source_path=first.source_relative, processing_mode=first.processing_mode,
        relay={**first.relay, "state": state_path(root, first).relative_to(root).as_posix(),
               "stateFingerprint": fingerprint(state_path(root, first)), "videoFingerprint": fingerprint(parent)})
    request = parse(root, plan, paths, 2, continuityMode=native.POLICY)
    request.media.update(trim=frames, original_frames=124-frames)
    return request, previous, audio, parent


@pytest.mark.parametrize("frames", [5, 22, 39, 56])
@pytest.mark.parametrize("dtype", [torch.float32, torch.float16, torch.bfloat16])
def test_protects_native_high_grid_and_locks_audio_without_changing_inputs(tmp_path, frames, dtype):
    request, previous, audio, _ = chain(tmp_path, frames, dtype)
    target = torch.zeros_like(previous)
    cond = [[object(), {"minimax_keyframes": [{"resolved_frame_index": 0}, {"resolved_frame_index": 123}],
                       "minimax_references": ["reference"]}]]
    changed, latent = native.prepare_target(cond, {"samples": [target, audio]}, request, tmp_path, audio_latent={"samples": audio})
    prefix = native.context_tokens(frames)
    video_mask, audio_mask = latent["noise_mask"].unbind()
    assert torch.equal(streams(latent)[0][:, :, :prefix], previous[:, :, -prefix:])
    assert not video_mask[:, :, :prefix].any() and video_mask[:, :, prefix:].all()
    assert not audio_mask.any() and torch.equal(streams(latent)[1], audio)
    assert not target.any()
    assert len(cond[0][1]["minimax_keyframes"]) == 2
    assert changed[0][1]["minimax_keyframes"] == [{"resolved_frame_index": 123}]
    assert changed[0][1]["minimax_references"] == ["reference"]
    accepted = native.accept_sample(latent, request, tmp_path)
    native.validate_sample(accepted, {"samples": audio}, request, tmp_path)


def test_first_chunk_locks_audio_and_keeps_all_video_tokens_generatable(tmp_path):
    plan, paths = fixture(tmp_path)
    request = parse(tmp_path, plan, paths, continuityMode=native.POLICY)
    request.media.update(trim=0, original_frames=124)
    video, audio = torch.zeros(1, 24, 37, 2, 4), torch.ones(1, 32, 2, 207)
    _, result = native.prepare_target([], {"samples": [video, audio]}, request, tmp_path, audio_latent={"samples": audio})
    assert result["noise_mask"].unbind()[0].all()
    assert not result["noise_mask"].unbind()[1].any()
    native.validate_sample(native.accept_sample(result, request, tmp_path), {"samples": audio}, request, tmp_path)


@pytest.mark.parametrize("has_parent", [False, True])
@pytest.mark.parametrize("dtype", [torch.float32, torch.float16, torch.bfloat16])
def test_renoised_upscale_audio_is_replaced_by_original_before_masking(tmp_path, has_parent, dtype):
    if has_parent:
        request, video, audio, _ = chain(tmp_path, 39, dtype)
    else:
        plan, paths = fixture(tmp_path)
        request = parse(tmp_path, plan, paths, continuityMode=native.POLICY)
        request.media.update(trim=0, original_frames=124)
        video = torch.zeros(1, 24, 37, 2, 4, dtype=dtype)
        audio = torch.randn(1, 32, 2, 207, dtype=dtype)
    source = audio.clone()
    noisy_audio = audio * 0.4375 + torch.ones_like(audio) * 0.5625
    assert not torch.equal(noisy_audio, audio)
    _, target = native.prepare_target([], {"samples": [video, noisy_audio]}, request, tmp_path,
                                      audio_latent={"samples": audio})
    assert torch.equal(streams(target)[1], source)
    assert not target["noise_mask"].unbind()[1].any()
    assert torch.equal(audio, source)
    accepted = native.accept_sample(target, request, tmp_path)
    native.validate_sample(accepted, {"samples": audio}, request, tmp_path)
    finalize_images(torch.zeros(124, 2, 4, 3), accepted, {"samples": audio}, request, tmp_path)
    saved = st.load_file(str(state_path(tmp_path, request)))
    assert torch.equal(saved["audio"], source)
    streams(accepted)[1].add_(0.5)
    with pytest.raises(ValueError, match="锁定音频"):
        native.validate_sample(accepted, {"samples": audio}, request, tmp_path)


def test_old_native_workflow_missing_original_audio_fails_before_sampling(tmp_path):
    request, video, audio, _ = chain(tmp_path)
    with pytest.raises(ValueError, match="音频修正版"):
        native.prepare_target([], {"samples": [video, audio]}, request, tmp_path)
    with pytest.raises(ValueError, match="原音频编码"):
        native.prepare_target([], {"samples": [video, audio]}, request, tmp_path,
                              audio_latent={"samples": [video, audio]})


@pytest.mark.parametrize("fault", ["video", "audio", "geometry", "dtype", "time", "core", "parent"])
def test_rejects_changed_state_or_incompatible_inputs(tmp_path, fault, monkeypatch):
    request, previous, audio, _ = chain(tmp_path)
    target = torch.zeros_like(previous)
    if fault == "geometry":
        target = torch.zeros(1, 24, 37, 2, 6)
    if fault == "dtype":
        target = target.half()
    if fault == "time":
        request.media["original_frames"] += 1
    if fault == "core":
        monkeypatch.delattr(sys.modules["comfy.model_base"].MiniMaxH3, "_token_grid_masks")
    if fault == "parent":
        (tmp_path / request.relay["parentState"]).write_bytes(b"changed")
    if fault in {"video", "audio"}:
        _, result = native.prepare_target([], {"samples": [target, audio]}, request, tmp_path, audio_latent={"samples": audio})
        streams(result)[fault == "audio"] += 0.5
        with pytest.raises(ValueError, match="改变"):
            native.accept_sample(result, request, tmp_path)
    else:
        with pytest.raises(ValueError):
            native.prepare_target([], {"samples": [target, audio]}, request, tmp_path, audio_latent={"samples": audio})


def test_only_round_trip_residue_is_canonicalized(tmp_path):
    request, previous, audio, _ = chain(tmp_path)
    _, result = native.prepare_target([], {"samples": [torch.zeros_like(previous), audio]}, request, tmp_path, audio_latent={"samples": audio})
    video, actual_audio = streams(result)
    epsilon = torch.finfo(video.dtype).eps
    video[:, :, :7] += epsilon
    actual_audio += epsilon
    accepted = native.accept_sample(result, request, tmp_path)
    assert torch.equal(streams(accepted)[0][:, :, :7], previous[:, :, -7:])
    assert torch.equal(streams(accepted)[1], audio)


def test_old_guide_results_are_not_reused_by_native_chain(tmp_path):
    plan, paths = fixture(tmp_path)
    first = parse(tmp_path, plan, paths)
    complete(tmp_path, first)
    with pytest.raises(ValueError, match="没有匹配"):
        parse(tmp_path, plan, paths, 2, continuityMode=native.POLICY)
    assert parse(tmp_path, plan, paths, continuityMode=native.POLICY).relay["key"] != first.relay["key"]


def decoder():
    profile = SimpleNamespace(tokens_chunk_size=5, token_overlap=2, frame_overlap=5,
                              clip_length=17, token_drop=3, noncausal=False)
    def decode(video):
        # A context-dependent oracle makes right-context use observable.
        count = native.video_frames(video)
        return torch.full((1, count, 2, 4, 3), video[:, :, -5:].mean().item())
    return SimpleNamespace(first_stage_model=profile, decode=decode)


def test_real_future_tokens_are_decode_only_and_audio_timing_is_unchanged(tmp_path):
    request, previous, audio, parent = chain(tmp_path)
    _, result = native.prepare_target([], {"samples": [torch.zeros_like(previous), audio]}, request, tmp_path, audio_latent={"samples": audio})
    streams(result)[0][:, :, 7:12] = 0.75
    original = streams(result)[0].clone()
    images, path = native.decode_parent_context(result, decoder(), request, tmp_path)
    assert path == parent and len(images) == 124
    assert torch.all(images == 0.75)
    assert torch.equal(streams(result)[0], original)
    assert torch.equal(st.load_file(str(tmp_path / request.relay["parentState"]))["video"], previous)
    media = SimpleNamespace(images=torch.zeros(124, 2, 4, 3), frame_rate=24, audio=object())
    def save(frames, soundtrack, path):
        assert len(frames) == 124 and soundtrack is media.audio
        path.write_bytes(b"context video")
    native.save_parent_context(result, decoder(), request, tmp_path,
        lambda p: SimpleNamespace(get_components=lambda: media), save)
    child = complete(tmp_path, request)
    selected = [{"activeIndex": 0, "shotId": "shot_001", "path": parent.relative_to(tmp_path).as_posix()},
                {"activeIndex": 1, "shotId": "shot_002", "path": child.relative_to(tmp_path).as_posix()}]
    merged = validate_merge_selections(tmp_path, "Demo", "run_001", selected)
    assert merged == [tmp_path / request.relay["decodeContext"]["path"], child]
    assert native.contextual_merge_sources(tmp_path, [parent]) == [parent]
    assert native.contextual_merge_sources(tmp_path, [child, parent]) == [child, parent]
    merged[0].write_bytes(b"changed")
    with pytest.raises(ValueError, match="已变化"):
        validate_merge_selections(tmp_path, "Demo", "run_001", selected)


@pytest.mark.parametrize("fault", ["noncausal", "window", "prefix", "length"])
def test_context_decode_rejects_wrong_decoder_or_overlap(tmp_path, fault):
    request, previous, audio, _ = chain(tmp_path)
    _, result = native.prepare_target([], {"samples": [torch.zeros_like(previous), audio]}, request, tmp_path, audio_latent={"samples": audio})
    vae = decoder()
    if fault == "noncausal": vae.first_stage_model.noncausal = True
    if fault == "window": vae.first_stage_model.tokens_chunk_size = 6
    if fault == "prefix": streams(result)[0][:, :, :7] += 1
    if fault == "length": vae.decode = lambda v: torch.zeros(124, 2, 4, 3)
    with pytest.raises(ValueError):
        native.decode_parent_context(result, vae, request, tmp_path)


@pytest.mark.parametrize("batched", [False, True])
@pytest.mark.parametrize("parent_trim", [0, 22, 39])
def test_context_decode_counts_frames_after_single_video_batch_conversion(tmp_path, monkeypatch, batched, parent_trim):
    request, previous, audio, _ = chain(tmp_path, 39)
    _, result = native.prepare_target([], {"samples": [torch.zeros_like(previous), audio]},
                                     request, tmp_path, audio_latent={"samples": audio})
    monkeypatch.setattr(native, "parent_video", lambda *args: previous)
    monkeypatch.setattr(sys.modules["theodore_director.video_results"], "read_video_result_metadata",
                        lambda path: SimpleNamespace(relay={"continuityMode": native.POLICY,
                                                           "contextFrames": parent_trim}))
    count = native.video_frames(previous)
    images = torch.arange((count + 17) * 2 * 4 * 3).reshape(count + 17, 2, 4, 3).float()
    vae = decoder()
    vae.decode = lambda v: images.unsqueeze(0) if batched else images
    actual, _ = native.decode_parent_context(result, vae, request, tmp_path)
    assert actual.ndim == 4
    assert torch.equal(actual, images[parent_trim:count])


@pytest.mark.parametrize("shape", [(2, 141, 2, 4, 3), (1, 140, 2, 4, 3),
                                   (1, 141, 2, 4, 1), (141, 2, 4), (141, 2, 4, 1)])
def test_context_decode_rejects_bad_batch_frame_count_or_rgb_shape(tmp_path, shape):
    request, previous, audio, _ = chain(tmp_path)
    _, result = native.prepare_target([], {"samples": [torch.zeros_like(previous), audio]},
                                     request, tmp_path, audio_latent={"samples": audio})
    vae = decoder()
    vae.decode = lambda v: torch.zeros(shape)
    with pytest.raises(ValueError, match="解码.*(形状|帧数)"):
        native.decode_parent_context(result, vae, request, tmp_path)


def test_native_workflow_both_sampler_inputs_use_masked_target_and_vae_is_connected():
    path = Path(__file__).parents[1] / "workflows/YuQ导播台-原生接力测试.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    nodes = {n["id"]: n for n in data["nodes"]}
    links = {link[0]: link for link in data["links"]}
    for link_id, origin, slot, destination, port, _ in data["links"]:
        assert nodes[destination]["inputs"][port]["link"] == link_id
        assert link_id in nodes[origin]["outputs"][slot]["links"]
    assert nodes[402]["widgets_values_named"]["native_continuity"] is True
    for sampler, prep, final in [(411, 620, 621), (439, 622, 623)]:
        port = next(item for item in nodes[sampler]["inputs"] if item["name"] == "latent_image")
        assert links[port["link"]][1:3] == [prep, 1]
        assert next(item for item in nodes[final]["inputs"] if item["name"] == "vae")["link"] is not None
        assert nodes[prep]["type"] == "TheodoreDirector_SecondPassRelay"
        audio = next(item for item in nodes[prep]["inputs"] if item["name"] == "audio_latent")
        assert links[audio["link"]][1:3] == [406, 0]
    audio = next(item for item in nodes[437]["inputs"] if item["name"] == "audio_latent")
    assert links[audio["link"]][1:3] == [406, 0]
    assert not {434, 435}.intersection(nodes)


def test_actual_core_x0_wrapper_preserves_native_video_prefix_and_audio():
    source = Path(__file__).parents[2] / ".codex/tmp/continuity-research-20261114/sources/Comfy-Org__ComfyUI-stable/comfy/samplers.py"
    if not source.is_file():
        pytest.skip("pinned ComfyUI source required for upstream contract check")
    tree = ast.parse(source.read_text(encoding="utf-8"))
    klass = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "KSamplerX0Inpaint")
    namespace = {}
    exec(compile(ast.Module(body=[klass], type_ignores=[]), str(source), "exec"), namespace)
    video, audio = torch.randn(1, 24, 37, 2, 4), torch.randn(1, 32, 2, 207)
    mask = torch.ones(1, 1, 37, 2, 4)
    mask[:, :, :7] = 0
    # ComfyUI expands and packs each AV member before the x0 wrapper.
    pair = torch.cat((video.flatten(1), audio.flatten(1)), dim=1)
    native_mask = torch.cat((mask.expand_as(video).flatten(1), torch.zeros_like(audio).flatten(1)), dim=1)
    base = SimpleNamespace(scale_latent_inpaint=lambda **kw: kw["latent_image"])
    class Model:
        inner_model = base
        def __call__(self, x, sigma, **kwargs): return x * 0 + 123
    wrapper = namespace["KSamplerX0Inpaint"](Model(), torch.tensor([0.8, 0]))
    wrapper.latent_image, wrapper.noise = pair, pair * 0
    result = wrapper(pair * 0, torch.tensor([0.8]), native_mask)
    actual_video = result[:, :video.numel()].reshape_as(video)
    actual_audio = result[:, video.numel():].reshape_as(audio)
    assert torch.equal(actual_video[:, :, :7], video[:, :, :7])
    assert torch.equal(actual_audio, audio)
    assert (actual_video[:, :, 7:] == 123).all()


@pytest.mark.parametrize("frames", [5, 22, 39, 56])
@pytest.mark.parametrize("dtype", [torch.float32, torch.float16, torch.bfloat16])
def test_context_decode_matches_continuous_timeline_with_actual_core_windows(tmp_path, frames, dtype):
    source = Path(__file__).parents[2] / ".codex/tmp/continuity-research-20261114/sources/Comfy-Org__ComfyUI-stable/comfy/ldm/minimax/vae.py"
    if not source.is_file():
        pytest.skip("pinned ComfyUI source required for upstream temporal contract check")
    tree = ast.parse(source.read_text(encoding="utf-8"))
    klass = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "MiniMaxH3VideoVAE")
    names = {"blend", "decode_output_shape", "_decode_temporal_pad_frames", "_decode_temporal_frame_plan",
             "_decode_temporal_chunks", "decode_temporal"}
    functions = [n for n in klass.body if isinstance(n, ast.FunctionDef) and n.name in names]
    namespace = {"torch": torch}
    future = ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0)
    exec(compile(ast.fix_missing_locations(ast.Module(body=[future, *functions], type_ignores=[])),
                 str(source), "exec"), namespace)
    model = type("NativeTemporal", (), {name: namespace[name] for name in names})()
    for key, value in vars(decoder().first_stage_model).items():
        setattr(model, key, value)
    model.vae_ratio_t, model.frame_pre_padding, model.vae_ratio = 4, 3, 1
    model.decoder = SimpleNamespace(out_channels=3)
    model._finalize_pixels = lambda x: x
    # Only the neural decoder is synthetic; all temporal windows come from core.
    model._adaptive_decode = lambda z: (z[:, :3] + z[:, :3].mean(dim=2, keepdim=True)).repeat_interleave(4, dim=2)

    def decode(video):
        buffer = torch.empty(model.decode_output_shape(video.shape), dtype=video.dtype)
        return model.decode_temporal(video, output_buffer=buffer).movedim(1, -1)

    vae = SimpleNamespace(first_stage_model=model, decode=decode)
    request, previous, audio, _ = chain(tmp_path, frames, dtype)
    generator = torch.Generator().manual_seed(87)
    target = torch.randn(previous.shape, generator=generator).to(dtype)
    _, result = native.prepare_target([], {"samples": [target, audio]}, request, tmp_path, audio_latent={"samples": audio})

    current = streams(result)[0]
    corrected_left, _ = native.decode_parent_context(result, vae, request, tmp_path)
    right = decode(current)[0, frames:]
    prefix = native.context_tokens(frames)
    full_timeline = decode(torch.cat((previous, current[:, :, prefix:]), dim=2))[0]
    assert torch.equal(torch.cat((corrected_left, right)), full_timeline)
    assert not torch.equal(torch.cat((decode(previous)[0], right)), full_timeline)
