"""Opt-in exports of the three latent refinement boundaries on one timeline."""

from __future__ import annotations

import hashlib
import json


def capture(latent, request, stage):
    if not request.media.get("diagnose_latent"):
        return latent
    from .second_pass_relay import streams

    if stage not in {"encoded", "upscaled"}:
        raise ValueError("未知的 latent 诊断阶段")
    request.media[f"diagnostic_{stage}"] = streams(latent)[0].detach().cpu().clone()
    return latent


def frame_images(images):
    if images.ndim == 5 and images.shape[0] == 1:
        images = images.reshape(-1, *images.shape[-3:])
    if images.ndim != 4 or images.shape[-1] != 3:
        raise ValueError(f"诊断解码需要单批 RGB 视频，实际形状 {tuple(images.shape)}")
    return images


def export(request, sampled, vae, root, save_video):
    if not request.media.get("diagnose_latent"):
        return None
    from .paths import build_output_paths_from_values
    from .render_source import check

    check(root, request.source_context)
    if vae is None or any(f"diagnostic_{name}" not in request.media for name in ("source", "encoded", "upscaled")):
        raise ValueError("诊断缺少编码前后或放大后数据，请使用配套诊断工作流")
    paths = build_output_paths_from_values(request.plan.project_name, request.plan.run_id, request.shot.shot.id, 0)
    token = hashlib.sha256(f"{request.request_id}:{request.processing_mode}".encode()).hexdigest()[:24]
    directory = root / paths.run_prefix / "diagnostics" / token
    directory.mkdir(parents=True, exist_ok=True)
    trim, count = request.media["trim"], request.media["original_frames"]
    report = {"shotId": request.shot.shot.id, "fps": request.media["fps"], "trim": trim,
              "frames": count, "sourceContext": request.source_context, "stages": {}}
    # Decode and release each stage separately; the normal path retains no probe tensors.
    for number, stage in enumerate(("source", "encoded", "upscaled", "sampled")):
        if stage == "source":
            images = request.media.pop("diagnostic_source")
        elif stage == "sampled":
            images = sampled
        else:
            images = vae.decode(request.media.pop(f"diagnostic_{stage}"))
        images = frame_images(images)
        if len(images) != trim + count:
            raise ValueError(f"诊断 {stage} 帧数 {len(images)} 与输入时间轴 {trim + count} 不符")
        images = images[trim:trim + count]
        filename = f"{number:02}_{stage}.mp4"
        save_video(images, request.media["original_audio"], directory / filename)
        luma = []
        for start in range(0, count, 16):
            chunk = images[start:start + 16].detach().float()
            value = chunk[..., 0] * .2126 + chunk[..., 1] * .7152 + chunk[..., 2] * .0722
            luma.extend((value.mean(dim=(1, 2)) * 255).cpu().tolist())
        report["stages"][stage] = {"file": filename, "shape": list(images.shape), "meanLuma": luma}
        del images
    check(root, request.source_context)
    (directory / "metrics.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    return directory
