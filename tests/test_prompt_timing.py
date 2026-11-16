import ast
import copy
from dataclasses import replace
import json
from pathlib import Path
from types import SimpleNamespace

import pytest

from theodore_director.duration import calculate_h3_frames
from theodore_director.references import resolve_references
from theodore_director.schema import DEFAULT_PLAN, load_plan
from theodore_director.selection import select_shot, select_shot_for_postprocess


def adapter():
    """Run the actual adapter with only ComfyUI's output container stubbed."""
    from theodore_director.prompt_timing import compile_relay_prompt
    source = Path(__file__).parents[1] / "nodes.py"
    tree = ast.parse(source.read_text(encoding="utf-8"))
    klass = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "TheodoreDirectorH3Adapter")
    future = ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0)
    namespace = {"io": SimpleNamespace(ComfyNode=object, NodeOutput=lambda *v: v),
                 "resolve_references": resolve_references, "calculate_h3_frames": calculate_h3_frames,
                 "replace": replace, "compile_relay_prompt": compile_relay_prompt}
    exec(compile(ast.fix_missing_locations(ast.Module(body=[future, klass], type_ignores=[])), str(source), "exec"), namespace)
    return namespace["TheodoreDirectorH3Adapter"]


def plan_for(prompt, context=39, **continuity):
    data = copy.deepcopy(DEFAULT_PLAN)
    data["continuity"].update(videoContextFrames=context, **continuity)
    first = dict(data["shots"][0], id="first", prompt=prompt)
    data["shots"] = [first, dict(first, id="next", durationSeconds=14, latentRelay=True)]
    return load_plan(data)


@pytest.mark.parametrize("frames, start, end", [
    (5, "00:00.408", "00:03.808"), (22, "00:01.117", "00:04.517"),
    (39, "00:01.825", "00:05.225"), (56, "00:02.533", "00:05.933"),
])
def test_actual_adapter_keeps_new_dialogue_on_delivered_timeline(frames, start, end):
    prompt = "detailed_description:\nAt 00:00.200 through 00:03.600, says <d>[Chinese] 下一句。</d>"
    plan = plan_for(prompt, frames)
    result = adapter().execute(plan, select_shot(plan, 1))
    assert f"At {start} through {end}," in result[0]
    assert result[1:3] == calculate_h3_frames(14, is_first=False, context_frames=frames)
    assert json.loads(result[3])["compiledPrompt"] == result[0]
    assert plan.shots[1].prompt == prompt
    assert "Continue the existing motion" in result[0]


@pytest.mark.parametrize("selection", ["first", "disabled", "postprocess", "no_relay", "legacy"])
def test_no_offset_or_extra_instruction_without_delivered_continuation(selection):
    prompt = "At 00:00.200 through 00:03.600, speaks."
    plan = plan_for(prompt, durationMode="legacy_generation_duration" if selection == "legacy" else "final_output",
                    mode="none" if selection == "no_relay" else "h3_av_latent")
    if selection == "disabled":
        plan = replace(plan, shots=(plan.shots[0], replace(plan.shots[1], latent_relay=False)))
    shot = select_shot_for_postprocess(plan, "next") if selection == "postprocess" else select_shot(plan, 0 if selection == "first" else 1)
    assert adapter().execute(plan, shot)[0] == prompt


def test_target_windows_deadlines_and_soundscape_agree_without_changing_source_or_dialogue():
    from theodore_director.prompt_timing import compile_relay_prompt
    prompt = """subject_definitions:
Reference <Video 1> from 00:01.000 to 00:02.000.
retention_analysis:
At 00:00.000 through 00:01.000, retain reference motion.
detailed_description:
Reference <Video 1> from 00:02.000 to 00:03.000.
At 00:00.000 through 00:02.000, turn and stop by 00:02.000; use <Video 1> at 00:04.000.
At 00:02.000 through 00:03.000, says <d>[Chinese] At 00:01.000 through 00:02.000，时钟是00:12.000。</d>
overall_soundscape:
Room tone. From 00:00.000 until 00:02.000, only footsteps. Use the scheduled 00:02.000 to 00:03.000 speech window.
non_diegetic_music:
N/A
"""
    result = compile_relay_prompt(prompt, context_frames=39, fps=24)
    assert "At 00:01.625 through 00:03.625, turn and stop by 00:03.625" in result
    assert "At 00:03.625 through 00:04.625, says" in result
    assert "From 00:01.625 until 00:03.625" in result
    assert "scheduled 00:03.625 to 00:04.625 speech window" in result
    assert result[:result.index("detailed_description:")] == prompt[:prompt.index("detailed_description:")]
    assert "Reference <Video 1> from 00:02.000 to 00:03.000." in result
    assert "use <Video 1> at 00:04.000" in result
    assert "<d>[Chinese] At 00:01.000 through 00:02.000，时钟是00:12.000。</d>" in result


def test_inline_reference_window_and_multiline_dialogue_stay_verbatim():
    from theodore_director.prompt_timing import compile_relay_prompt
    prompt = """detailed_description:
At 00:00.000 through 00:01.000, imitate <Video 1> from 00:05.000 to 00:06.000.
At 00:01.000 through 00:02.000, says <d>[Chinese] 时间如下：
At 00:00.000 through 00:01.000, 原文。</d>
"""
    result = compile_relay_prompt(prompt, context_frames=39, fps=24)
    assert "imitate <Video 1> from 00:05.000 to 00:06.000" in result
    assert "<d>[Chinese] 时间如下：\nAt 00:00.000 through 00:01.000, 原文。</d>" in result


def test_plain_prompt_and_minute_rollover():
    from theodore_director.prompt_timing import compile_relay_prompt
    result = compile_relay_prompt("At 00:59.500 through 01:01.000, walks.", context_frames=39, fps=24)
    assert "At 01:01.125 through 01:02.625, walks." in result
    assert "00:01.625" in result


def test_untimed_prompt_keeps_text_and_explains_overlap_without_inventing_silence():
    from theodore_director.prompt_timing import compile_relay_prompt
    prompt = "人物接着上段抬手，说下一句。"
    result = compile_relay_prompt(prompt, context_frames=39, fps=24)
    assert result.endswith(prompt)
    assert "previous clip's motion and sound" in result
    assert "first-frame" in result
    assert "silence" not in result.lower()


def test_reference_resolution_and_source_plan_stay_immutable():
    plan = plan_for("detailed_description:\nAt 00:00.200 through 00:03.600, {{ref:face}} speaks.")
    data = plan.to_dict()
    data["assets"] = [{"id": "face", "alias": "face", "kind": "image", "path": "face.png"}]
    plan = load_plan(data)
    original = plan.to_dict()
    klass = adapter()
    klass.execute.__func__.__globals__["load_image"] = lambda path: ("image", path)
    result = klass.execute(plan, select_shot(plan, 1))
    assert "At 00:01.825 through 00:05.225, <Picture 1> speaks." in result[0]
    assert result[4] == ("image", "face.png")
    assert json.loads(result[3])["slots"][0]["alias"] == "face"
    assert plan.to_dict() == original


def test_windows_line_endings_preserve_source_sections():
    from theodore_director.prompt_timing import compile_relay_prompt
    prompt = "subject_definitions:\r\nAt 00:01.000 through 00:02.000, source video.\r\ndetailed_description:\r\nAt 00:00.200 through 00:03.600, speaks.\r\n"
    result = compile_relay_prompt(prompt, context_frames=39, fps=24)
    assert "At 00:01.000 through 00:02.000, source video.\r\n" in result
    assert "At 00:01.825 through 00:05.225, speaks.\r\n" in result


def test_zero_context_is_a_passthrough():
    from theodore_director.prompt_timing import compile_relay_prompt
    prompt = "At 00:00.200 through 00:03.600, speaks."
    assert compile_relay_prompt(prompt, context_frames=0, fps=24) == prompt
