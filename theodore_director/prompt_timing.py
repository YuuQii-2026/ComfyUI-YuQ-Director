"""将交付片段的动作、台词时间换算到含接力前缀的 H3 生成时间轴。"""

from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP
import re


_TIME = r"\d{2,}:[0-5]\d(?:\.\d{1,3})?(?![\d:.])"
_SECTION = re.compile(r"^[ \t]*([a-z][a-z0-9_]*)[ \t]*:[ \t]*\r?$", re.MULTILINE)
_TARGET_SECTIONS = {"detailed_description", "overall_soundscape", "non_diegetic_music"}
_META_SECTIONS = {"subject_definitions", "summary", "retention_analysis"}
_WINDOW = re.compile(
    rf"(?P<head>(?:^|(?<=[.!?。！？]))[ \t]*(?:At|From|Between)\s+)"
    rf"(?P<start>{_TIME})(?P<link>\s+(?:through|until|to|and)\s+)(?P<end>{_TIME})",
    re.IGNORECASE,
)
_SCHEDULED = re.compile(
    rf"(?P<head>\bscheduled\s+)(?P<start>{_TIME})(?P<link>\s+to\s+)(?P<end>{_TIME})",
    re.IGNORECASE,
)
_DEADLINE = re.compile(rf"(?P<head>\bby\s+)(?P<time>{_TIME})", re.IGNORECASE)
_DIALOGUE = re.compile(r"<d(?:\s[^>]*)?>.*?</d>", re.DOTALL | re.IGNORECASE)


def _clock(seconds: Decimal) -> str:
    milliseconds = int((seconds * 1000).quantize(Decimal(1), rounding=ROUND_HALF_UP))
    minutes, remainder = divmod(milliseconds, 60000)
    seconds, fraction = divmod(remainder, 1000)
    return f"{minutes:02d}:{seconds:02d}.{fraction:03d}"


def _shift(value: str, offset: Decimal) -> str:
    minutes, seconds = value.split(":")
    return _clock(Decimal(minutes) * 60 + Decimal(seconds) + offset)


def compile_relay_prompt(prompt: str, *, context_frames: int, fps: int) -> str:
    """只编译目标时窗；素材定义、素材内部时间及 <d> 原文保持原样。

    支持句首 At/From/Between 时窗、时窗行内 by 截止时间，以及
    scheduled ... to ... 的重复时窗。非结构化提示词使用相同的显式时窗语法。
    """
    if context_frames <= 0:
        return prompt
    if fps <= 0:
        raise ValueError("fps 必须大于 0")
    offset = Decimal(context_frames) / Decimal(fps)
    verbatim: list[str] = []

    def protect(match: re.Match[str]) -> str:
        verbatim.append(match.group())
        return f"\x00YUQ_DIALOGUE_{len(verbatim) - 1}\x00"

    text = _DIALOGUE.sub(protect, prompt)
    structured = any(m[1] in _TARGET_SECTIONS | _META_SECTIONS for m in _SECTION.finditer(text))
    target = not structured
    lines: list[str] = []

    def window(match: re.Match[str]) -> str:
        return match["head"] + _shift(match["start"], offset) + match["link"] + _shift(match["end"], offset)

    for line in text.splitlines(keepends=True):
        section = _SECTION.fullmatch(line.rstrip("\r\n"))
        if section and structured:
            target = section[1] in _TARGET_SECTIONS
        elif target:
            first = _WINDOW.match(line)
            if first:
                # 截止时间只属于显式目标动作行；素材自身的 at/from 时间不参与。
                line = line[:first.end()] + _DEADLINE.sub(
                    lambda m: m["head"] + _shift(m["time"], offset), line[first.end():],
                )
            line = _SCHEDULED.sub(window, _WINDOW.sub(window, line))
        lines.append(line)
    text = "".join(lines)
    for index, original in enumerate(verbatim):
        text = text.replace(f"\x00YUQ_DIALOGUE_{index}\x00", original)

    boundary = _clock(offset)
    instruction = (
        f"The generated timeline begins with {context_frames} overlapping video frames "
        f"({boundary}) from the previous clip's motion and sound. "
        f"The new delivered segment begins at {boundary} on this generated timeline. "
        "Continue the existing motion, expressions, camera movement and ambience through that boundary "
        "without a pause or a fresh start. Preserve the preceding sound inside the overlap; "
        "new dialogue follows its scheduled windows in the delivered segment. "
        "Opening and first-frame descriptions refer to the beginning of the delivered segment. "
        "The explicit target event times below have been shifted to the generated timeline.\n"
    )
    header = re.search(r"^detailed_description:[ \t]*\r?\n", text, re.MULTILINE)
    if header:
        return text[:header.end()] + instruction + text[header.end():]
    return instruction + text
