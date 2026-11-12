"""安全地把导播台生图工作流的输出登记为输入素材。"""

from __future__ import annotations

from pathlib import Path, PurePosixPath
import shutil

from .uploads import ALLOWED_EXTENSIONS, allocate_upload_path

MAX_GENERATED_IMAGE_BYTES = 256 * 1024 * 1024
IMAGE_SIGNATURES = {
    ".png": lambda data: data.startswith(b"\x89PNG\r\n\x1a\n"),
    ".jpg": lambda data: data.startswith(b"\xff\xd8\xff"),
    ".jpeg": lambda data: data.startswith(b"\xff\xd8\xff"),
    ".webp": lambda data: len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP",
    ".bmp": lambda data: data.startswith(b"BM"),
}


def register_generated_image(
    output_root: Path,
    input_root: Path,
    project_name: str,
    subfolder: str,
    filename: str,
    image_type: str = "output",
) -> tuple[Path, str]:
    """只接受 TheodoreDirector/ImageGen 下的真实图片，复制到输入素材目录并保留原图。"""
    if image_type != "output":
        raise ValueError("只允许登记 output 类型的生图结果")
    relative = PurePosixPath(subfolder)
    if relative.is_absolute() or "\\" in subfolder or any(part in {"", ".", ".."} for part in relative.parts):
        raise ValueError("生图结果目录无效")
    if len(relative.parts) < 3 or relative.parts[:2] != ("TheodoreDirector", "ImageGen"):
        raise ValueError("生图结果必须位于 TheodoreDirector/ImageGen 目录")
    name = PurePosixPath(filename)
    if name.name != filename or filename in {"", ".", ".."} or "\\" in filename:
        raise ValueError("生图结果文件名无效")
    suffix = Path(filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS["image"]:
        raise ValueError(f"不支持的图片扩展名：{suffix or '(无)'}")

    allowed_root = (output_root.resolve() / "TheodoreDirector" / "ImageGen").resolve()
    source = (output_root.resolve() / Path(*relative.parts) / filename).resolve(strict=True)
    try:
        source.relative_to(allowed_root)
    except ValueError as exc:
        raise ValueError("生图结果路径越界") from exc
    if not source.is_file():
        raise ValueError("生图结果不是普通文件")
    size = source.stat().st_size
    if size <= 0 or size > MAX_GENERATED_IMAGE_BYTES:
        raise ValueError("生图结果大小无效或超过 256 MiB")
    with source.open("rb") as handle:
        signature = handle.read(16)
    if not IMAGE_SIGNATURES[suffix](signature):
        raise ValueError("生图结果内容与图片格式不匹配")

    target, relative_target = allocate_upload_path(input_root, project_name, filename, "image")
    created = False
    try:
        with source.open("rb") as src, target.open("xb") as dst:
            created = True
            shutil.copyfileobj(src, dst, length=1024 * 1024)
    except Exception:
        if created:
            target.unlink(missing_ok=True)
        raise
    if target.stat().st_size != size:
        target.unlink(missing_ok=True)
        raise OSError("登记后的图片大小校验失败")
    return target, relative_target
