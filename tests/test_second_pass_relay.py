import copy
from pathlib import Path
from types import SimpleNamespace

import pytest

from theodore_director.schema import DEFAULT_PLAN
from theodore_director.second_pass_relay import (
    align_second_pass_images, apply_context, finalize_images, fingerprint, invalid_reason, matching_result, match_second_pass, source_media, state_path,
)
from theodore_director.video_results import parse_second_pass_request, read_video_result_metadata, write_video_result_metadata


def fixture(root):
    plan = copy.deepcopy(DEFAULT_PLAN)
    plan["project"] = {"id": "test", "name": "Demo", "runId": "run_001"}
    plan["shots"] = [{"id": f"shot_{n:03}", "title": str(n), "prompt": str(n), "durationSeconds": 5,
                      "enabled": True, "latentRelay": n > 1} for n in range(1, 4)]
    paths = {}
    for shot in plan["shots"]:
        p = root / "TheodoreDirector/Demo_run_001" / f'{shot["id"]}_video_00001_.mp4'
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(b"first pass")
        paths[shot["id"]] = p.relative_to(root).as_posix()
    return plan, paths


def parse(root, plan, paths, shot=1, **extra):
    sid = f"shot_{shot:03}"
    data = dict(plan=plan, shotId=sid, sourcePath=paths[sid], requestId=f"test-{shot}",
                processingMode="super_resolution_second_pass", denoise=0.25, relayVersion=1,
                sourceSelections=paths, workflowSignature="model-A-graph")
    data.update(extra)
    return parse_second_pass_request(root, data)


def complete(root, request, name="00002"):
    state = state_path(root, request)
    state.parent.mkdir(parents=True, exist_ok=True)
    state.write_bytes(b"native AV")
    video = root / f"{request.output_prefix}_{name}_.mp4"
    video.write_bytes(name.encode())
    info = {**request.relay, "state": state.relative_to(root).as_posix(), "stateFingerprint": fingerprint(state),
            "videoFingerprint": fingerprint(video)}
    write_video_result_metadata(video, stage="second_pass", shot_id=request.shot.shot.id,
                                plan_hash=request.plan.plan_hash, source_path=request.source_relative,
                                processing_mode=request.processing_mode, relay=info)
    return video


def test_chain_requires_current_parent_and_resumes_with_valid_native_state(tmp_path):
    plan, paths = fixture(tmp_path)
    with pytest.raises(ValueError, match="没有匹配"):
        parse(tmp_path, plan, paths, 2)
    first = parse(tmp_path, plan, paths)
    assert first.relay["parent"] == ""
    video = complete(tmp_path, first)
    second = parse(tmp_path, plan, paths, 2)
    assert second.relay["parent"] == video.relative_to(tmp_path).as_posix()
    complete(tmp_path, second)
    third = parse(tmp_path, plan, paths, 3)
    assert matching_result(tmp_path, first.plan, "shot_001", first.relay["key"]) == video
    assert third.relay["contextFrames"] == 22


@pytest.mark.parametrize("change", ["selected", "denoise", "workflow", "context", "seed", "base_seed", "deleted_state", "changed_state"])
def test_changed_sources_settings_or_latent_cannot_resume_old_chain(tmp_path, change):
    plan, paths = fixture(tmp_path)
    first = parse(tmp_path, plan, paths)
    complete(tmp_path, first)
    extra = {}
    if change == "selected":
        alternate = tmp_path / paths["shot_001"].replace("00001", "00009")
        alternate.write_bytes(b"different selected first pass")
        paths["shot_001"] = alternate.relative_to(tmp_path).as_posix()
    elif change == "denoise": extra["denoise"] = 0.3
    elif change == "workflow": extra["workflowSignature"] = "model-B"
    elif change == "context": plan["continuity"]["videoContextFrames"] = 39
    elif change == "seed": plan["shots"][0]["seed"] = 99
    elif change == "base_seed": plan["defaults"]["baseSeed"] = 999
    elif change == "deleted_state": state_path(tmp_path, first).unlink()
    elif change == "changed_state": state_path(tmp_path, first).write_bytes(b"other native AV")
    with pytest.raises(ValueError, match="没有匹配"):
        parse(tmp_path, plan, paths, 2, **extra)


def test_new_parent_generation_invalidates_child_without_deleting_old_videos(tmp_path):
    plan, paths = fixture(tmp_path)
    root = parse(tmp_path, plan, paths)
    older = complete(tmp_path, root)
    child = parse(tmp_path, plan, paths, 2)
    child_video = complete(tmp_path, child)
    rerun = parse(tmp_path, plan, paths, requestId="rerun")
    newer = complete(tmp_path, rerun, "00003")
    current = parse(tmp_path, plan, paths, 2)
    assert current.relay["key"] != child.relay["key"]
    assert current.relay["parent"] == newer.relative_to(tmp_path).as_posix()
    assert older.is_file() and child_video.is_file()
    assert matching_result(tmp_path, current.plan, "shot_002", current.relay["key"]) is None


def test_missing_upstream_invalidates_downstream_results(tmp_path):
    plan, paths = fixture(tmp_path)
    first = parse(tmp_path, plan, paths)
    complete(tmp_path, first)
    child = parse(tmp_path, plan, paths, 2)
    video = complete(tmp_path, child)
    state_path(tmp_path, first).unlink()
    assert invalid_reason(tmp_path, read_video_result_metadata(video))


def test_cut_starts_new_chain_and_legacy_requests_remain_independent(tmp_path):
    plan, paths = fixture(tmp_path)
    plan["shots"][1]["latentRelay"] = False
    assert parse(tmp_path, plan, paths, 2).relay["parent"] == ""
    assert parse(tmp_path, plan, paths, 2, relayVersion=0).relay == {}
    assert parse(tmp_path, plan, paths, 2, processingMode="super_resolution_only").relay == {}


def test_source_media_prepends_real_parent_frames_and_preserves_original_audio(tmp_path):
    torch = pytest.importorskip("torch")
    plan, paths = fixture(tmp_path)
    first = parse(tmp_path, plan, paths)
    parent_video = complete(tmp_path, first)
    request = parse(tmp_path, plan, paths, 2)
    original = torch.ones(102, 4, 6, 3)
    original_audio = {"waveform": torch.ones(1, 2, 102 * 1000), "sample_rate": 24000}
    old = SimpleNamespace(images=torch.zeros(124, 8, 12, 3), frame_rate=24,
                          audio={"waveform": torch.zeros(1, 2, 124 * 1000), "sample_rate": 24000})
    def load(path):
        assert Path(path) == parent_video
        return SimpleNamespace(get_components=lambda: old)
    images, audio = source_media(request, SimpleNamespace(images=original, audio=original_audio, frame_rate=24), tmp_path, load)
    assert images.shape == (124, 4, 6, 3)
    assert torch.equal(images[:22], torch.zeros(22, 4, 6, 3))
    assert torch.equal(images[22:], original)
    assert audio["waveform"].shape[-1] == 124000
    assert torch.equal(audio["waveform"][..., 22000:], original_audio["waveform"])
    assert request.media["original_audio"] is original_audio
    assert request.media["original_frames"] == 102


def test_finalize_crops_context_and_keeps_native_video_with_actual_source_audio(tmp_path):
    torch = pytest.importorskip("torch")
    st = pytest.importorskip("safetensors.torch")
    plan, paths = fixture(tmp_path)
    request = parse(tmp_path, plan, paths)
    request.media.update(trim=22, original_frames=102)
    images = torch.arange(124).reshape(124, 1, 1, 1)
    video = torch.randn(1, 4, 37, 2, 3)
    sampler_audio = torch.randn(1, 2, 2, 207)
    source_audio = torch.zeros_like(sampler_audio)
    result = finalize_images(images, {"samples": [video, sampler_audio]}, {"samples": source_audio}, request, tmp_path)
    assert torch.equal(result, images[22:124])
    state = st.load_file(str(state_path(tmp_path, request)))
    assert torch.equal(state["video"], video)
    assert torch.equal(state["audio"], source_audio)
    with pytest.raises(ValueError, match="帧数不足"):
        finalize_images(images[:50], {"samples": [video, sampler_audio]}, {"samples": source_audio}, request, tmp_path)


@pytest.mark.parametrize("interface", ["enum", "integer", "latent_only"])
def test_motion_context_interface_gets_high_resolution_tail_and_native_av(tmp_path, interface):
    torch = pytest.importorskip("torch")
    st = pytest.importorskip("safetensors.torch")
    plan, paths = fixture(tmp_path)
    first = parse(tmp_path, plan, paths)
    video = complete(tmp_path, first)
    state = state_path(tmp_path, first)
    st.save_file({"video": torch.zeros(1, 4, 37, 2, 4), "audio": torch.zeros(1, 2, 2, 207)}, str(state))
    meta = read_video_result_metadata(video)
    write_video_result_metadata(video, stage=meta.stage, shot_id=meta.shot_id, plan_hash=meta.plan_hash,
                                source_path=meta.source_path, processing_mode=meta.processing_mode,
                                relay={**meta.relay, "stateFingerprint": fingerprint(state)})
    request = parse(tmp_path, plan, paths, 2)
    request.media["context_frames"] = torch.ones(22, 32, 48, 3)
    class Context:
        FUNCTION = "apply"
        @classmethod
        def INPUT_TYPES(cls):
            fields = {"conditioning": ("CONDITIONING",), "latent": ("LATENT",), "vae": ("VAE",),
                      "context_length": (["22", "5", "39", "56"],) if interface == "enum" else ("INT", {"max": 39}),
                      "audio_context_length": ("INT",), "context_latent": ("LATENT",)}
            if interface != "latent_only": fields["context_frames"] = ("IMAGE",)
            return {"required": fields}
        def apply(self, **kwargs):
            assert kwargs["context_length"] == ("22" if interface == "enum" else 22)
            if interface != "latent_only": assert kwargs["context_frames"].shape == (22, 32, 48, 3)
            assert len(kwargs["context_latent"]["samples"]) == 2
            return (["pinned"], 22)
    latent = {"samples": [torch.zeros(1, 4, 37, 2, 4), torch.zeros(1, 2, 2, 207)]}
    assert apply_context([], latent, object(), request, tmp_path, Context) == ["pinned"]


def test_rtx_output_uses_h3_aligned_dimensions_and_preserves_frames():
    torch = pytest.importorskip("torch")
    images = torch.rand(2, 400, 752, 3)
    aligned = align_second_pass_images(images)
    assert tuple(aligned.shape) == (2, 416, 768, 3)
    assert aligned.isfinite().all()
    assert align_second_pass_images(aligned) is aligned


@pytest.mark.parametrize("fps,frames,expected", [(25, 124, "24 FPS"), (24, 123, "17n\\+5")])
def test_invalid_source_time_grid_stops_before_sampling(tmp_path, fps, frames, expected):
    torch = pytest.importorskip("torch")
    plan, paths = fixture(tmp_path)
    request = parse(tmp_path, plan, paths)
    media = SimpleNamespace(images=torch.ones(frames, 4, 6, 3), frame_rate=fps,
                            audio={"waveform": torch.zeros(1, 2, 10000), "sample_rate": 24000})
    with pytest.raises(ValueError, match=expected):
        source_media(request, media, tmp_path, None)

def test_join_match_first_clip_and_disabled_strength_do_not_load_state(tmp_path):
    latent = {"samples": object()}
    assert match_second_pass(latent, SimpleNamespace(relay={}), tmp_path, None) is latent
    assert match_second_pass(latent, SimpleNamespace(relay={"parent": "missing"}), tmp_path, None, 0) is latent


def test_join_match_uses_previous_native_av_and_saves_corrected_video(tmp_path):
    torch = pytest.importorskip("torch")
    st = pytest.importorskip("safetensors.torch")
    plan, paths = fixture(tmp_path)
    first = parse(tmp_path, plan, paths)
    parent = complete(tmp_path, first)
    state = state_path(tmp_path, first)
    previous = torch.ones(1, 4, 37, 2, 4)
    audio = torch.ones(1, 2, 2, 207)
    st.save_file({"video": previous, "audio": audio}, str(state))
    meta = read_video_result_metadata(parent)
    write_video_result_metadata(parent, stage=meta.stage, shot_id=meta.shot_id, plan_hash=meta.plan_hash,
                                source_path=meta.source_path, processing_mode=meta.processing_mode,
                                relay={**meta.relay, "stateFingerprint": fingerprint(state)})
    request = parse(tmp_path, plan, paths, 2)
    request.media.update(trim=22, original_frames=102)
    original = {"samples": [torch.zeros_like(previous), torch.zeros_like(audio)]}
    corrected = {"samples": [torch.full_like(previous, 0.5), original["samples"][1]]}
    class Match:
        FUNCTION = "apply"
        def apply(self, **kwargs):
            assert kwargs["samples"] is original
            assert kwargs["context_length"] == 22
            assert kwargs["tuning"] == "auto" and kwargs["strength"] == 0.8
            assert torch.equal(kwargs["context_latent"]["samples"][0], previous)
            assert torch.equal(kwargs["context_latent"]["samples"][1], audio)
            return (corrected,)
    result = match_second_pass(original, request, tmp_path, Match, 0.8)
    assert result is corrected
    finalize_images(torch.zeros(124, 4, 4, 3), result, {"samples": audio}, request, tmp_path)
    saved = st.load_file(str(state_path(tmp_path, request)))
    assert torch.equal(saved["video"], corrected["samples"][0])
    assert torch.equal(saved["audio"], audio)
    state.write_bytes(b"changed")
    with pytest.raises(ValueError, match="latent"):
        match_second_pass(original, request, tmp_path, Match)
