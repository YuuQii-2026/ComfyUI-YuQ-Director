from types import SimpleNamespace

import pytest

from theodore_director.timeline_source import load


def test_whole_timeline_preserves_all_frames_audio_and_rate(tmp_path):
    path = tmp_path / "merged.mp4"
    path.write_bytes(b"video")
    images, audio = list(range(583)), object()
    media = SimpleNamespace(images=images, audio=audio, frame_rate=24)
    result = load(tmp_path, "merged.mp4", lambda name: SimpleNamespace(get_components=lambda: media))
    assert result[0] is images and result[1] is audio and result[2] == 24


@pytest.mark.parametrize("fps,audio,frames", [(0, object(), [1]), (float("nan"), object(), [1]), (24, None, [1]), (24, object(), [])])
def test_whole_timeline_rejects_incomplete_media(tmp_path, fps, audio, frames):
    (tmp_path / "merged.mp4").write_bytes(b"video")
    with pytest.raises(ValueError):
        load(tmp_path, "merged.mp4", lambda name: SimpleNamespace(get_components=lambda: SimpleNamespace(images=frames, audio=audio, frame_rate=fps)))
