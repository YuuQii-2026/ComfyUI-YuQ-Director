from types import SimpleNamespace

import pytest

from theodore_director.render_source import check, matching_upscale, path_for
from theodore_director.second_pass_relay import invalid_reason, source_media
from theodore_director.video_results import parse_second_pass_request, read_video_result_metadata, write_video_result_metadata
from test_first_pass_continuity import core, finish, plan_for
from test_second_pass_relay import complete, fixture, parse


def test_postprocess_uses_the_exact_firstpass_merge_pixels(tmp_path, core):
    plan = plan_for()
    _, _, left = finish(tmp_path, plan, 0)
    _, info, right = finish(tmp_path, plan, 1)
    data = dict(plan=plan.to_dict(), shotId="shot_0", sourcePath=left.relative_to(tmp_path).as_posix(),
                requestId="test", processingMode="super_resolution_only",
                sourceSelections={"shot_1": right.relative_to(tmp_path).as_posix()}, workflowSignature="graph")
    request = parse_second_pass_request(tmp_path, data)
    assert path_for(tmp_path, request) == tmp_path / info["decodeContext"]["path"]
    assert request.relay == {}
    isolated = parse_second_pass_request(tmp_path, {**data, "sourceSelections": {}})
    assert path_for(tmp_path, isolated) == left
    assert isolated.source_context["key"] != request.source_context["key"]
    path_for(tmp_path, request).write_bytes(b"replaced decoded pixels")
    with pytest.raises(ValueError, match="已变化"):
        check(tmp_path, request.source_context)


def test_upscale_cache_includes_workflow_and_source_receipt(tmp_path):
    plan, paths = fixture(tmp_path)
    request = parse(tmp_path, plan, paths, processingMode="super_resolution_only")
    result = tmp_path / f"{request.output_prefix}_00003_.mp4"
    result.write_bytes(b"upscaled")
    write_video_result_metadata(result, stage="upscaled", shot_id=request.shot.shot.id, plan_hash=request.plan.plan_hash,
                                source_path=request.source_relative, processing_mode=request.processing_mode,
                                source_context=request.source_context)
    assert matching_upscale(tmp_path, request, "model-A-graph") == result
    changed = parse(tmp_path, plan, paths, processingMode="super_resolution_only", workflowSignature="changed")
    assert matching_upscale(tmp_path, changed, "changed") is None
    (tmp_path / paths["shot_002"]).write_bytes(b"right take overwritten")
    assert invalid_reason(tmp_path, read_video_result_metadata(result))


def test_native_secondpass_uses_low_source_history_and_exact_hd_state(tmp_path):
    import torch

    plan, paths = fixture(tmp_path)
    first = parse(tmp_path, plan, paths, continuityMode="h3_native_prefix_right_context_v1")
    parent = complete(tmp_path, first)
    request = parse(tmp_path, plan, paths, 2, continuityMode="h3_native_prefix_right_context_v1")
    assert request.relay["parent"] == parent.relative_to(tmp_path).as_posix()
    assert request.relay["parentSource"] == paths["shot_001"]
    audio = {"sample_rate": 24000, "waveform": torch.ones(1, 2, 24000 * 5)}
    # A continuation delivers 119 frames; prepending 22 gives a legal 141-frame H3 input.
    original = torch.full((119, 2, 4, 3), .3)
    loaded = []
    def load(name):
        loaded.append(name)
        return SimpleNamespace(get_components=lambda: SimpleNamespace(
            images=torch.full((124, 2, 4, 3), .7), audio=audio, frame_rate=24))
    frames, combined_audio = source_media(request, SimpleNamespace(images=original, audio=audio, frame_rate=24), tmp_path, load)
    assert loaded == [str(tmp_path / paths["shot_001"])]
    assert len(frames) == 141 and torch.all(frames[:22] == .7)
    assert torch.equal(frames[22:], original)
    assert request.media["original_audio"] is audio
    assert combined_audio["waveform"].shape[-1] == 142000


def test_merge_rejects_a_processed_neighbor_from_another_take(tmp_path):
    from theodore_director.native_continuity import contextual_merge_sources
    plan, paths = fixture(tmp_path)
    request = parse(tmp_path, plan, paths, processingMode="super_resolution_only")
    left = tmp_path / f"{request.output_prefix}_00003_.mp4"
    left.write_bytes(b"left")
    write_video_result_metadata(left, stage="upscaled", shot_id="shot_001", plan_hash="test",
                                source_path=request.source_relative, source_context=request.source_context)
    right = left.with_name("shot_002_video_upscaled_00003_.mp4")
    right.write_bytes(b"right")
    write_video_result_metadata(right, stage="upscaled", shot_id="shot_002", plan_hash="test", source_path="another.mp4")
    with pytest.raises(ValueError, match="选片不同"):
        contextual_merge_sources(tmp_path, [left, right])
