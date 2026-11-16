"""导播台内置控制；不依赖模型、采样器或固定画布编号。"""

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .paths import OutputPaths, build_output_paths
from .schema import GenerationSettings, Plan
from .selection import ShotSelection, select_shot


@dataclass(frozen=True)
class ShotControl:
    shot: ShotSelection
    paths: OutputPaths
    width: int
    height: int
    fps: int
    video_context: str
    audio_context: int


def prepare_shot(plan: Plan, queue_index: int) -> ShotControl:
    selected = select_shot(plan, queue_index)
    size = plan.generation or GenerationSettings()
    return ShotControl(
        shot=selected,
        paths=build_output_paths(plan, selected.shot, selected.active_index),
        width=size.width,
        height=size.height,
        fps=plan.fps,
        video_context=str(plan.continuity.video_context_frames),
        audio_context=plan.continuity.audio_context_frames,
    )


def save_tail_frame(images: Any, output: Path) -> None:
    """直接保存裁切后图像序列的最后一帧。"""
    import numpy as np
    from PIL import Image

    if len(images) < 1:
        raise ValueError("没有可保存的尾帧")
    frame = images[-1]
    if hasattr(frame, "detach"):
        frame = frame.detach().cpu().numpy()
    pixels = np.clip(np.asarray(frame) * 255.0, 0, 255).astype(np.uint8)
    if pixels.ndim != 3 or pixels.shape[-1] not in (3, 4):
        raise ValueError("尾帧必须为 RGB 或 RGBA 图像")
    output.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(pixels).save(output, format="PNG")
