from pathlib import Path

import pytest

from theodore_director.resource_cleanup import clear_storyboard_resources, cleanup_asset_resources


def test_clear_storyboard_resources_removes_only_run(tmp_path: Path):
    root = tmp_path / "output"
    run = root / "TheodoreDirector" / "Demo_run"
    (run / "latent_context").mkdir(parents=True)
    (run / "latent_context" / "clip.safetensors").write_bytes(b"x")
    other = root / "TheodoreDirector" / "Other_run"; other.mkdir(parents=True); (other / "keep.mp4").write_bytes(b"x")
    result = clear_storyboard_resources(root, "Demo", "run")
    assert result["bytes"] == 1
    assert not run.exists() and (other / "keep.mp4").exists()


def test_cleanup_asset_resources_preserves_shared_paths(tmp_path: Path):
    input_root = tmp_path / "input"; output_root = tmp_path / "output"
    folder = input_root / "theodore_director" / "Demo"; folder.mkdir(parents=True)
    shared = folder / "shared.png"; shared.write_bytes(b"x")
    result = cleanup_asset_resources(output_root, input_root, "Demo", [{"type": "input", "path": "theodore_director/Demo/shared.png"}], [{"type": "input", "path": "theodore_director/Demo/shared.png"}])
    assert result["deleted"] == [] and shared.exists()


def test_cleanup_asset_resources_deletes_only_owned_project_files(tmp_path: Path):
    input_root = tmp_path / "input"; output_root = tmp_path / "output"
    owned = input_root / "theodore_director" / "Demo" / "old.png"
    external = tmp_path / "external.png"
    owned.parent.mkdir(parents=True); owned.write_bytes(b"old"); external.write_bytes(b"external")
    with pytest.raises(ValueError, match="相对路径"):
        cleanup_asset_resources(output_root, input_root, "Demo", [
            {"type": "input", "path": "theodore_director/Demo/old.png"},
            {"type": "input", "path": "../external.png"},
        ], [])
    assert owned.exists() and external.exists()
    result = cleanup_asset_resources(output_root, input_root, "Demo", [
        {"type": "input", "path": "theodore_director/Demo/old.png"},
        {"type": "input", "path": "theodore_director/Other/external.png"},
    ], [])
    assert result["deleted"] == [{"type": "input", "path": "theodore_director/Demo/old.png"}]
    assert not owned.exists() and external.exists()


def test_clear_storyboard_resources_rejects_linked_run(tmp_path: Path):
    root = tmp_path / "output"; director = root / "TheodoreDirector"; director.mkdir(parents=True)
    outside = tmp_path / "outside"; outside.mkdir()
    try:
        (director / "Demo_run").symlink_to(outside, target_is_directory=True)
    except OSError:
        pytest.skip("symlink creation is unavailable")
    with pytest.raises(ValueError, match="链接"):
        clear_storyboard_resources(root, "Demo", "run")
