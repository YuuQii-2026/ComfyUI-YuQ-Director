from types import SimpleNamespace

import pytest
torch = pytest.importorskip("torch")

from theodore_director.latent_diagnostics import capture, export
from theodore_director.schema import DEFAULT_PLAN, load_plan


def test_diagnostic_separates_encoding_upscaling_and_sampling_without_retiming(tmp_path):
    plan = load_plan(DEFAULT_PLAN)
    audio = object()
    source = torch.full((22, 2, 4, 3), .1)
    request = SimpleNamespace(plan=plan, shot=SimpleNamespace(shot=plan.shots[0]), source_context={},
                              processing_mode="latent_upscale_second_pass", request_id="probe",
                              media=dict(diagnose_latent=True, diagnostic_source=source, original_audio=audio,
                                         original_frames=17, trim=5, fps=24))
    encoded = {"samples": torch.full((1, 24, 7, 2, 4), .2)}
    upscaled = {"samples": torch.full((1, 24, 7, 4, 8), .3)}
    assert capture(encoded, request, "encoded") is encoded
    capture(upscaled, request, "upscaled")
    encoded["samples"].zero_()  # The probe retains independent bytes.
    def decode(latent):
        return torch.full((1, 22, latent.shape[-2], latent.shape[-1], 3), float(latent.mean()))
    saved = []
    def save(frames, sound, path):
        assert sound is audio and len(frames) == 17
        saved.append((path.name, float(frames.mean())))
        path.write_bytes(b"video")
    directory = export(request, torch.full((22, 4, 8, 3), .4), SimpleNamespace(decode=decode), tmp_path, save)
    assert [name for name, _ in saved] == ["00_source.mp4", "01_encoded.mp4", "02_upscaled.mp4", "03_sampled.mp4"]
    assert [value for _, value in saved] == pytest.approx([.1, .2, .3, .4])
    import json
    metrics = json.loads((directory / "metrics.json").read_text(encoding="utf-8"))
    assert metrics["frames"] == 17
    assert metrics["stages"]["sampled"]["meanLuma"] == pytest.approx([102] * 17)


def test_disabled_diagnostics_are_free_of_decodes_and_copies(tmp_path):
    request = SimpleNamespace(media={})
    latent = {"samples": object()}
    assert capture(latent, request, "encoded") is latent
    assert export(request, None, None, tmp_path, None) is None
