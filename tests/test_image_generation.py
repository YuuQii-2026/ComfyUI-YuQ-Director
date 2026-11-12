from pathlib import Path

import pytest

from theodore_director.image_generation import register_generated_image


def source_image(root: Path, filename: str = "frame.png", content: bytes = b"\x89PNG\r\n\x1a\n") -> Path:
    folder = root / "TheodoreDirector" / "ImageGen" / "project"
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / filename
    path.write_bytes(content)
    return path


def test_register_copies_generated_image_and_preserves_output(tmp_path: Path):
    output = tmp_path / "output"
    inputs = tmp_path / "input"
    source = source_image(output, content=b"\x89PNG\r\n\x1a\nimage-data")

    target, relative = register_generated_image(output, inputs, "My Project", "TheodoreDirector/ImageGen/project", "frame.png")

    assert relative == "theodore_director/My_Project/frame.png"
    assert target.read_bytes() == source.read_bytes()
    assert source.exists()


@pytest.mark.parametrize(
    ("subfolder", "filename", "image_type"),
    [
        ("TheodoreDirector/ImageGen/../other", "frame.png", "output"),
        ("TheodoreDirector/other", "frame.png", "output"),
        ("TheodoreDirector/ImageGen/project", "../frame.png", "output"),
        ("TheodoreDirector/ImageGen/project", "frame.png", "temp"),
        ("TheodoreDirector/ImageGen/project", "frame.exe", "output"),
    ],
)
def test_register_rejects_unsafe_result_references(tmp_path: Path, subfolder: str, filename: str, image_type: str):
    with pytest.raises(ValueError):
        register_generated_image(tmp_path / "output", tmp_path / "input", "p", subfolder, filename, image_type)


def test_register_rejects_content_that_does_not_match_extension(tmp_path: Path):
    output = tmp_path / "output"
    source_image(output, content=b"not an image")

    with pytest.raises(ValueError, match="格式不匹配"):
        register_generated_image(output, tmp_path / "input", "p", "TheodoreDirector/ImageGen/project", "frame.png")


def test_register_rejects_symlink_escape(tmp_path: Path):
    output = tmp_path / "output"
    outside = tmp_path / "outside.png"
    outside.write_bytes(b"\x89PNG\r\n\x1a\nimage-data")
    folder = output / "TheodoreDirector" / "ImageGen" / "project"
    folder.mkdir(parents=True)
    try:
        (folder / "frame.png").symlink_to(outside)
    except OSError:
        pytest.skip("symlink creation is unavailable")

    with pytest.raises(ValueError, match="越界"):
        register_generated_image(output, tmp_path / "input", "p", "TheodoreDirector/ImageGen/project", "frame.png")
