"""二采链的来源校验、上下文准备和原生 AV 状态保存。"""

from __future__ import annotations

import hashlib
import inspect
import json
import math
import os
from pathlib import Path
from typing import Any

from .paths import build_output_paths_from_values, find_generated_videos
from .selection import shot_hash

RELAY_VERSION = 1
ALIGNMENT_REVISION = 3


def fingerprint(path: Path) -> str:
    stat = path.stat()
    return f"{stat.st_size}:{stat.st_mtime_ns}"


def _digest(value: Any) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def checked_file(root: Path, relative: str) -> Path:
    path = (root / relative).resolve()
    path.relative_to(root.resolve())
    if not path.is_file():
        raise ValueError(f"二采接力文件不存在: {relative}")
    return path


def matching_result(root, plan, shot_id, key):
    from .video_results import read_video_result_metadata

    for path in find_generated_videos(root, plan.project_name, plan.run_id, shot_id, -1):
        meta = read_video_result_metadata(path)
        if not meta or meta.stage != "second_pass" or meta.relay.get("key") != key:
            continue
        try:
            if invalid_reason(root, meta):
                continue
            state = checked_file(root, meta.relay["state"])
            if fingerprint(state) == meta.relay["stateFingerprint"] and fingerprint(path) == meta.relay["videoFingerprint"]:
                return path
        except (KeyError, OSError, ValueError):
            continue
    return None


def invalid_reason(root, metadata, visited=None):
    """在结果列表与合并前检查磁盘上的来源链，不把失效二采当成成片。"""
    from .video_results import read_video_result_metadata

    from .first_pass_continuity import POLICY as FIRST_PASS_POLICY, invalid_reason as first_pass_invalid_reason
    from .render_source import check

    try:
        check(root, metadata.source_context)
    except (OSError, ValueError, KeyError, TypeError) as error:
        return f"后处理画面来源已失效：{error}"
    if metadata.relay.get("continuityMode") == FIRST_PASS_POLICY:
        return first_pass_invalid_reason(root, metadata)
    if metadata.stage != "second_pass":
        return ""
    info = metadata.relay
    if info.get("version") != RELAY_VERSION:
        return "旧二采结果没有接力状态，请重新执行二采"
    visited = set() if visited is None else visited
    key = info.get("key")
    if not key or key in visited:
        return "二采接力来源链无效"
    visited.add(key)
    try:
        source = checked_file(root, metadata.source_path)
        state = checked_file(root, info["state"])
        if fingerprint(source) != info["sourceFingerprint"] or fingerprint(state) != info["stateFingerprint"]:
            return "一采来源或二采 latent 已变化，请重跑本段及后续接力段"
        if info.get("parent"):
            parent = checked_file(root, info["parent"])
            parent_state = checked_file(root, info["parentState"])
            if fingerprint(parent) != info["parentFingerprint"] or fingerprint(parent_state) != info["parentStateFingerprint"]:
                return "上一段二采已变化，请重跑接力链"
            meta = read_video_result_metadata(parent)
            if meta:
                for record in parent.parent.glob("*.theodore.json"):
                    candidate = record.with_name(record.name[:-len(".theodore.json")])
                    newer = read_video_result_metadata(candidate)
                    if (newer and newer.stage == "second_pass" and newer.shot_id == meta.shot_id
                            and newer.source_path == meta.source_path and newer.processing_mode == meta.processing_mode
                            and candidate.is_file() and candidate.stat().st_mtime_ns > parent.stat().st_mtime_ns
                            and newer.relay.get("version") == RELAY_VERSION):
                        return "上一段已有新的二采结果，请重跑后续接力段"
            return invalid_reason(root, meta, visited) if meta else "上一段二采记录缺失"
    except (OSError, KeyError, ValueError):
        return "接力来源或 latent 文件缺失，请重跑接力链"
    return ""


def resolve_relay(root, plan, shot_id, source, mode, data):
    """仅复用当前选片及整条上游链仍匹配的结果。旧请求保持独立后处理。"""
    if data.get("relayVersion") != RELAY_VERSION or mode == "super_resolution_only":
        return {}
    workflow = data.get("workflowSignature")
    selections = data.get("sourceSelections")
    denoise = data.get("denoise", plan.to_dict().get("pipeline", {}).get("secondPassDenoise", 0.3))
    if not isinstance(workflow, str) or not workflow or not isinstance(selections, dict):
        raise ValueError("二采接力缺少工作流签名或选片记录，请更新插件并重新打开导播台")
    if isinstance(denoise, bool) or not isinstance(denoise, (int, float)) or not math.isfinite(denoise) or not 0 <= denoise <= 1:
        raise ValueError("二采重绘强度必须在 0 到 1 之间")
    selected = {**selections, shot_id: source.relative_to(root).as_posix()}
    active = list(plan.active_shots)
    indices = {shot.id: i for i, shot in enumerate(active)}
    shots = {shot.id: shot for shot in plan.shots}
    memo = {}

    def expected(current_id):
        if current_id in memo:
            return memo[current_id]
        shot = shots[current_id]
        value = selected.get(current_id)
        if not isinstance(value, str):
            raise ValueError(f"接力上一段 {shot.title} 缺少选定的一采结果，请在审片页选择并通过")
        path = checked_file(root, value)
        if path not in find_generated_videos(root, plan.project_name, plan.run_id, current_id, -1):
            raise ValueError(f"二采选片不属于分镜 {shot.title}")
        from .video_results import read_video_result_metadata
        source_meta = read_video_result_metadata(path)
        if source_meta and source_meta.stage not in {"first_pass", "legacy_unknown"}:
            raise ValueError(f"二采接力要求一采结果: {shot.title}")
        previous = None
        index = indices.get(current_id, -1)
        if index > 0 and shot.latent_relay and plan.continuity.mode == "h3_av_latent":
            previous_shot = active[index - 1]
            upstream = expected(previous_shot.id)
            previous = matching_result(root, plan, previous_shot.id, upstream["key"])
            if previous is None:
                raise ValueError(f"上一段「{previous_shot.title}」没有匹配的二采接力状态，请在审片页按整条接力链执行二采")
        parent = read_video_result_metadata(previous) if previous else None
        from .render_source import resolve

        context = resolve(root, plan, current_id, path, selected, workflow)
        info = {
            "version": RELAY_VERSION,
            "sourceFingerprint": fingerprint(path),
            "parent": previous.relative_to(root).as_posix() if previous else "",
            "parentFingerprint": fingerprint(previous) if previous else "",
            "parentState": parent.relay["state"] if parent else "",
            "parentStateFingerprint": parent.relay["stateFingerprint"] if parent else "",
            "contextFrames": plan.continuity.video_context_frames if previous else 0,
            "audioContextFrames": plan.continuity.audio_context_frames,
            "renderSourceKey": context["key"],
        }
        if data.get("continuityMode"):
            from .native_continuity import POLICY

            if data["continuityMode"] != POLICY:
                raise ValueError("未知的二采接力实验版本")
            info["continuityMode"] = POLICY
            if parent:
                from .render_source import path_for
                from types import SimpleNamespace

                low_source = path_for(root, SimpleNamespace(source_context=parent.source_context,
                                                           source_path=checked_file(root, parent.source_path)))
                info.update(parentSource=low_source.relative_to(root).as_posix(),
                            parentSourceFingerprint=fingerprint(low_source))
        seed = shot.seed if shot.seed is not None else plan.base_seed + next(i for i, item in enumerate(plan.shots) if item.id == current_id)
        info["key"] = _digest({**info, "alignmentRevision": ALIGNMENT_REVISION, "source": value, "shot": shot_hash(plan, shot), "seed": seed,
                               "mode": mode, "denoise": denoise, "workflow": workflow})
        memo[current_id] = info
        return info

    return expected(shot_id)


def state_path(root, request):
    token = _digest([request.request_id, request.relay["key"]])[:24]
    paths = build_output_paths_from_values(request.plan.project_name, request.plan.run_id, request.shot.shot.id, 0)
    name = Path(paths.video_prefix).name.removesuffix("_video")
    result = (root / paths.run_prefix / "second_pass_context" / f"{name}_{token}.safetensors").resolve()
    result.relative_to(root.resolve())
    return result


def check_sources(root, request):
    from .render_source import check

    check(root, request.source_context)
    if fingerprint(request.source_path) != request.relay["sourceFingerprint"]:
        raise ValueError("采样期间一采来源发生变化，请重新执行二采")
    if request.relay.get("parent"):
        for path_key, stamp_key in [("parent", "parentFingerprint"), ("parentState", "parentStateFingerprint")]:
            if fingerprint(checked_file(root, request.relay[path_key])) != request.relay[stamp_key]:
                raise ValueError("采样期间上一段二采或 latent 发生变化，请重新执行接力链")
        if request.relay.get("parentSource") and fingerprint(checked_file(root, request.relay["parentSource"])) != request.relay["parentSourceFingerprint"]:
            raise ValueError("采样期间上一段一采画面已变化，请重新执行接力链")


def streams(latent):
    samples = latent["samples"]
    if isinstance(samples, (tuple, list)):
        return list(samples)
    if getattr(samples, "is_nested", False):
        return list(samples.unbind())
    return [samples]


def align_second_pass_images(images):
    """Align the RTX output to H3's 2×2 patches on its 16× video VAE grid."""
    import torch.nn.functional as F

    height, width = images.shape[1:3]
    target_h = max(32, ((height + 16) // 32) * 32)
    target_w = max(32, ((width + 16) // 32) * 32)
    if (height, width) == (target_h, target_w):
        return images
    return F.interpolate(images.movedim(-1, 1), size=(target_h, target_w),
                         mode="bilinear", align_corners=False).movedim(1, -1)


def source_media(request, components, root, load_video):
    """给接力段补回头部窗口；交付时按原始视频帧数精确裁回。"""
    import torch
    import torch.nn.functional as F

    images, audio, fps = components.images, components.audio, float(components.frame_rate)
    count = int(images.shape[0])
    request.media.update(original_frames=count, original_audio=audio, fps=fps, trim=0)
    if not request.relay:
        return images, audio
    check_sources(root, request)
    if abs(fps - 24) > 1e-3:
        raise ValueError("H3 二采接力要求源视频为 24 FPS，请先以 24 FPS 生成一采")
    trim = request.relay["contextFrames"]
    if trim:
        # Native target protection supplies the exact HD prefix later. Its low-grid
        # conditioning must come from the selected low source, without an HD roundtrip.
        previous = load_video(str(checked_file(root, request.relay.get("parentSource") or request.relay["parent"]))).get_components()
        if abs(float(previous.frame_rate) - fps) > 1e-3 or previous.audio is None or len(previous.images) < trim:
            raise ValueError("上一段二采帧率、音轨或接力帧数不匹配，请重跑接力链")
        tail = previous.images[-trim:].clone()
        request.media["context_frames"] = tail
        resized = F.interpolate(tail.movedim(-1, 1), size=images.shape[1:3], mode="bilinear", align_corners=False).movedim(1, -1)
        images = torch.cat((resized.to(images), images), dim=0)
        rate = int(audio["sample_rate"])
        old = previous.audio
        if int(old["sample_rate"]) != rate or old["waveform"].shape[:-1] != audio["waveform"].shape[:-1]:
            raise ValueError("接力音轨采样率或声道不一致，请使用相同音频设置重跑")
        samples = round(trim / fps * rate)
        if old["waveform"].shape[-1] < samples:
            raise ValueError("上一段音轨短于接力窗口")
        audio = {**audio, "waveform": torch.cat((old["waveform"][..., -samples:].to(audio["waveform"]), audio["waveform"]), dim=-1)}
    total = len(images)
    if total < 5 or (total - 5) % 17:
        raise ValueError(f"二采接力补回上下文后为 {total} 帧，不符合 H3 的 17n+5；请按当前接力开关和窗口重新生成该段一采")
    request.media["trim"] = trim
    return images, audio


def apply_context(conditioning, latent, vae, request, root, node_class):
    """兼容带画面输入和直接读取 AV latent 的 H3 Motion Context 接口。"""
    if not request.relay.get("parent"):
        return conditioning
    from safetensors.torch import load_file

    state = checked_file(root, request.relay["parentState"])
    if fingerprint(state) != request.relay["parentStateFingerprint"]:
        raise ValueError("上一段二采 latent 已变化，请重新执行接力链")
    saved = load_file(str(state), device="cpu")
    if "video" not in saved or "audio" not in saved:
        raise ValueError("二采接力状态缺少 video 或 audio latent")
    if tuple(saved["video"].shape[-2:]) != tuple(streams(latent)[0].shape[-2:]):
        raise ValueError("前后段二采 latent 画幅不同，请统一一采画幅与二采倍率后重跑接力链")
    if any(size % 2 for size in streams(latent)[0].shape[-2:]):
        raise ValueError("二采 latent 宽高必须为偶数；请调整放大倍率，使输出宽高均为 32 的倍数，再重跑接力链")
    types = node_class.INPUT_TYPES()
    fields = {**types.get("required", {}), **types.get("optional", {})}
    if not {"conditioning", "latent", "context_length", "context_latent"} <= fields.keys():
        raise ValueError("已安装的 H3 Motion Context 未提供所需的 latent 接力接口，请提供该节点版本")
    frames = request.relay["contextFrames"]
    context_type = fields.get("context_length", (None,))[0]
    if isinstance(context_type, (list, tuple)):
        value = str(frames) if str(frames) in context_type else frames
        if value not in context_type:
            raise ValueError(f"已安装的 H3 Motion Context 不支持 {frames} 帧，请选择该版本提供的窗口")
    else:
        value = frames
        options = fields.get("context_length", (None, {}))[1]
        if frames > options.get("max", frames) or frames < options.get("min", frames):
            raise ValueError(f"已安装的 H3 Motion Context 不支持 {frames} 帧")
    values = dict(conditioning=conditioning, latent=latent, vae=vae,
                  context_frames=request.media["context_frames"], context_latent={"samples": [saved["video"], saved["audio"]]},
                  context_length=value, audio_context_length=request.relay["audioContextFrames"],
                  encode_mode="video", anchor_mode="head", crop="disabled", audio_mode="timeline")
    kwargs = {}
    for name, spec in fields.items():
        if name in values:
            kwargs[name] = values[name]
        elif name in types.get("required", {}):
            options = spec[1] if len(spec) > 1 else {}
            if "default" in options:
                kwargs[name] = options["default"]
            elif isinstance(spec[0], (list, tuple)) and spec[0]:
                kwargs[name] = spec[0][0]
            else:
                raise ValueError(f"H3 Motion Context 接口无法匹配必填输入 {name}，请提供该节点版本")
    function = getattr(node_class(), node_class.FUNCTION)
    inspect.signature(function).bind(**kwargs)
    result = function(**kwargs)
    if hasattr(result, "result"):
        result = result.result
    if isinstance(result, dict):
        result = result["result"]
    if len(result) < 2 or int(result[1]) != frames:
        raise ValueError("H3 Motion Context 实际裁切帧数与二采接力窗口不一致")
    return result[0]


def match_second_pass(latent, request, root, node_class, strength=1.0):
    """Match against the native state of the previous second pass before decoding."""
    from .native_continuity import enabled

    if enabled(request) or not request.relay.get("parent") or strength == 0:
        return latent
    check_sources(root, request)
    from safetensors.torch import load_file

    state = checked_file(root, request.relay["parentState"])
    saved = load_file(str(state), device="cpu")
    if "video" not in saved or "audio" not in saved:
        raise ValueError("二采接力状态缺少 video 或 audio latent")
    function = getattr(node_class(), node_class.FUNCTION)
    result = function(samples=latent, strength=strength,
                      context_length=int(request.media["trim"]),
                      min_excess=1.5, match_spread=True, min_excess_spread=1.5,
                      match_detail=True, min_excess_detail=1.5, tuning="auto",
                      context_latent={"samples": [saved["video"], saved["audio"]]})
    if hasattr(result, "result"):
        result = result.result
    if isinstance(result, dict):
        result = result["result"]
    return result[0]


def finalize_images(images, latent, audio_latent, request, root):
    if not request.relay:
        return images
    check_sources(root, request)
    from safetensors.torch import save_file

    trim, count = request.media["trim"], request.media["original_frames"]
    if len(images) < trim + count:
        raise ValueError("二采解码帧数不足，停止保存以免丢失接缝或缩短片段")
    if len(images) > trim + count:
        raise ValueError("二采解码帧数超过输入时间轴，停止保存以免接力 latent 尾部错位")
    result = images[trim:trim + count]
    native = streams(latent)[0].detach().cpu().contiguous()
    # 成片继续使用选定一采的原音轨；下一段的音频状态也必须来自这条音轨。
    audio = streams(audio_latent)[0].detach().cpu().contiguous()
    path = state_path(root, request)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    try:
        save_file({"video": native, "audio": audio}, str(temporary), metadata={"format": "h3_motion_context_av_v1", "yuq_relay": str(RELAY_VERSION)})
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)
    return result
