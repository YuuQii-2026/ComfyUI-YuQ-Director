"""Make postprocessing consume the same adjacent decode as first-pass merging."""

from __future__ import annotations

from pathlib import Path

REVISION = 1


def resolve(root, plan, shot_id, source, selections, workflow=""):
    from .native_continuity import contextual_merge_sources
    from .paths import find_generated_videos
    from .second_pass_relay import _digest, checked_file, fingerprint, invalid_reason
    from .video_results import metadata_path, read_video_result_metadata

    active = list(plan.active_shots)
    index = next((i for i, shot in enumerate(active) if shot.id == shot_id), -1)
    dependencies = {}

    def record(path):
        dependencies[path.relative_to(root).as_posix()] = fingerprint(path)
        sidecar = metadata_path(path)
        if sidecar.is_file():
            dependencies[sidecar.relative_to(root).as_posix()] = fingerprint(sidecar)

    record(source)
    meta = read_video_result_metadata(source)
    if meta and (meta.relay or meta.source_context):
        reason = invalid_reason(root, meta)
        if reason:
            raise ValueError(reason)
    rendered, right = source, None
    if index >= 0 and index + 1 < len(active) and isinstance(selections, dict):
        successor = active[index + 1]
        value = selections.get(successor.id)
        if (plan.continuity.mode == "h3_av_latent" and successor.latent_relay
                and isinstance(value, str) and value):
            right = checked_file(root, value)
            if right not in find_generated_videos(root, plan.project_name, plan.run_id, successor.id, -1):
                raise ValueError("连续解码的右侧选片不属于对应分镜")
            rendered = contextual_merge_sources(root, [source, right])[0]
            record(right)
    record(rendered)
    info = {"revision": REVISION, "workflow": workflow, "source": source.relative_to(root).as_posix(),
            "renderPath": rendered.relative_to(root).as_posix(),
            "right": right.relative_to(root).as_posix() if right else "", "dependencies": dependencies}
    info["key"] = _digest(info)
    return info


def check(root: Path, info: dict) -> None:
    if not info:
        return
    from .second_pass_relay import _digest, checked_file, fingerprint
    from .video_results import read_video_result_metadata
    from .first_pass_continuity import POLICY, invalid_reason

    if info.get("revision") != REVISION or info.get("key") != _digest({k: v for k, v in info.items() if k != "key"}):
        raise ValueError("后处理画面来源记录无效，请重新执行")
    for name, stamp in info["dependencies"].items():
        if fingerprint(checked_file(root, name)) != stamp:
            raise ValueError("后处理原片、连续解码或相邻选片已变化，请重新执行")
    for key in ("source", "right"):
        if not info.get(key):
            continue
        meta = read_video_result_metadata(checked_file(root, info[key]))
        if meta and meta.relay.get("continuityMode") == POLICY:
            reason = invalid_reason(root, meta)
            if reason:
                raise ValueError(reason)


def path_for(root, request):
    from .second_pass_relay import checked_file

    check(root, request.source_context)
    return checked_file(root, request.source_context["renderPath"]) if request.source_context else request.source_path


def matching_upscale(root, request, workflow):
    from .paths import find_generated_videos
    from .second_pass_relay import invalid_reason
    from .video_results import read_video_result_metadata

    for path in find_generated_videos(root, request.plan.project_name, request.plan.run_id, request.shot.shot.id, -1):
        meta = read_video_result_metadata(path)
        if (meta and meta.stage == "upscaled" and meta.source_path == request.source_relative
                and meta.processing_mode == request.processing_mode
                and meta.source_context.get("key") == request.source_context.get("key")
                and meta.source_context.get("workflow") == workflow and not invalid_reason(root, meta)):
            return path
    return None
