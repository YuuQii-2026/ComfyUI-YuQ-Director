"""清理导播台拥有的资源；先验证全部候选，再执行文件删除。"""

from __future__ import annotations

from pathlib import Path, PurePosixPath
import re
import unicodedata

from .paths import build_output_paths_from_values, find_generated_videos
from .uploads import ALLOWED_EXTENSIONS, safe_segment
from .video_results import metadata_path, read_video_result_metadata


def _link(path: Path) -> bool:
    return path.is_symlink() or bool(getattr(path, "is_junction", lambda: False)())


def _check_path(root: Path, path: Path) -> Path:
    root = root.resolve()
    relative = path.relative_to(root)
    current = root
    for part in relative.parts:
        current = current / part
        if _link(current):
            raise ValueError("资源路径含符号链接或目录联接")
    resolved = path.resolve()
    resolved.relative_to(root)
    return resolved


def _run_directory(root: Path, project_name: str, run_id: str) -> Path:
    if not project_name.strip() or not run_id.strip():
        raise ValueError("清理前必须填写 Project name 和 Run ID")
    root = root.resolve()
    return _check_path(root, root / build_output_paths_from_values(project_name, run_id, "clear", 0).run_prefix)


def _image_project(value: str) -> str:
    # 与前端 safeImageStem 的 Unicode 字母/数字规则保持一致。
    return re.sub(r"[_.]+$", "", re.sub(r"^[_.]+", "", "".join(
        char if char in "._-" or unicodedata.category(char)[0] in "LN" else "_"
        for char in value.strip()
    )))[:72] or "asset"


def cleanup_asset_resources(output_root: Path, input_root: Path, project_name: str,
                            candidates: list[dict], keep: list[dict]) -> dict:
    """仅删除本项目托管的输入副本和生图输出；保留当前仍引用的文件。"""
    if not project_name.strip():
        raise ValueError("清理素材前必须填写项目名")
    if not isinstance(candidates, list) or not isinstance(keep, list) or len(candidates) + len(keep) > 10000:
        raise ValueError("资源清单无效或过长")
    roots = {"input": input_root.resolve(), "output": output_root.resolve()}
    allowed = {
        "input": roots["input"] / "theodore_director" / safe_segment(project_name, "theodore_project"),
        "output": roots["output"] / "TheodoreDirector" / "ImageGen" / _image_project(project_name),
    }

    def resolve(item: dict, *, candidate: bool) -> tuple[str, Path] | None:
        if not isinstance(item, dict) or item.get("type") not in roots or not isinstance(item.get("path"), str):
            raise ValueError("资源条目必须包含 type 与 path")
        kind, raw = item["type"], item["path"].replace("\\", "/").strip()
        relative = PurePosixPath(raw)
        if not raw or relative.is_absolute() or ":" in raw or ".." in relative.parts:
            if candidate:
                raise ValueError("资源必须使用有效的相对路径")
            return None
        path = roots[kind] / Path(*relative.parts)
        if candidate:
            try:
                path.relative_to(allowed[kind])
            except ValueError:
                return None
            path = _check_path(roots[kind], path)
            path.relative_to(allowed[kind])
            extensions = set().union(*ALLOWED_EXTENSIONS.values()) if kind == "input" else ALLOWED_EXTENSIONS["image"]
            if path.suffix.lower() not in extensions:
                return None
            if path.exists() and not path.is_file():
                raise ValueError("资源清理目标不是普通文件")
        return kind, path.resolve()

    protected = {str(value[1]).casefold() for item in keep if (value := resolve(item, candidate=False))}
    targets, skipped, seen = [], [], set()
    for item in candidates:
        value = resolve(item, candidate=True)
        if value is None or str(value[1]).casefold() in protected:
            skipped.append(item)
        elif value not in seen:
            seen.add(value)
            targets.append((item, value[1]))
    deleted, failures, freed = [], [], 0
    for item, path in targets:
        try:
            size = path.stat().st_size if path.exists() else 0
            path.unlink(missing_ok=True)
            freed += size
            deleted.append(item)
        except OSError as error:
            failures.append({**item, "error": str(error)})
    return {"deleted": deleted, "skipped": skipped, "failures": failures, "bytes": freed}


def clear_storyboard_resources(root: Path, project_name: str, run_id: str) -> dict:
    """永久删除本 Run 生成目录；不存在视为清理完成。输入素材位于其他目录。"""
    root = root.resolve()
    directory = _run_directory(root, project_name, run_id)
    if not directory.exists():
        return {"deleted": [], "bytes": 0}
    if not directory.is_dir():
        raise ValueError("运行目录不是文件夹")
    entries = []
    pending = [directory]
    while pending:
        parent = pending.pop()
        for child in parent.iterdir():
            _check_path(root, child)
            if child.is_dir():
                pending.append(child)
            elif not child.is_file():
                raise ValueError("运行目录包含非普通资源文件")
            entries.append(child)
    files = [path for path in entries if path.is_file()]
    freed = sum(path.stat().st_size for path in files)
    for path in files:
        _check_path(root, path).unlink(missing_ok=True)
    for path in sorted((path for path in entries if path.is_dir()), key=lambda path: len(path.parts), reverse=True):
        path.rmdir()
    directory.rmdir()
    return {"deleted": [path.relative_to(root).as_posix() for path in files], "bytes": freed}


def cleanup_replaced_shot(root: Path, project_name: str, run_id: str, shot_id: str,
                          current_video: Path, current_tail: Path | None = None,
                          current_latent: Path | None = None) -> list[Path]:
    """新视频和记录落盘后清理旧版本；独立后处理保留一采源及其他处理模式。"""
    root = root.resolve()
    directory = _run_directory(root, project_name, run_id)
    current_video = _check_path(root, current_video)
    current_video.relative_to(directory)
    current = read_video_result_metadata(current_video)
    if current is None or not current_video.is_file() or current_video.stat().st_size == 0:
        raise ValueError("新视频或阶段记录尚未完整写入")
    candidates = []
    for video in find_generated_videos(root, project_name, run_id, shot_id, -1):
        if video == current_video:
            continue
        old = read_video_result_metadata(video)
        if current.stage == "first_pass" or (old and old.stage == current.stage
                and old.processing_mode == current.processing_mode and old.source_path == current.source_path):
            candidates.extend([video, metadata_path(video)])
    if current_tail is not None:
        current_tail = _check_path(root, current_tail)
        paths = build_output_paths_from_values(project_name, run_id, shot_id, 0)
        tail_prefix = Path(paths.tail_prefix).name
        tail_dir = root / paths.tail_prefix
        tail_dir = tail_dir.parent
        if tail_dir.is_dir():
            for path in tail_dir.iterdir():
                if re.match(rf"^(?:\d+_)?{re.escape(tail_prefix)}_", path.name, re.IGNORECASE) and path != current_tail and path.suffix.lower() in ALLOWED_EXTENSIONS["image"]:
                    candidates.append(path)
    if current_latent is not None:
        current_latent = _check_path(root, current_latent)
        current_latent.relative_to(directory)
        if current_latent.suffix.lower() == ".safetensors":
            latent_dir = current_latent.parent
            slot_match = re.match(r"^(.*?\d{5})_", current_latent.stem)
            if latent_dir.is_dir() and slot_match:
                for path in latent_dir.iterdir():
                    if path != current_latent and path.is_file() and path.name.startswith(slot_match.group(1) + "_") and path.suffix.lower() == ".safetensors":
                        candidates.append(path)
    # 验证整组文件，避免检查到一半才发现路径异常。
    targets = []
    for path in candidates:
        path = _check_path(root, path)
        path.relative_to(directory)
        if path.is_file():
            targets.append(path)
    for path in targets:
        path.unlink(missing_ok=True)
    return targets
