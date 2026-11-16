"""Experimental H3 second-pass target protection and contextual decode receipts."""

from __future__ import annotations

import logging
from pathlib import Path

from .second_pass_relay import check_sources, checked_file, fingerprint, state_path, streams

POLICY = "h3_native_prefix_right_context_v1"
LOG = logging.getLogger(__name__)


def enabled(request):
    return request.relay.get("continuityMode") == POLICY


def context_tokens(frames):
    if frames < 5 or (frames - 5) % 17:
        raise ValueError("原生二采接力窗口必须为 5、22、39 或 56 帧")
    return (frames - 5) // 17 * 5 + 2


def video_frames(video):
    import torch

    if (not torch.is_tensor(video) or video.ndim != 5 or tuple(video.shape[:2]) != (1, 24)
            or not video.is_floating_point() or video.shape[2] < 2 or video.shape[2] % 5 != 2):
        raise ValueError("原生二采需要 [1,24,5n+2,H,W] 视频 latent")
    if any(n < 2 or n % 2 for n in video.shape[-2:]):
        raise ValueError("原生二采 latent 宽高必须为正偶数；输出宽高需为 32 的倍数")
    return (video.shape[2] - 2) // 5 * 17 + 5


def require_core():
    from comfy.model_base import MiniMaxH3

    required = ("_denoise_mask_conds", "_denoise_mask_values", "_token_grid_masks", "scale_latent_inpaint")
    if any(not callable(getattr(MiniMaxH3, name, None)) for name in required):
        raise ValueError("测试版需要 ComfyUI 的 H3 原生逐 token mask 支持，请更新稳定版并重启")


def parent_video(root, request):
    from safetensors.torch import load_file

    check_sources(root, request)
    video = load_file(str(checked_file(root, request.relay["parentState"])), device="cpu")["video"]
    video_frames(video)
    return video


def prepare_target(conditioning, latent, request, root, audio_latent=None):
    """Copy final high-grid history into a fresh target; retain source audio."""
    import torch
    from comfy.nested_tensor import NestedTensor

    if not enabled(request):
        raise ValueError("原生二采未启用，请导入原生接力测试工作流")
    if audio_latent is None:
        raise ValueError("原生二采需连接 VAEEncodeAudio 的原音频 latent，请导入音频修正版测试工作流")
    require_core()
    check_sources(root, request)
    parts = streams(latent)
    if len(parts) != 2:
        raise ValueError("原生二采需要视频和音频两条 native AV latent")
    video = parts[0]
    source_audio = streams(audio_latent)
    if len(source_audio) != 1:
        raise ValueError("原生二采的 audio_latent 必须直接连接原音频编码，不能连接混合 AV latent")
    audio = source_audio[0]
    total = video_frames(video)
    if (audio.ndim != 4 or tuple(audio.shape[:3]) != (1, 32, 2)
            or not audio.is_floating_point() or abs(audio.shape[-1] - round(total / 24 * 40)) > 1):
        raise ValueError("原生二采音频 latent 必须为 [1,32,2,T]，时长与视频一致")
    trim = int(request.media["trim"])
    if total != trim + request.media["original_frames"] or trim != request.relay["contextFrames"]:
        raise ValueError("原生二采时间轴与接力窗口不一致，请重新生成对应一采")
    target = video.clone()
    mask = torch.ones((1, 1, *video.shape[2:]), dtype=torch.float32, device=video.device)
    if request.relay.get("parent"):
        prefix = context_tokens(trim)
        previous = parent_video(root, request)
        if (previous.shape[-2:] != video.shape[-2:] or previous.shape[2] < prefix
                or video.shape[2] - prefix < 5 or previous.dtype != video.dtype):
            raise ValueError("前后二采画幅、精度或接力窗口不一致，或新段不足 17 帧；请统一设置并重跑整链")
        target[:, :, :prefix].copy_(previous[:, :, -prefix:])
        mask[:, :, :prefix] = 0
    # Audio remains the selected first pass throughout second-pass sampling.
    audio_mask = torch.zeros((1, 1, *audio.shape[2:]), dtype=torch.float32, device=audio.device)
    result = dict(latent)
    result["samples"] = NestedTensor((target, audio.clone()))
    result["noise_mask"] = NestedTensor((mask, audio_mask))
    request.media["native_audio"] = audio.detach().cpu().clone()
    output = []
    for embedding, original in conditioning:
        metadata = dict(original)
        if trim:
            keys = [dict(item) for item in metadata.get("minimax_keyframes", ())
                    if not 0 <= int(item.get("resolved_frame_index", 0)) < trim]
            if keys:
                metadata["minimax_keyframes"] = keys
            else:
                metadata.pop("minimax_keyframes", None)
        metadata["minimax_frame_count"] = total
        output.append([embedding, metadata])
    LOG.info("YuQ native second pass: protected_frames=%d audio_locked=true audio_source=original_encoded", trim)
    return output, result


def accept_sample(latent, request, root):
    """Validate mask preservation, then restore only dtype round-trip residue."""
    import torch
    from comfy.nested_tensor import NestedTensor

    video, audio = streams(latent)
    source = request.media.get("native_audio")
    if source is None:
        raise ValueError("原生二采缺少锁定音频状态，请检查采样器是否接到接力节点的 latent 输出")

    def preserved(actual, expected):
        if actual.dtype != expected.dtype or actual.shape != expected.shape:
            return False
        epsilon = torch.finfo(actual.dtype).eps * 4
        return torch.allclose(actual.detach().cpu(), expected, atol=epsilon, rtol=epsilon)

    if not preserved(audio, source):
        raise ValueError("二采改变了锁定音频，停止保存；请检查原生 mask 是否生效")
    result_video = video
    if request.relay.get("parent"):
        previous = parent_video(root, request)
        prefix = context_tokens(int(request.media["trim"]))
        expected = previous[:, :, -prefix:]
        if not preserved(video[:, :, :prefix], expected):
            raise ValueError("二采改变了保护区，停止保存；请检查原生 mask 是否生效")
        result_video = video.clone()
        result_video[:, :, :prefix].copy_(expected)
    result = dict(latent)
    result["samples"] = NestedTensor((result_video, source.to(audio).clone()))
    return result


def validate_sample(latent, audio_latent, request, root):
    """Reject a sampler or downstream node that changes an authoritative prefix."""
    import torch

    parts = streams(latent)
    if len(parts) != 2:
        raise ValueError("二采采样器没有输出 native AV latent")
    video, audio = parts
    video_frames(video)
    source_audio = streams(audio_latent)[0]
    if audio.shape != source_audio.shape or not torch.equal(audio.cpu(), source_audio.cpu()):
        raise ValueError("二采采样改变了锁定音频，请检查是否使用原生 mask 支持的 ComfyUI 和测试工作流")
    if request.relay.get("parent"):
        previous = parent_video(root, request)
        prefix = context_tokens(int(request.media["trim"]))
        if previous.dtype != video.dtype or not torch.equal(previous[:, :, -prefix:], video[:, :, :prefix].cpu()):
            raise ValueError("二采采样改变了保护区；停止保存，请检查原生 mask 或额外 latent 处理节点")


def decode_parent_context(latent, vae, request, root):
    """Decode the preceding clip with one real future stride, in a new allocation."""
    import torch
    from .video_results import read_video_result_metadata

    if not request.relay.get("parent"):
        return None
    decoder = vae.first_stage_model
    profile = {"tokens_chunk_size": 5, "token_overlap": 2, "frame_overlap": 5,
               "clip_length": 17, "token_drop": 3, "noncausal": False}
    if any(getattr(decoder, key, None) != value for key, value in profile.items()):
        raise ValueError("连续上下文测试需要原版 H3 时间窗口 VAE，请使用原始工作流的视频 VAE")
    previous = parent_video(root, request)
    current = streams(latent)[0].detach().cpu()
    prefix = context_tokens(int(request.media["trim"]))
    if (current.dtype != previous.dtype or current.shape[-2:] != previous.shape[-2:]
            or current.shape[2] - prefix < 5
            or not torch.equal(previous[:, :, -prefix:], current[:, :, :prefix])):
        raise ValueError("连续解码要求前后段保护区逐值一致，且后续至少有 5 个新 latent token")
    parent = checked_file(root, request.relay["parent"])
    meta = read_video_result_metadata(parent)
    if not meta or meta.relay.get("continuityMode") != POLICY:
        raise ValueError("上一段不是原生保护测试结果，请从接力链第一段重新二采")
    trim = int(meta.relay["contextFrames"])
    count = video_frames(previous)
    extended = torch.cat((previous, current[:, :, prefix:prefix + 5]), dim=2)
    images = vae.decode(extended)
    decoded_shape = tuple(images.shape)
    # Match VAEDecode's BTHWC -> THWC conversion before counting or trimming.
    if images.ndim == 5 and images.shape[0] == 1:
        images = images.reshape(-1, *images.shape[-3:])
    if images.ndim != 4 or images.shape[-1] != 3:
        raise ValueError(f"连续解码输出形状异常：{decoded_shape}；需要单批 RGB 视频或 RGB 帧序列")
    if len(images) != count + 17:
        raise ValueError(f"连续解码帧数不符合原生 H3 时间轴：应为 {count + 17} 帧，"
                         f"实际 {len(images)} 帧，解码形状 {decoded_shape}，停止保存")
    return images[trim:count], parent


def save_parent_context(latent, vae, request, root, load_video, save_video):
    """Keep source clips immutable and record the derivative on the right clip."""
    decoded = decode_parent_context(latent, vae, request, root)
    if decoded is None:
        return
    images, parent = decoded
    media = load_video(str(parent)).get_components()
    if abs(float(media.frame_rate) - 24) > 1e-3 or len(media.images) != len(images) or media.audio is None:
        raise ValueError("连续解码成片与上一段音轨或帧数不匹配")
    path = state_path(root, request).with_suffix(".context.mp4")
    temporary = path.with_name(path.stem + ".partial.mp4")
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        save_video(images, media.audio, temporary)
        check_sources(root, request)
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)
    request.relay["decodeContext"] = {
        "policy": POLICY, "parent": request.relay["parent"],
        "parentFingerprint": request.relay["parentFingerprint"],
        "parentStateFingerprint": request.relay["parentStateFingerprint"],
        "path": path.relative_to(root).as_posix(), "fingerprint": fingerprint(path),
        "frames": len(images), "futureTokens": 5,
    }
    LOG.info("YuQ contextual decode saved: %s; frames=%d", path, len(images))


def contextual_merge_sources(root: Path, selected: list[Path]) -> list[Path]:
    """Use a derivative only beside its exact selected right-hand successor."""
    from .video_results import read_video_result_metadata

    output = list(selected)
    from .first_pass_continuity import POLICY as FIRST_PASS_POLICY, contextual_pair

    for index in range(len(selected) - 1):
        left, right = selected[index:index + 2]
        left_meta = read_video_result_metadata(left)
        meta = read_video_result_metadata(right)
        if left_meta and left_meta.source_context.get("right"):
            actual_right = meta.source_path if meta and meta.source_path else right.relative_to(root).as_posix()
            if left_meta.source_context["right"] != actual_right:
                raise ValueError("后处理使用的右侧一采与本次合并选片不同，请按当前选片重新执行后处理")
        if meta and meta.relay.get("continuityMode") == FIRST_PASS_POLICY:
            output[index] = contextual_pair(root, left, right, meta)
            continue
        if not meta or meta.relay.get("continuityMode") != POLICY:
            continue
        info = meta.relay
        if info.get("parent") != left.relative_to(root).as_posix():
            continue
        receipt = info.get("decodeContext", {})
        if (receipt.get("policy") != POLICY or receipt.get("parent") != info["parent"]
                or receipt.get("parentFingerprint") != fingerprint(left)
                or receipt.get("parentStateFingerprint") != info["parentStateFingerprint"]
                or receipt.get("futureTokens") != 5):
            raise ValueError("原生二采的连续解码记录缺失或已失效，请重跑右侧接力段")
        contextual = checked_file(root, receipt["path"])
        if fingerprint(contextual) != receipt.get("fingerprint"):
            raise ValueError("连续解码视频已变化，请重跑右侧接力段")
        output[index] = contextual
    return output
