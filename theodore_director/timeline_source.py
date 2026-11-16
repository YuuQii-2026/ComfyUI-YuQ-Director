"""Load an already merged timeline without another H3 encode or diffusion pass."""

import math


def load(root, relative, loader):
    from .second_pass_relay import checked_file

    path = checked_file(root, str(relative).strip().replace("\\", "/"))
    if path.suffix.lower() not in {".mp4", ".webm", ".mov", ".mkv"}:
        raise ValueError("请选择 output 目录内已合并的视频")
    media = loader(str(path)).get_components()
    fps = float(media.frame_rate)
    if not math.isfinite(fps) or fps <= 0 or len(media.images) == 0 or media.audio is None:
        raise ValueError("合并视频必须包含画面、有效帧率和原音轨")
    return media.images, media.audio, fps
