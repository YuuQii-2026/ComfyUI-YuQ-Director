"""Experimental first-pass AV prefix protection and adjacent-clip decode."""

from __future__ import annotations

import json
import hashlib
from pathlib import Path
from uuid import uuid4

from .duration import calculate_h3_frames
from .native_continuity import context_tokens, require_core, video_frames
from .paths import build_output_paths
from .second_pass_relay import checked_file, fingerprint, streams
from .selection import select_shot
from .video_results import read_video_result_metadata

POLICY = "h3_firstpass_native_av_prefix_v1"


def cache_fingerprint(plan, shot, root):
    """Disk history is an input even though it has no canvas connection."""
    if not shot.latent_relay:
        return "independent"
    previous = select_shot(plan, shot.active_index - 1)
    paths = build_output_paths(plan, previous.shot, previous.active_index)
    values = []
    try:
        path = checked_file(root, paths.shot_result_path)
        values.append(hashlib.sha256(path.read_bytes()).hexdigest())
        result = json.loads(path.read_text(encoding="utf-8"))
        video = checked_file(root, result["video_path"])
        values.append(fingerprint(video))
        meta = read_video_result_metadata(video)
        if meta is None:
            values.append("missing-metadata")
        else:
            values.append(json.dumps(meta.relay, sort_keys=True))
            if meta.relay.get("state"):
                values.append(fingerprint(checked_file(root, meta.relay["state"])))
            if meta.relay.get("parent"):
                values.append(invalid_reason(root, meta))
    except (OSError, KeyError, TypeError, ValueError) as error:
        values.append(f"{type(error).__name__}:{error}")
    return hashlib.sha256(json.dumps(values).encode("utf-8")).hexdigest()


def invalid_reason(root, metadata, visited=None):
    """Validate immutable state and the exact committed upstream chain."""
    info = metadata.relay
    if metadata.stage != "first_pass" or info.get("continuityMode") != POLICY:
        return "上一段不是原生一采测试结果，请从接力链第一段重跑"
    visited = set() if visited is None else visited
    key = info.get("key")
    if not key or key in visited:
        return "一采接力记录成环或缺少标识"
    visited.add(key)
    try:
        video = checked_file(root, info["video"])
        state = checked_file(root, info["state"])
        result = json.loads(checked_file(root, info["resultPath"]).read_text(encoding="utf-8"))
        if (fingerprint(video) != info["videoFingerprint"] or fingerprint(state) != info["stateFingerprint"]
                or Path(result["video_path"]).resolve() != video
                or result.get("status") != "completed" or result.get("plan_hash") != metadata.plan_hash
                or result.get("shot_hash") != info["shotHash"]):
            return "一采视频、latent 或已提交结果已变化，请重跑本段及后续接力段"
        if info.get("parent"):
            check_parent(root, info, visited)
    except (OSError, ValueError, KeyError, TypeError) as error:
        return f"一采接力来源已失效：{error}"
    return ""


def check_parent(root, info, visited=None):
    if not info.get("parent"):
        return
    parent = checked_file(root, info["parent"])
    state = checked_file(root, info["parentState"])
    meta = read_video_result_metadata(parent)
    if (fingerprint(parent) != info["parentFingerprint"]
            or fingerprint(state) != info["parentStateFingerprint"]
            or meta is None or meta.relay.get("key") != info["parentKey"]
            or meta.relay.get("state") != info["parentState"]):
        raise ValueError("上一段一采或其 latent 已替换，请重跑接力链")
    reason = invalid_reason(root, meta, visited)
    if reason:
        raise ValueError(reason)


def av_parts(latent):
    import torch

    parts = streams(latent)
    if len(parts) != 2:
        raise ValueError("原生一采需要视频和音频两条 AV latent")
    video, audio = parts
    count = video_frames(video)
    if (audio.ndim != 4 or tuple(audio.shape[:3]) != (1, 32, 2)
            or not audio.is_floating_point() or audio.shape[-1] != round(count / 24 * 40)):
        raise ValueError("原生一采音频 latent 的形状或 40Hz 时间轴不匹配")
    if not torch.isfinite(video).all() or not torch.isfinite(audio).all():
        raise ValueError("一采 latent 包含非有限值，停止接力")
    return video, audio


def prepare_target(plan, shot, conditioning, latent, root):
    import torch
    from comfy.nested_tensor import NestedTensor
    from safetensors.torch import load_file

    require_core()
    if plan.fps != 24 or plan.continuity.duration_mode != "final_output":
        raise ValueError("原生一采测试需要 24FPS、成片时长模式，请在导播台配置中调整")
    if select_shot(plan, shot.active_index) != shot:
        raise ValueError("一采镜头与项目不匹配，请重新排队")
    video, audio = av_parts(latent)
    count, delivered = calculate_h3_frames(shot.shot.duration_seconds, fps=24,
        is_first=not shot.latent_relay, context_frames=plan.continuity.video_context_frames)
    if video_frames(video) != count:
        raise ValueError("一采 latent 与分镜时长不一致，请连接同一 H3Adapter 的帧数输出")
    trim = count - delivered
    prefix = context_tokens(trim) if trim else 0
    if trim and (delivered < 17 or video.shape[2] - prefix < 5):
        raise ValueError("一采接力新段至少需要 17 帧，请增加分镜时长")
    paths = build_output_paths(plan, shot.shot, shot.active_index)
    info = {"continuityMode": POLICY, "key": uuid4().hex, "planHash": plan.plan_hash,
            "shotHash": shot.shot_hash, "shotId": shot.shot.id, "contextFrames": trim,
            "videoPrefixTokens": prefix, "frames": count, "deliveredFrames": delivered,
            "videoShape": list(video.shape), "audioShape": list(audio.shape),
            "resultPath": paths.shot_result_path, "runPrefix": paths.run_prefix,
            "audioStart": 0, "audioEnd": 0}
    target_v, target_a = video.clone(), audio.clone()
    mask_v = torch.ones((1, 1, *video.shape[2:]), dtype=torch.float32, device=video.device)
    mask_a = torch.ones((1, 1, *audio.shape[2:]), dtype=torch.float32, device=audio.device)
    if trim:
        previous_shot = select_shot(plan, shot.active_index - 1)
        previous_paths = build_output_paths(plan, previous_shot.shot, previous_shot.active_index)
        try:
            result = json.loads(checked_file(root, previous_paths.shot_result_path).read_text(encoding="utf-8"))
            parent = checked_file(root, result["video_path"])
            meta = read_video_result_metadata(parent)
            if (result.get("plan_hash") != plan.plan_hash or result.get("shot_hash") != previous_shot.shot_hash
                    or meta is None or meta.shot_id != previous_shot.shot.id or meta.plan_hash != plan.plan_hash):
                raise ValueError("上一段的计划或镜头配置不匹配")
            reason = invalid_reason(root, meta)
            if reason:
                raise ValueError(reason)
            state = checked_file(root, meta.relay["state"])
            saved = load_file(str(state), device="cpu")
            previous_v, previous_a = av_parts({"samples": [saved["video"], saved["audio"]]})
        except (OSError, KeyError, TypeError, ValueError) as error:
            raise ValueError(f"上一段没有匹配的原生一采状态，请从接力链第一段重跑：{error}") from error
        if (previous_v.dtype != video.dtype or previous_a.dtype != audio.dtype
                or previous_v.shape[-2:] != video.shape[-2:] or previous_v.shape[2] < prefix
                or meta.relay["deliveredFrames"] < trim):
            raise ValueError("前后一采画幅、精度或有效时长不兼容，请统一设置并重跑整链")
        audio_end = round(trim / 24 * 40)
        # The independent audio window ends at the same join. Zero follows video.
        audio_count = min(audio_end, round((plan.continuity.audio_context_frames or trim) / 24 * 40))
        if audio_count < 1 or previous_a.shape[-1] < audio_count or audio_end >= audio.shape[-1]:
            raise ValueError("音频接力窗口不足或超过本段时间轴")
        target_v[:, :, :prefix].copy_(previous_v[:, :, -prefix:])
        target_a[..., audio_end - audio_count:audio_end].copy_(previous_a[..., -audio_count:])
        mask_v[:, :, :prefix] = 0
        mask_a[..., audio_end - audio_count:audio_end] = 0
        info.update(parent=parent.relative_to(root).as_posix(), parentFingerprint=fingerprint(parent),
                    parentState=state.relative_to(root).as_posix(), parentStateFingerprint=fingerprint(state),
                    parentKey=meta.relay["key"], audioStart=audio_end-audio_count, audioEnd=audio_end)
        check_parent(root, info)
    output = []
    for embedding, original in conditioning:
        metadata = dict(original)
        if trim:
            keys = [dict(key) for key in metadata.get("minimax_keyframes", ())
                    if float(key.get("resolved_frame_index", 0)) >= trim]
            if keys:
                metadata["minimax_keyframes"] = keys
            else:
                metadata.pop("minimax_keyframes", None)
        metadata["minimax_frame_count"] = count
        output.append([embedding, metadata])
    result = dict(latent)
    result["samples"] = NestedTensor((target_v, target_a))
    result["noise_mask"] = NestedTensor((mask_v, mask_a))
    return output, result, info, trim


def accept_sample(latent, info, root):
    """Reject failed masks before correcting only latent scaling roundoff."""
    import torch
    from comfy.nested_tensor import NestedTensor
    from safetensors.torch import load_file

    check_parent(root, info)
    video, audio = av_parts(latent)
    if list(video.shape) != info["videoShape"] or list(audio.shape) != info["audioShape"]:
        raise ValueError("采样器改变了一采 AV 网格，请使用原生一采测试工作流")
    video, audio = video.clone(), audio.clone()
    if info.get("parent"):
        previous = load_file(str(checked_file(root, info["parentState"])), device="cpu")
        prefix, start, end = info["videoPrefixTokens"], info["audioStart"], info["audioEnd"]
        pairs = ((video[:, :, :prefix], previous["video"][:, :, -prefix:]),
                 (audio[..., start:end], previous["audio"][..., -(end-start):]))
        for actual, expected in pairs:
            eps = torch.finfo(actual.dtype).eps * 4
            if (actual.dtype != expected.dtype or actual.shape != expected.shape
                    or not torch.allclose(actual.detach().cpu(), expected, atol=eps, rtol=eps)):
                raise ValueError("采样器改变了一采保护区，停止保存；请检查原生 noise_mask 是否生效")
        for actual, expected in pairs:
            actual.copy_(expected)
    result = dict(latent)
    result.pop("noise_mask", None)
    result["samples"] = NestedTensor((video, audio))
    return result


def decode_parent_context(latent, vae, info, root):
    import torch
    from safetensors.torch import load_file

    if not info.get("parent"):
        return None
    check_parent(root, info)
    profile = {"tokens_chunk_size": 5, "token_overlap": 2, "frame_overlap": 5,
               "clip_length": 17, "token_drop": 3, "noncausal": False}
    if any(getattr(vae.first_stage_model, key, None) != value for key, value in profile.items()):
        raise ValueError("原生一采连续解码需要原版 H3 时间窗口 VAE")
    previous = load_file(str(checked_file(root, info["parentState"])), device="cpu")["video"]
    current = streams(latent)[0].detach().cpu()
    prefix = info["videoPrefixTokens"]
    if not torch.equal(current[:, :, :prefix], previous[:, :, -prefix:]):
        raise ValueError("连续解码前一采保护区发生变化")
    extended = torch.cat((previous, current[:, :, prefix:prefix+5]), dim=2)
    count = video_frames(previous)
    images = vae.decode(extended)
    if images.ndim == 5 and images.shape[0] == 1:
        images = images.reshape(-1, *images.shape[-3:])
    if images.ndim != 4 or images.shape[-1] != 3 or len(images) != count + 17:
        raise ValueError(f"一采连续解码形状异常：{tuple(images.shape)}，应为 {count+17} 帧 RGB")
    parent = checked_file(root, info["parent"])
    meta = read_video_result_metadata(parent)
    return images[meta.relay["contextFrames"]:count], parent


def finalize(latent, vae, info, root, load_video, save_video):
    from safetensors.torch import save_file

    accepted = accept_sample(latent, info, root)
    result = dict(info)
    directory = root / info["runPrefix"] / "latent_context" / "native_firstpass"
    directory.mkdir(parents=True, exist_ok=True)
    path = directory / f"{info['key']}.safetensors"
    temporary = path.with_suffix(".partial")
    decoded = decode_parent_context(accepted, vae, info, root)
    if decoded is not None:
        frames, parent = decoded
        media = load_video(str(parent)).get_components()
        if abs(float(media.frame_rate)-24) > 1e-3 or len(media.images) != len(frames) or media.audio is None:
            raise ValueError("一采连续解码与上一段的音轨、FPS 或帧数不匹配")
        context = path.with_suffix(".context.mp4")
        partial = context.with_name(context.stem + ".partial.mp4")
        try:
            save_video(frames, media.audio, partial)
            check_parent(root, info)
            partial.replace(context)
        finally:
            partial.unlink(missing_ok=True)
        result["decodeContext"] = {"policy": POLICY, "parent": info["parent"],
            "parentFingerprint": info["parentFingerprint"], "parentStateFingerprint": info["parentStateFingerprint"],
            "path": context.relative_to(root).as_posix(), "fingerprint": fingerprint(context),
            "frames": len(frames), "futureTokens": 5}
    video, audio = streams(accepted)
    try:
        save_file({"video": video.detach().cpu().contiguous(), "audio": audio.detach().cpu().contiguous()},
                  str(temporary), metadata={"format": "h3_motion_context_av_v1", "yuq_policy": POLICY})
        check_parent(root, info)
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)
    result.update(state=path.relative_to(root).as_posix(), stateFingerprint=fingerprint(path))
    return accepted, result


def commit_metadata(root, plan, shot, paths, video, info):
    if (info.get("continuityMode") != POLICY or info.get("planHash") != plan.plan_hash
            or info.get("shotHash") != shot.shot_hash or info.get("resultPath") != paths.shot_result_path):
        raise ValueError("一采接力保存记录与当前镜头不一致")
    check_parent(root, info)
    if fingerprint(checked_file(root, info["state"])) != info["stateFingerprint"]:
        raise ValueError("一采接力状态在提交前已变化")
    return {**info, "video": video.relative_to(root).as_posix(), "videoFingerprint": fingerprint(video)}


def contextual_pair(root, left, right, metadata):
    info = metadata.relay
    reason = invalid_reason(root, metadata)
    if reason:
        raise ValueError(reason)
    if info.get("parent") != left.relative_to(root).as_posix():
        return left
    receipt = info.get("decodeContext", {})
    if (receipt.get("policy") != POLICY or receipt.get("parent") != info["parent"]
            or receipt.get("parentFingerprint") != fingerprint(left)
            or receipt.get("parentStateFingerprint") != info["parentStateFingerprint"]
            or receipt.get("futureTokens") != 5):
        raise ValueError("一采连续解码记录缺失或已失效，请重跑右侧接力段")
    context = checked_file(root, receipt["path"])
    if fingerprint(context) != receipt.get("fingerprint"):
        raise ValueError("一采连续解码视频已变化，请重跑右侧接力段")
    return context
