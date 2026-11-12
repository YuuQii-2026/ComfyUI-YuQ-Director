#!/usr/bin/env node
// H3 分段短剧项目：从 Markdown 交付物导出 Theodore 导播台计划，并校验一致性与机械约束。
// 零依赖，Node.js 18+。用法：
//   node director.mjs "<项目文件夹>"            导出 + 校验
//   node director.mjs export "<项目文件夹>"     只导出
//   node director.mjs validate "<项目文件夹>"   只校验（含核对已有 JSON）

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FILES = {
  bible: "一致性圣经.md",
  mapping: "素材映射.md",
  genPrompts: "参考素材生成提示词.md",
  storyboard: "分镜设计.md",
  prompts: "H3分镜提示词.md",
};
const BASE_SEED = 123456790;
const FULL_FIELDS = ["subject_definitions", "summary", "retention_analysis", "detailed_description", "overall_soundscape", "non_diegetic_music"];
const BASE_FIELDS = ["integrated_multimodal_description", "overall_soundscape", "non_diegetic_music"];
const KIND = { 图片: "image", 视频: "video", 音频: "audio" };
const EXT = { image: "png", video: "mp4", audio: "wav" };
const RELAY_MARK = "（接续上一个分镜）";
const RELAY_YES = "是（接续上一个分镜）";
// 每个生成段（不是整个素材库）引用的素材上限；素材库本身可以登记任意数量的素材。
const MAX_IMAGES_PER_SEGMENT = 9;
const MAX_VIDEOS_PER_SEGMENT = 1;
const MAX_AUDIO_PER_SEGMENT = 2;
// 节奏：时长偏长时 H3 会放慢动作、拉长停顿来填满。
const MAX_BEAT_SECONDS = 3; // 单个动作节拍通常不超过 3 秒；连续对白按实际长度，不受限
const COVERAGE_WARN_SECONDS = 0.4; // 普通段未分配时间约不超过 0.4 秒（workflow-rules.md 第 5 节）
const COVERAGE_ERROR_SECONDS = 0.8;
const FILLER_BEAT_SECONDS = 1; // 眨眼/呼吸/重复表情只能伴随主要动作，不能单独撑过这个长度
const DIALOGUE_BEAT = /台词|对白|独白|旁白|心声|说话|说出|道白/;
const FILLER_BEAT = /眨眼|呼吸|皱眉|微表情|重复|停顿|沉默|静止|发呆|等待/;
const INTENTIONAL_HOLD = /落点|包袱|定格|收势/; // 包袱或情绪落点按表演需要保留
// 场景落地（consistency-locks.md 第 3A 节）：每次切镜都要重新写场景与基础光，不默认黑场/黑底。
const LIGHT_TERMS = /\b(?:light|lights|lit|lighting|lantern|lanterns|moonlight|daylight|sunlight|illumination|glow|glows|lamp|firelight|candlelight|torchlight|neon|shadow|shadows)\b/i;
const DARK_PHRASES = /\b(?:fades?\s+(?:to|into)\s+black|cuts?\s+to\s+black|black\s+screen|blackout|pitch[- ]black|pure\s+black|solid\s+black|black\s+background|black\s+void|(?:complete|total)\s+darkness|dark\s+void|silhouettes?)\b/i;
// 这些措辞会让本应单独提交的提示词依赖其他分镜或全片结构。
const CROSS_SEGMENT = [
  /(?:上一|上个|前一|之前|下一|下个|后续)(?:个)?分镜/,
  /(?:承接|延续|衔接|接续|回顾|预告)(?:上一|上个|前一|之前|下一|下个|后续)?(?:个)?分镜/,
  /\b(?:previous|prior|next|following|preceding)\s+(?:segment|storyboard|prompt|clip|shot\s+segment)/i,
  /\bcontinu(?:es|ing|ation)\s+(?:from|of)\s+(?:the\s+)?(?:previous|prior|preceding|last)\b/i,
  /\b(?:recurr(?:ing|s)?|repeats?)\s+(?:across|in)\s+(?:multiple|other)\s+(?:segments?|prompts?|storyboards?)/i,
  /\b(?:\w+-)?segments?\b/i,
  /\bepisodes?\b/i,
];

// 对白读音（references/pronunciation.md）：发音替换表、高风险词清单、生僻字。
const SKILL_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CJK = /[一-鿿]/;
const PUNCTUATION = /[\s，。！？、；：“”‘’「」『』（）()…—\-,.!?;:"'~·]/g;
/**
 * GB2312 一级汉字（3755 个常用字），用 TextDecoder 按区位码生成，不需要外置字表。
 * 运行环境不支持 gb2312 解码时为 null，生僻字检查随之跳过。
 */
const COMMON_CHARS = (() => {
  try {
    const decoder = new TextDecoder("gb2312");
    const chars = new Set();
    for (let high = 0xb0; high <= 0xd7; high += 1) {
      for (let low = 0xa1; low <= 0xfe; low += 1) {
        if (high === 0xd7 && low > 0xf9) break;
        const char = decoder.decode(new Uint8Array([high, low]));
        if (char.length === 1 && char !== "�") chars.add(char);
      }
    }
    return chars.size > 3000 ? chars : null;
  } catch {
    return null;
  }
})();

const read = (file) => fs.readFileSync(file, "utf8").replace(/^﻿/, "").replace(/\r\n?/g, "\n");
const normalize = (text) => text.replace(/\s+/g, " ").trim();
const parseTime = (value) => { const [m, s] = value.split(":").map(Number); return m * 60 + s; };
const safeFileName = (name) => name.replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "_").replace(/[. ]+$/, "").trim() || "Theodore Project";

function field(block, name) {
  const match = new RegExp(`^-\\s*${name}：[ \\t]*(.*)$`, "m").exec(block);
  return match ? match[1].trim() : null;
}

/** 按标题切块：返回 [{ heading, body }]。 */
function sections(text, headingPattern) {
  const matches = [...text.matchAll(headingPattern)];
  return matches.map((match, index) => ({
    match,
    body: text.slice(match.index + match[0].length, index + 1 < matches.length ? matches[index + 1].index : text.length),
  }));
}

/** Markdown 表格 → 单元格数组（含表头，去掉分隔行）。 */
function tableRows(text) {
  return text.split("\n").map((line) => line.trim()).filter((line) => line.startsWith("|"))
    .map((line) => line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()))
    .filter((cells) => !cells.every((cell) => /^:?-{2,}:?$/.test(cell)));
}

/** 发音替换表：“## 发音替换表” 下的表格，列为 原词 / 读音 / 提示词中使用 / 依据；跳过表头、“无”和未填写的占位行。 */
function parseReplacementTable(text) {
  const section = /^##\s+发音替换表\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m.exec(text);
  if (!section) return [];
  return tableRows(section[1]).slice(1)
    .filter((cells) => cells.length >= 3 && cells[0] && cells[2] && cells[0] !== "无" && !cells[0].includes("【"))
    .map((cells) => ({ original: cells[0], reading: cells[1] ?? "", replacement: cells[2], basis: cells[3] ?? "" }));
}

/** 高风险读音词：读取 references/pronunciation.md「高风险词清单」表的前四列；文件不存在时返回空表。 */
function loadRiskWords() {
  const file = path.join(SKILL_ROOT, "references", "pronunciation.md");
  if (!fs.existsSync(file)) return [];
  const section = /^##\s+高风险词清单\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m.exec(read(file));
  if (!section) return [];
  return tableRows(section[1]).slice(1).flatMap((cells) => cells[0].split(/[、，,/／]/).map((word) => word.trim()).filter(Boolean)
    .map((word) => ({ word, reading: cells[1] ?? "", mistaken: cells[2] ?? "", suggestion: cells[3] ?? "" })));
}

/** 提取对白/Voiceover 原文，兼容 [Chinese] 与社区写法 【Chinese】。 */
const promptDialogues = (prompt) => [...prompt.matchAll(/<d>\s*(?:(?:\[[^\]]*\]|【[^】]*】)\s*)?([\s\S]*?)<\/d>/g)].map((match) => match[1].trim());
/** 分镜设计“对白或旁白”字段里引号内的原文。 */
const boardDialogues = (value) => [...value.matchAll(/[“「『"]([^”」』"]+)[”」』"]/g)].map((match) => match[1].trim());
const squash = (text) => text.replace(PUNCTUATION, "");

function parseBible(text) {
  const locks = new Map();
  for (const match of text.matchAll(/^```(lock:[^\s`]+)[ \t]*\n([\s\S]*?)\n```/gm)) {
    const key = match[1].slice(5);
    locks.set(key, match[2].trim());
  }
  return locks;
}

function parseAssets(text, errors) {
  const assets = [];
  for (const { match, body } of sections(text, /^###\s+\d+\.\s+`([^`]+)`\s*$/gm)) {
    const alias = match[1].trim();
    const typeText = field(body, "类型");
    const kind = KIND[typeText ?? ""];
    if (!kind) { errors.push(`素材 ${alias} 缺少有效的“类型：图片/视频/音频”`); continue; }
    const durationText = field(body, "时长");
    const duration = durationText ? Number.parseFloat(durationText) : NaN;
    assets.push({
      alias,
      kind,
      group: field(body, "分组") ?? "",
      note: field(body, "说明") ?? "",
      fileName: field(body, "文件名") || `${alias}.${EXT[kind]}`,
      path: field(body, "本地路径") ?? "",
      durationSeconds: kind === "image" ? null : (Number.isFinite(duration) ? duration : null),
      includeVideoAudio: kind === "video" && field(body, "启用视频伴音") === "是",
    });
  }
  return assets;
}

function parseGenPrompts(text) {
  const prompts = new Map();
  for (const { match, body } of sections(text, /^###\s+`([^`]+)`.*$/gm)) {
    const block = /^```prompt[ \t]*\n([\s\S]*?)\n```/m.exec(body);
    if (block) prompts.set(match[1].trim(), block[1].trim());
  }
  return prompts;
}

/** 图像可单独约束媒介与静态外观，避免被迫带入视频人物/持握/照片指令。 */
function imagePromptErrors(asset, prompt, locks, legacyStyle = "") {
  if (asset.kind !== "image" || !prompt) return [];
  const errors = [];
  const imageStyle = locks.get("image-style");
  const style = imageStyle ? normalize(imageStyle) : legacyStyle;
  const flat = normalize(prompt);
  if (style && !flat.includes(style)) errors.push(`素材 ${asset.alias} 的生图提示词没有逐字包含 lock:${imageStyle ? "image-style" : "style"} 的风格描述`);
  const appearance = locks.get(`image:${asset.alias}`);
  if (appearance) {
    if (!flat.includes(normalize(appearance))) errors.push(`素材 ${asset.alias} 的生图提示词没有逐字包含 lock:image:${asset.alias} 的静态外观`);
  } else {
    const subjectLocks = [...locks.entries()].filter(([key]) => key.startsWith("subject:"));
    if (subjectLocks.length && !subjectLocks.some(([, value]) => flat.includes(normalize(value)))) {
      errors.push(`素材 ${asset.alias} 的生图提示词没有逐字包含任何 lock:subject 外观描述；含剧情或持握的锁应另存 lock:image:${asset.alias}`);
    }
  }
  return errors;
}

function parseStoryboard(text) {
  return sections(text, /^###\s+(.+?)｜(\d{2}:\d{2})—(\d{2}:\d{2})([^\n]*)$/gm).map(({ match, body }) => {
    const relay = field(body, "长镜头跨段");
    const scene = field(body, "场景") ?? "";
    return {
      name: match[1].trim(),
      start: parseTime(match[2]),
      end: parseTime(match[3]),
      relayDeclared: relay,
      relay: relay === RELAY_YES,
      sceneSubjects: [...scene.matchAll(/Subject\s*(\d+)/gi)].map((item) => Number(item[1])),
      startBlocking: field(body, "起始站位") ?? field(body, "起始状态（每段生成首帧）") ?? field(body, "起始状态") ?? "",
      endBlocking: field(body, "结束站位") ?? field(body, "结束状态") ?? "",
      continuousShot: (field(body, "连续镜头") ?? "").startsWith("是"),
      dialogue: field(body, "对白或旁白") ?? "",
      reviewNote: field(body, "审片要点") ?? "",
      seam: field(body, "接缝设计") ?? "",
      beats: parseBeats(field(body, "节拍") ?? ""),
      beatsDeclared: field(body, "节拍") != null,
      anchorsDeclared: field(body, "逐镜场景锚点") != null,
      dialogueLines: boardDialogues(field(body, "对白或旁白") ?? ""),
      timeline: (field(body, "时间线") ?? "主线").replace(/[（(].*$/, "").trim() || "主线",
      timeJump: (field(body, "时间跳跃") ?? "").startsWith("是"),
    };
  });
}

/** 节拍写成 “0–1.2 动作；1.2–2 动作；…”（成片时间，秒）。 */
function parseBeats(value) {
  return [...value.matchAll(/(\d+(?:\.\d+)?)\s*[–—~-]\s*(\d+(?:\.\d+)?)\s*(?:秒|s)?\s*([^；;]*)/g)]
    .map((match) => ({ start: Number(match[1]), end: Number(match[2]), text: match[3].trim() }));
}

const INVISIBLE_PREFIX = "不可见";

/**
 * 状态时间线：“## 状态时间线” 下的表格，表头为分镜名，每行一个 <Subject N>。
 * 单元格写 “状态” 或 “起始状态 → 结束状态”；以“不可见”开头的状态表示画面中看不到它。
 */
function parseStateTimeline(text) {
  const section = /^##\s+状态时间线\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m.exec(text);
  if (!section) return null;
  const rows = section[1].split("\n").map((line) => line.trim()).filter((line) => line.startsWith("|"))
    .map((line) => line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
  if (rows.length < 2) return { columns: [], rows: [] };
  const [header, ...rest] = rows;
  return {
    columns: header.slice(1),
    rows: rest.filter((cells) => !cells.every((cell) => /^:?-{2,}:?$/.test(cell)))
      .map((cells) => ({
        label: cells[0],
        subject: Number(/Subject\s*(\d+)/i.exec(cells[0])?.[1] ?? NaN),
        states: cells.slice(1).map((cell) => cell.split("→").map((state) => state.trim()).filter(Boolean)),
      })),
  };
}

const isVisibleState = (state) => !state.startsWith(INVISIBLE_PREFIX);
// 连续性只比较“它在哪、什么样”：“不可见：画外，站在第四级台阶” 与下一段 “站在第四级台阶” 视为同一状态。
const stateCore = (state) => state.replace(/^不可见[:：]\s*/, "").replace(/^画外[，,、]\s*/, "").trim();

/** 节拍可以并行（重叠），按并集计算覆盖了多少秒。 */
function coveredSeconds(beats, duration) {
  const spans = beats.map((beat) => [Math.max(0, beat.start), Math.min(duration, beat.end)]).filter(([start, end]) => end > start).sort((a, b) => a[0] - b[0]);
  let total = 0;
  let cursor = 0;
  for (const [start, end] of spans) {
    if (end <= cursor) continue;
    total += end - Math.max(start, cursor);
    cursor = end;
  }
  return total;
}

/**
 * 每个会出现、消失、移动或改变的元素，逐段登记状态：
 * - 本段任一时刻可见 ⇔ 提示词里有 <Subject N>（定义过的 Subject 会被 H3 画出来）；
 * - 本段起始状态必须等于上一段结束状态（声明“时间跳跃：是”的段除外），
 *   因此“上一段看得到空锅、下一段锅里突然有龙”这类矛盾会被拦下：出现必须是本段画面里的事件。
 */
function checkStateTimeline(timeline, storyboard, blocks, errors, warnings) {
  if (!timeline) {
    errors.push("分镜设计缺少“## 状态时间线”：会出现、消失、被拿出/藏起、移动或损坏的道具/角色/特效都应逐段登记状态");
    return;
  }
  const names = storyboard.map((segment) => segment.name);
  if (timeline.columns.join("|") !== names.join("|")) {
    errors.push(`状态时间线的表头应依次为各分镜名称：${names.join(" | ")}`);
    return;
  }
  for (const row of timeline.rows) {
    if (Number.isNaN(row.subject)) { errors.push(`状态时间线“${row.label}”需要写明 <Subject N>`); continue; }
    const pattern = new RegExp(`<Subject\\s+${row.subject}>`);
    names.forEach((name, index) => {
      const states = row.states[index] ?? [];
      const label = `状态时间线 <Subject ${row.subject}>「${name}」`;
      if (!states.length) { errors.push(`${label}为空：不出现也要写“不可见：原因”`); return; }
      const visible = states.some(isVisibleState);
      const inPrompt = pattern.test(blocks[index]?.prompt ?? "");
      if (visible && !inPrompt) errors.push(`${label}可见，但该段提示词没有定义 <Subject ${row.subject}>`);
      if (!visible && inPrompt) errors.push(`${label}不可见，但该段提示词定义/引用了 <Subject ${row.subject}>：H3 会把定义过的 Subject 画出来。删掉它的定义和参考图，并正面写出它所在位置此刻的样子（例如“锅里只有翻滚的汤”）`);
      if (index > 0 && !storyboard[index].timeJump) {
        // 多时间线叙事：与“同一条时间线上的上一段”比较，而不是紧邻的上一段。
        let before = index - 1;
        while (before >= 0 && storyboard[before].timeline !== storyboard[index].timeline) before -= 1;
        const previous = before >= 0 ? row.states[before]?.at(-1) : undefined;
        if (previous && stateCore(states[0]) !== stateCore(previous)) {
          const where = before === index - 1 ? "上一段" : `同一时间线（${storyboard[index].timeline}）上的前一段「${names[before]}」`;
          errors.push(`${label}状态不连续：${where}结束为“${previous}”，本段开始为“${states[0]}”。状态变化必须写成本段画面中的事件（“${previous} → …”），或在分镜设计声明“时间跳跃：是”`);
        }
      }
    });
  }
  if (!timeline.rows.length) warnings.push("状态时间线没有登记任何元素");
}

function parsePrompts(text) {
  const blocks = [];
  const pattern = /^##\s+(.+?)｜(\d{2}:\d{2})—(\d{2}:\d{2})(（接续上一个分镜）)?[ \t]*\n\s*```text[ \t]*\n([\s\S]*?)\n```/gm;
  for (const match of text.matchAll(pattern)) {
    blocks.push({ title: match[1].trim(), start: parseTime(match[2]), end: parseTime(match[3]), relayMarked: Boolean(match[4]), prompt: match[5] });
  }
  const headings = [...text.matchAll(/^##\s+.+?｜\d{2}:\d{2}—\d{2}:\d{2}/gm)].length;
  return { blocks, headings };
}

function promptSections(prompt) {
  const order = [...prompt.matchAll(/^([a-z_]+):/gm)].map((match) => ({ name: match[1], index: match.index }));
  const result = {};
  order.forEach((item, index) => {
    result[item.name] = prompt.slice(item.index + item.name.length + 1, index + 1 < order.length ? order[index + 1].index : prompt.length);
  });
  return { order: order.map((item) => item.name), result };
}

/** 只检查当前段的实际正向输入；负向字段不能替代无画面文字要求。 */
export function inspectSegmentPrompt(prompt, duration) {
  const { result } = promptSections(prompt);
  const description = result.detailed_description ?? result.integrated_multimodal_description ?? "";
  const warnings = [];
  const noText = /\b(?:no|without|free\s+of)\b[^.\n]{0,140}\b(?:subtitles|captions|readable\s+text|on[- ]screen\s+text)\b/i.test(description);
  const speechOnly = /\b(?:dialogue|speech|spoken\s+words)\b[^.\n]{0,70}\b(?:only|audio[- ]only)\b/i.test(description);
  if (!noText || (prompt.includes("<d>") && !speechOnly)) {
    warnings.push("正向正文缺少无画面文字/对白仅发声约束；负向字段和 <d> 本身不保证无字幕");
  }
  const definitionIds = [...(result.subject_definitions ?? "").matchAll(/^\s*<Subject\s+(\d+)>\s+(?:is|are)\b/gm)].map((item) => item[1]);
  const repeated = [...new Set(definitionIds.filter((id, index) => definitionIds.indexOf(id) !== index))];
  if (repeated.length) warnings.push(`Subject重复定义：${repeated.join("、")}；一对象一定义，合并重复锁与参考绑定`);
  const voiceBindings = [...(result.subject_definitions ?? "").matchAll(/^\s*(\{\{ref:[^}]+\}\})\s+is\s+the\s+voice-timbre\s+reference\s+for\s+([^\n]+)/gm)].map((item) => normalize(item[0]));
  if (new Set(voiceBindings).size < voiceBindings.length) warnings.push("声音参考重复绑定：删除完全重复的定义行");
  const chars = promptDialogues(prompt).reduce((sum, line) => sum + [...line].filter((char) => CJK.test(char)).length, 0);
  if (chars && duration >= 10 && duration - chars / 3 >= 5) {
    warnings.push(`短对白长时窗：${chars}字/${duration}秒，试排净发声约${(chars / 4.5).toFixed(1)}–${(chars / 3).toFixed(1)}秒；核对其余时间的有效事件，勿靠转头、空等或重复操作补满`);
  }
  if (chars / duration > 5) warnings.push(`对白预算偏紧：${chars}字/${duration}秒尚未扣停顿与独占动作，应按角色试读重排`);
  if (/\b(?:push(?:es|ing)?[- ]+in|pull(?:s|ing)?[- ]+out|zoom(?:s|ing)?[- ]+(?:in|out)|dolly[- ]+(?:in|out))\b/i.test(description)) {
    warnings.push("出现推拉/变焦：当前分镜偏好停用装饰性推拉，核对是否有用户明确要求，优先用有效调度与信息揭示");
  }
  return warnings;
}

function buildNote(segment, replaced = []) {
  const lines = [];
  if (segment.reviewNote) lines.push(`要点：${segment.reviewNote}`);
  if (segment.timeline !== "主线") lines.push(`时间线：${segment.timeline}`);
  if (segment.startBlocking) lines.push(`起：${segment.startBlocking}`);
  if (segment.endBlocking) lines.push(`止：${segment.endBlocking}`);
  if (segment.dialogue && segment.dialogue !== "无") lines.push(`对白：${segment.dialogue}`);
  // 审片时若这几处读音不对，先对照提示词里实际用的同音字。
  if (replaced.length) lines.push(`发音替换：${replaced.join("、")}`);
  return lines.join("\n");
}

function projectNotes(locks) {
  return [...locks.entries()].map(([key, value]) => `[lock:${key}]\n${value}`).join("\n\n");
}

/** 读取项目文件夹，返回导出的计划和全部校验结果。 */
export function buildProject(projectDir) {
  const errors = [];
  const warnings = [];
  const file = (name) => path.join(projectDir, name);
  for (const key of ["bible", "mapping", "storyboard", "prompts"]) {
    if (!fs.existsSync(file(FILES[key]))) errors.push(`缺少必需文件：${FILES[key]}`);
  }
  if (errors.length) return { errors, warnings };
  if (!fs.existsSync(file(FILES.genPrompts))) warnings.push(`缺少 ${FILES.genPrompts}：素材卡片上将没有生成提示词`);

  const bibleText = read(file(FILES.bible));
  const mappingText = read(file(FILES.mapping));
  const storyText = read(file(FILES.storyboard));
  const promptText = read(file(FILES.prompts));
  const genPrompts = fs.existsSync(file(FILES.genPrompts)) ? parseGenPrompts(read(file(FILES.genPrompts))) : new Map();

  const locks = parseBible(bibleText);
  const replacements = parseReplacementTable(bibleText);
  const riskWords = loadRiskWords();
  const style = locks.get("style");
  let styleDescriptor = "";
  if (!style) errors.push("一致性圣经缺少 ```lock:style 代码块");
  else if (!/^The target video is /.test(style)) errors.push("lock:style 必须以 “The target video is ” 开头（生图提示词会复用其后的描述）");
  else styleDescriptor = normalize(style.replace(/^The target video is /, "").replace(/\.\s*$/, ""));
  if (!locks.get("negative")) warnings.push("一致性圣经缺少 ```lock:negative，JSON 的 negativePrompt 将为空");
  for (const [key, value] of locks) {
    if (CROSS_SEGMENT.some((pattern) => pattern.test(value))) errors.push(`锁定块 lock:${key} 含跨段措辞`);
    if (/\{\{ref:/.test(value)) errors.push(`锁定块 lock:${key} 不应包含素材引用，引用写在提示词的 Subject 定义句里`);
  }

  const titleMatch = /^#\s+《(.+?)》素材映射\s*$/m.exec(mappingText);
  const projectName = titleMatch?.[1].trim() || path.basename(projectDir);
  const assets = parseAssets(mappingText, errors);
  const assetByAlias = new Map();
  for (const asset of assets) {
    if (!asset.alias || /[\s{}]/.test(asset.alias) || asset.alias.endsWith(".audio")) errors.push(`素材别名无效：${asset.alias}`);
    const key = asset.alias.toLowerCase();
    if (assetByAlias.has(key)) errors.push(`素材别名重复：${asset.alias}`);
    assetByAlias.set(key, asset);
    if (asset.kind !== "image" && (asset.durationSeconds == null || asset.durationSeconds < 2 || asset.durationSeconds > 15)) {
      errors.push(`素材 ${asset.alias} 需要“时长：2–15”秒（H3 预检依赖该值）`);
    }
    if (!asset.note) warnings.push(`素材 ${asset.alias} 缺少“说明”，导播台卡片上不会显示用途`);
    const gen = genPrompts.get(asset.alias);
    if (!gen && genPrompts.size) warnings.push(`素材 ${asset.alias} 在 ${FILES.genPrompts} 中没有 \`\`\`prompt 生成提示词`);
    errors.push(...imagePromptErrors(asset, gen, locks, styleDescriptor));
  }
  for (const alias of genPrompts.keys()) {
    if (!assetByAlias.has(alias.toLowerCase())) warnings.push(`${FILES.genPrompts} 中的 ${alias} 未在素材映射登记`);
  }
  // 人物默认只用一张合图（全身三视图 + 放大脸部特写），不另登记脸图。
  for (const asset of assets) {
    const split = /^(.+)_(?:face|portrait|head)$/i.exec(asset.alias);
    if (split && assetByAlias.has(`${split[1].toLowerCase()}_sheet`)) {
      warnings.push(`素材 ${asset.alias} 与 ${split[1]}_sheet 同时存在：人物默认只用一张合图（一个文件一个别名）。确需第二张时先写明合图的具体缺口`);
    }
  }

  const storyboard = parseStoryboard(storyText);
  const { blocks, headings } = parsePrompts(promptText);
  if (!blocks.length) errors.push("未在 H3分镜提示词.md 中识别到 “## 名称｜MM:SS—MM:SS” + ```text 代码块");
  if (headings !== blocks.length) errors.push(`识别到 ${headings} 个分镜标题，但只有 ${blocks.length} 个紧随其后的 text 代码块`);
  if (storyboard.length !== blocks.length) errors.push(`分镜设计有 ${storyboard.length} 段，提示词有 ${blocks.length} 段，数量不一致`);

  // 重名分镜在提示词标题后追加两位序号。
  const nameCounts = new Map();
  storyboard.forEach((segment) => nameCounts.set(segment.name, (nameCounts.get(segment.name) ?? 0) + 1));
  const seen = new Map();
  const expectedTitles = storyboard.map((segment) => {
    const count = (seen.get(segment.name) ?? 0) + 1;
    seen.set(segment.name, count);
    return nameCounts.get(segment.name) > 1 ? `${segment.name}${String(count).padStart(2, "0")}` : segment.name;
  });

  const negative = locks.get("negative") ?? "";
  const shots = [];
  let previousEnd = null;
  let hasRelay = false;
  blocks.forEach((block, index) => {
    const label = `第${index + 1}段「${block.title}」`;
    const segment = storyboard[index];
    const duration = block.end - block.start;
    if (duration < 5 || duration > 15) errors.push(`${label}时长 ${duration} 秒，不在 5–15 秒内`);
    if (previousEnd != null && block.start !== previousEnd) warnings.push(`${label}起点与上一段终点不连续`);
    previousEnd = block.end;
    if (expectedTitles[index] && block.title !== expectedTitles[index]) errors.push(`${label}标题应为“${expectedTitles[index]}”（与分镜设计名称一致）`);
    if (segment) {
      if (segment.relayDeclared == null) errors.push(`${label}在分镜设计中缺少“长镜头跨段：是（接续上一个分镜）/否”`);
      if (segment.relay !== block.relayMarked) errors.push(`${label}的标题接续标记与分镜设计的长镜头跨段声明不一致`);
      if (index > 0 && segment.continuousShot && !segment.relay) errors.push(`${label}声明同一连续镜头，但未开启长镜头跨段/latentRelay`);
      if (segment.end - segment.start !== duration) errors.push(`${label}时长与分镜设计不一致`);
      if (!segment.startBlocking || !segment.endBlocking) warnings.push(`${label}在分镜设计中缺少起始站位或结束站位`);
      if (!segment.reviewNote) warnings.push(`${label}在分镜设计中缺少“审片要点”`);
      if (!segment.anchorsDeclared) warnings.push(`${label}在分镜设计中缺少“逐镜场景锚点”（每个 Shot 的可见地标与基础光）`);
    }
    if (index === 0 && block.relayMarked) errors.push(`${label}是首段，不能标记接续`);
    const relay = Boolean(segment?.relay) && index > 0;
    if (relay) hasRelay = true;

    const prompt = block.prompt;
    const { order, result } = promptSections(prompt);
    warnings.push(...inspectSegmentPrompt(prompt, duration).map((message) => `${label}${message}`));
    const full = order.includes("subject_definitions");
    const expected = full ? FULL_FIELDS : BASE_FIELDS;
    if (order.join() !== expected.join()) errors.push(`${label}字段顺序应为 ${expected.join(" / ")}，实际：${order.join(" / ")}`);
    if (/<(?:Picture|Video|Audio)\s+\d+>/i.test(prompt)) errors.push(`${label}残留官方 <Picture/Video/Audio N> 编号，应改用 {{ref:别名}}`);
    if (/\{\{ref:分镜\d+成片(?:\.audio)?\}\}/.test(prompt)) errors.push(`${label}引用了已生成分镜，禁止把生成结果当素材`);
    for (const pattern of CROSS_SEGMENT) {
      if (pattern.test(prompt)) { errors.push(`${label}含跨段/全片结构措辞（${pattern.source}），代码块必须独立`); break; }
    }

    // 素材引用与 H3 每段上限。
    const refs = [...new Set([...prompt.matchAll(/\{\{ref:([^{}]+)\}\}/g)].map((match) => match[1].trim()))];
    const used = new Map();
    let audioCount = 0;
    const audioDurations = [];
    for (const ref of refs) {
      const isAudioTrack = ref.endsWith(".audio");
      const asset = assetByAlias.get((isAudioTrack ? ref.slice(0, -6) : ref).toLowerCase());
      if (!asset) { errors.push(`${label}引用未登记素材：${ref}`); continue; }
      if (isAudioTrack) {
        if (asset.kind !== "video" || !asset.includeVideoAudio) errors.push(`${label}的 ${ref} 只能用于“启用视频伴音：是”的视频`);
        audioCount += 1;
        audioDurations.push(asset.durationSeconds ?? 0);
        continue;
      }
      used.set(asset.alias, asset);
      if (asset.kind === "audio") { audioCount += 1; audioDurations.push(asset.durationSeconds ?? 0); }
    }
    const images = [...used.values()].filter((asset) => asset.kind === "image").length;
    const videos = [...used.values()].filter((asset) => asset.kind === "video");
    if (images > MAX_IMAGES_PER_SEGMENT) errors.push(`${label}引用 ${images} 张图片，每段最多 ${MAX_IMAGES_PER_SEGMENT} 张`);
    if (videos.length > MAX_VIDEOS_PER_SEGMENT) errors.push(`${label}引用 ${videos.length} 个视频，每段最多 ${MAX_VIDEOS_PER_SEGMENT} 个`);
    if (audioCount > MAX_AUDIO_PER_SEGMENT) errors.push(`${label}引用 ${audioCount} 路声音参考，每段最多 ${MAX_AUDIO_PER_SEGMENT} 路`);
    const audioTotal = audioDurations.reduce((sum, value) => sum + value, 0);
    if (audioTotal > 15) errors.push(`${label}音频参考合计 ${audioTotal} 秒，超过 15 秒`);
    if (videos.reduce((sum, asset) => sum + (asset.durationSeconds ?? 0), 0) > 15) errors.push(`${label}视频参考合计超过 15 秒`);
    if (audioCount && !images && !videos.length) errors.push(`${label}只有音频参考，H3 要求同时有图片或视频`);

    // 锁定块逐字一致。
    const flat = normalize(prompt);
    const description = normalize(result.detailed_description ?? result.integrated_multimodal_description ?? "");
    if (style && !description.startsWith(normalize(style))) errors.push(`${label}的描述字段第一句必须是 lock:style 原文`);
    const subjects = [...new Set([...prompt.matchAll(/<Subject\s+(\d+)>/g)].map((match) => Number(match[1])))];
    const definitions = normalize(result.subject_definitions ?? "");
    for (const number of subjects) {
      const lock = locks.get(`subject:${number}`);
      if (!lock) warnings.push(`${label}使用了 <Subject ${number}>，但一致性圣经没有 lock:subject:${number}`);
      else if (!definitions.includes(normalize(lock))) errors.push(`${label}的 subject_definitions 没有逐字包含 lock:subject:${number}`);
      const ambience = locks.get(`ambience:${number}`);
      if (ambience && !normalize(result.overall_soundscape ?? "").includes(normalize(ambience))) errors.push(`${label}的 overall_soundscape 没有包含场景 lock:ambience:${number}`);
    }
    for (const number of segment?.sceneSubjects ?? []) {
      if (!subjects.includes(number)) errors.push(`${label}分镜设计声明场景为 <Subject ${number}>，但提示词没有使用它`);
    }
    const dialogueCount = (prompt.match(/<d>/g) ?? []).length;
    const speakers = new Set();
    for (const match of prompt.matchAll(/\((S\d+(?:\s*,\s*S\d+)*)\)/g)) match[1].split(",").forEach((id) => speakers.add(id.trim()));
    for (const speaker of speakers) {
      const lock = locks.get(`voice:${speaker}`);
      if (dialogueCount && lock && !flat.includes(normalize(lock))) errors.push(`${label}中 ${speaker} 发声，但没有逐字使用 lock:voice:${speaker}`);
    }
    for (const match of prompt.matchAll(/<d>/g)) {
      const before = prompt.slice(Math.max(0, match.index - 400), match.index);
      const sentenceStart = Math.max(before.lastIndexOf(". "), before.lastIndexOf("</d>"));
      if (!/\(S\d+/.test(before.slice(sentenceStart + 1))) { warnings.push(`${label}有对白没有在同一句里写明说话人 (Sx)`); break; }
    }
    // 场景也是 Subject：两个以上说话人，或除场景外还有多个 Subject 时才要求写闭嘴。
    if (dialogueCount && (speakers.size > 1 || subjects.length > 2) && !/lips[^.]{0,40}closed/i.test(prompt)) {
      warnings.push(`${label}有对白且多人出镜，但没有写非发声者 lips remain completely closed`);
    }
    // 尾部 Voiceover 是独立声音层；仅从配乐检查中分离，导出保留完整原文。
    const music = normalize((result.non_diegetic_music ?? "").split(/^\s*【Voiceover】\s*$/m)[0]);
    if (music && music !== "N/A") {
      const musicLock = locks.get("music");
      if (musicLock && !music.includes(normalize(musicLock))) errors.push(`${label}的 non_diegetic_music 没有使用 lock:music 原文`);
      if (!musicLock) warnings.push(`${label}生成配乐但没有 lock:music；各段配乐会不同，建议写 N/A 后期统一配乐`);
    }
    // 对白读音（references/pronunciation.md）：已登记的原词不能留在 <d> 里；生僻字、高风险词提醒；还原后须与分镜设计对白一致。
    const lines = promptDialogues(prompt);
    const spoken = lines.join("\n");
    for (const row of replacements) {
      if (row.replacement !== row.original && spoken.includes(row.original)) {
        errors.push(`${label}对白里仍有已登记替换的原词“${row.original}”：<d> 里应写“${row.replacement}”（发音替换表）`);
      }
    }
    if (COMMON_CHARS) {
      const rare = [...new Set([...spoken].filter((char) => CJK.test(char) && !COMMON_CHARS.has(char)))];
      if (rare.length) warnings.push(`${label}对白含生僻字（不在常用 3755 字内）：${rare.join("、")}。生僻字更容易读错：换成同音常用字，并登记到发音替换表（references/pronunciation.md）`);
    }
    const registered = replacements.map((row) => row.original);
    const risky = riskWords.filter((entry) => spoken.includes(entry.word) && !registered.some((original) => original.includes(entry.word) || entry.word.includes(original)));
    if (risky.length) {
      warnings.push(`${label}对白含高风险读音词：${risky.map((entry) => `“${entry.word}”（应读 ${entry.reading}，易读成 ${entry.mistaken}；可换 ${entry.suggestion}）`).join("、")}。换同音字并登记到发音替换表；确认读音没问题的登记为“提示词中使用 = 原词”`);
    }
    if (segment?.dialogueLines.length && lines.length) {
      const restored = lines.map((line) => replacements.reduce((text, row) => (row.replacement !== row.original ? text.replaceAll(row.replacement, row.original) : text), line));
      if (restored.map(squash).join("|") !== segment.dialogueLines.map(squash).join("|")) {
        warnings.push(`${label}对白与分镜设计不一致：提示词还原后“${restored.join(" / ")}”，分镜设计“${segment.dialogueLines.join(" / ")}”。原文逐字保留，只允许发音替换表里登记的替换`);
      }
    }
    const replacedHere = replacements.filter((row) => row.replacement !== row.original && spoken.includes(row.replacement)).map((row) => `${row.original}→${row.replacement}`);

    if (relay) {
      if (segment && storyboard[index - 1] && segment.timeline !== storyboard[index - 1].timeline) {
        errors.push(`${label}是接力段，必须与上一段在同一条时间线（上一段「${storyboard[index - 1].timeline}」，本段「${segment.timeline}」）`);
      }
      if (!segment?.seam) warnings.push(`${label}是接力段，分镜设计缺少“接缝设计”`);
      if (segment?.timeJump) errors.push(`${label}是接力段（同一长镜头），不能同时声明时间跳跃`);
    }

    // 节奏：内容排不满时长时，H3 会用慢动作把剩余时间填满。
    const hasDialogue = prompt.includes("<d>");
    if (segment && !segment.beatsDeclared) errors.push(`${label}在分镜设计中缺少“节拍”（逐秒动作表，如“0–1.2 动作；1.2–2.5 动作”），时长必须由节拍推出`);
    if (segment?.beats.length) {
      const beats = segment.beats;
      const covered = coveredSeconds(beats, duration);
      const lastEnd = Math.max(...beats.map((beat) => beat.end));
      if (lastEnd > duration + 0.2) warnings.push(`${label}节拍排到 ${lastEnd} 秒，超过段长 ${duration} 秒`);
      const uncovered = duration - covered;
      if (uncovered > COVERAGE_ERROR_SECONDS) {
        errors.push(`${label}节拍只覆盖 ${covered.toFixed(1)}/${duration} 秒：空出来的时间 H3 会用慢动作填满。先缩短时长；内容确实不足时补真实的动作、反应或切镜，不要用眨眼呼吸凑数`);
      } else if (uncovered > COVERAGE_WARN_SECONDS) {
        warnings.push(`${label}节拍有 ${uncovered.toFixed(1)} 秒未分配（普通段应不超过约 ${COVERAGE_WARN_SECONDS} 秒）：优先把段长缩短到节拍结束处`);
      }
      const label_ = (beat) => `“${beat.start}–${beat.end} ${beat.text.slice(0, 14)}”`;
      const overlong = beats.filter((beat) => beat.end - beat.start > MAX_BEAT_SECONDS && !DIALOGUE_BEAT.test(beat.text));
      if (overlong.length) warnings.push(`${label}有动作节拍超过 ${MAX_BEAT_SECONDS} 秒：${overlong.map(label_).join("、")}。核对真实动作与信息占时，不足则缩短或合并，不能仅把同一动作拆成多个标签（连续对白不受此限）`);
      const filler = beats.filter((beat) => beat.end - beat.start > FILLER_BEAT_SECONDS && FILLER_BEAT.test(beat.text) && !INTENTIONAL_HOLD.test(beat.text));
      if (filler.length) warnings.push(`${label}疑似用眨眼/呼吸/重复反应/停顿撑时长：${filler.map(label_).join("、")}。这类内容只能伴随主要动作；真是包袱或情绪落点，在节拍里写明“落点”`);
    }
    const rawDescription = result.detailed_description ?? result.integrated_multimodal_description ?? "";
    const slowWords = (rawDescription.match(/\bslow(?:ly|er)?\b/gi) ?? []).length;
    if (slowWords >= (hasDialogue ? 3 : 2)) {
      warnings.push(`${label}出现 ${slowWords} 处 slow/slowly：H3 会整体放慢动作。只在剧情确实需要慢的地方使用，其余写 at normal speed / quickly 或不写速度`);
    }

    // 场景逐镜落地：每个 [Shot N] 点名场景 Subject 并写基础光；不默认黑场；人物/道具参考不带入棚拍背景。
    const sceneNumbers = segment?.sceneSubjects ?? [];
    const shotChunks = [...rawDescription.matchAll(/^\[Shot (\d+)\]([\s\S]*?)(?=^\[Shot \d+\]|(?![\s\S]))/gm)];
    const noScene = shotChunks.filter(([, , text]) => sceneNumbers.length && !sceneNumbers.some((number) => new RegExp(`<Subject\\s+${number}>`).test(text))).map(([, n]) => `[Shot ${n}]`);
    if (noScene.length) warnings.push(`${label}的 ${noScene.join("、")} 没有点名场景 <Subject ${sceneNumbers.join("/")}>：每次切镜都要重新落地场景（consistency-locks.md 第 3A 节）`);
    const noLight = shotChunks.filter(([, , text]) => !LIGHT_TERMS.test(text)).map(([, n]) => `[Shot ${n}]`);
    if (noLight.length) warnings.push(`${label}的 ${noLight.join("、")} 没有写基础光或光源：近景/特写也要写主光与背景可读性，否则容易切成黑屋`);
    const dark = DARK_PHRASES.exec(rawDescription);
    if (dark) warnings.push(`${label}出现“${dark[0]}”：淡黑、黑场、黑底、剪影只在剧情明确要求时写；烟雾/发光/反应特写不自动改成暗室`);
    if (sceneNumbers.length) {
      const lacking = (result.subject_definitions ?? "").split("\n")
        .map((line) => line.trim())
        .filter((line) => /^<Subject\s+\d+>\s+is\b/.test(line) && line.includes("{{ref:"))
        .filter((line) => !sceneNumbers.includes(Number(/^<Subject\s+(\d+)>/.exec(line)?.[1])) && !/illumination|lighting|background/i.test(line))
        .map((line) => /^<Subject\s+\d+>/.exec(line)[0]);
      if (lacking.length) warnings.push(`${label}的 ${lacking.join("、")} 定义没有声明“参考图只提供外观/材质，成片背景与布光来自场景 Subject”，棚拍底色可能带入成片`);
    }

    shots.push({
      id: `shot_${String(index + 1).padStart(3, "0")}`,
      title: block.title,
      prompt,
      negativePrompt: negative,
      durationSeconds: duration,
      enabled: true,
      latentRelay: relay,
      secondSamplingMode: "off",
      seed: null,
      disabledAssetIds: [],
      note: segment ? buildNote(segment, replacedHere) : "",
    });
  });

  for (const row of replacements) {
    if (row.replacement === row.original) continue;
    if (COMMON_CHARS) {
      const uncommon = [...new Set([...row.replacement].filter((char) => CJK.test(char) && !COMMON_CHARS.has(char)))];
      if (uncommon.length) warnings.push(`发音替换表“${row.original}→${row.replacement}”：替换字 ${uncommon.join("、")} 不在常用字内，换成更常见的同音字`);
    }
    if (!blocks.some((block) => promptDialogues(block.prompt).some((line) => line.includes(row.replacement)))) {
      warnings.push(`发音替换表“${row.original}→${row.replacement}”没有在任何对白里用到：确认提示词是否已替换，或删除这一行`);
    }
  }

  checkStateTimeline(parseStateTimeline(storyText), storyboard, blocks, errors, warnings);

  const missingPaths = assets.filter((asset) => !asset.path).map((asset) => asset.alias);
  const plan = {
    schemaVersion: 5,
    project: {
      id: `td_${createHash("sha256").update(projectName, "utf8").digest("hex").slice(0, 12)}`,
      name: projectName,
      runId: "run_001",
      notes: projectNotes(locks),
    },
    defaults: { fps: 24, baseSeed: BASE_SEED },
    promptPrefix: "",
    promptSuffix: "",
    continuity: { mode: "h3_av_latent", videoContextFrames: 22, audioContextFrames: 24, durationMode: "final_output" },
    pipeline: { phase: "first_pass", firstPassConfirmed: false, secondPassMode: "super_resolution_second_pass", secondPassDenoise: hasRelay ? 0.25 : 0.3 },
    assets: assets.map((asset, index) => ({
      id: `asset_${String(index + 1).padStart(3, "0")}`,
      alias: asset.alias,
      kind: asset.kind,
      path: asset.path,
      enabled: true,
      fixed: false,
      fixedOrder: index + 1,
      shotIds: [],
      includeVideoAudio: asset.includeVideoAudio,
      durationSeconds: asset.durationSeconds,
      audioDurationSeconds: null,
      fingerprint: "",
      group: asset.group,
      note: asset.note,
      genPrompt: genPrompts.get(asset.alias) ?? "",
    })),
    shots,
  };
  const unused = assets.filter((asset) => !shots.some((shot) => shot.prompt.includes(`{{ref:${asset.alias}}}`) || shot.prompt.includes(`{{ref:${asset.alias}.audio}}`)));
  if (unused.length) warnings.push(`以下素材没有任何分镜引用：${unused.map((asset) => asset.alias).join("、")}`);
  if (missingPaths.length) warnings.push(`${missingPaths.length} 个素材路径为空（正常）：生成后在导播台“素材库 → 批量导入 / 按文件名填充”上传，文件名用别名`);
  return { plan, errors, warnings, outputPath: path.join(projectDir, `${safeFileName(projectName)}.director.json`) };
}

const aliasKey = (value) => value.trim().toLocaleLowerCase();
const stableId = (prefix, value) => `${prefix}_${createHash("sha256").update(value, "utf8").digest("hex").slice(0, 12)}`;

function splitOptions(projectDir, options, projectName) {
  const mapping = read(path.join(projectDir, FILES.mapping));
  const configured = (key) => { const value = field(mapping, key); return value && !value.includes("【") ? value : ""; };
  const seriesName = options.seriesName || configured("系列名称") || projectName;
  const libraryFile = options.libraryPath || configured("系列素材库") || `${safeFileName(seriesName)}.assets.json`;
  return { seriesName, libraryPath: path.resolve(projectDir, libraryFile), episodeId: options.episodeId || configured("集号") };
}

function validateLibraryAssets(assets) {
  const aliases = new Set();
  const ids = new Set();
  for (const asset of assets) {
    if (!asset || typeof asset.alias !== "string" || !asset.alias || /[\s{}]/.test(asset.alias) || /\.audio$/i.test(asset.alias) || !EXT[asset.kind]) throw new Error("素材库含无效别名或类型");
    const key = aliasKey(asset.alias);
    if (aliases.has(key)) throw new Error(`素材库别名重复：${asset.alias}`);
    aliases.add(key);
    if (asset.path != null && typeof asset.path !== "string") throw new Error(`素材路径无效：${asset.alias}`);
    if (asset.id) { if (ids.has(asset.id)) throw new Error(`素材库 ID 重复：${asset.id}`); ids.add(asset.id); }
  }
}

/** 合并同一系列的清单，保留已上传的路径、实测时长和其他集的素材。 */
export function mergeSeriesLibrary(previous, assets, seriesName) {
  if (previous && (previous.format !== "theodore-assets" || previous.version !== 1 || !previous.library?.id || !Array.isArray(previous.assets))) throw new Error("已有系列素材库格式无效");
  validateLibraryAssets(assets);
  validateLibraryAssets(previous?.assets ?? []);
  const library = previous ? JSON.parse(JSON.stringify(previous)) : { format: "theodore-assets", version: 1, library: { id: stableId("library", seriesName), name: seriesName }, assets: [] };
  const byAlias = new Map(library.assets.map((asset) => [aliasKey(asset.alias), asset]));
  const ids = new Set(library.assets.map((asset) => asset.id));
  for (const asset of assets) {
    const key = aliasKey(asset.alias);
    const existing = byAlias.get(key);
    if (existing && existing.kind !== asset.kind) throw new Error(`系列素材类型冲突：${asset.alias}`);
    if (existing) {
      const uploaded = existing.path?.trim() ? { path: existing.path, durationSeconds: existing.durationSeconds, audioDurationSeconds: existing.audioDurationSeconds, fingerprint: existing.fingerprint } : {};
      const { id, alias } = existing;
      Object.assign(existing, asset, { id, alias, shotIds: [] }, uploaded);
    } else {
      let id = stableId("asset", `${asset.kind}:${key}`);
      while (ids.has(id)) id += "_new";
      const next = { ...asset, id, fixedOrder: library.assets.length + 1, shotIds: [] };
      library.assets.push(next);
      byAlias.set(key, next);
      ids.add(id);
    }
  }
  return library;
}

/** .episode.json 只含分镜与轻量别名引用，素材文件和生图提示词留在系列清单。 */
export function splitDirectorPlan(plan, library) {
  const episode = JSON.parse(JSON.stringify(plan));
  delete episode.assets;
  episode.format = "theodore-episode";
  episode.version = 1;
  episode.assetLibrary = library.library;
  const canonical = new Map(library.assets.map((asset) => [aliasKey(asset.alias), asset]));
  const idMap = new Map(plan.assets.map((asset) => [asset.id, canonical.get(aliasKey(asset.alias))?.id ?? asset.id]));
  const used = new Set();
  for (const text of [plan.promptPrefix, plan.promptSuffix, ...plan.shots.flatMap((shot) => [shot.prompt, shot.negativePrompt])]) {
    for (const match of (text ?? "").matchAll(/\{\{ref:([^}]+)\}\}/g)) used.add(aliasKey(match[1].replace(/\.audio$/i, "")));
  }
  for (const asset of plan.assets) if (asset.fixed || plan.shots.some((shot) => shot.disabledAssetIds.includes(asset.id))) used.add(aliasKey(asset.alias));
  for (const alias of used) if (!canonical.has(alias)) throw new Error(`系列素材库缺少别名：${alias}`);
  episode.requiredAssets = [...used].map((key) => { const { id, alias, kind } = canonical.get(key); const usage = plan.assets.find((asset) => aliasKey(asset.alias) === key); return { id, alias, kind, enabled: usage?.enabled ?? true, fixed: usage?.fixed ?? false, shotIds: usage?.shotIds ?? [], includeVideoAudio: usage?.includeVideoAudio ?? false }; });
  episode.shots = episode.shots.map((shot) => ({ ...shot, disabledAssetIds: shot.disabledAssetIds.map((id) => idMap.get(id) ?? id) }));
  return episode;
}

export function buildExportDocuments(plan, projectDir, options = {}) {
  const settings = splitOptions(projectDir, options, plan.project.name);
  const previous = fs.existsSync(settings.libraryPath) ? JSON.parse(read(settings.libraryPath)) : null;
  const library = mergeSeriesLibrary(previous, plan.assets, settings.seriesName);
  const complete = JSON.parse(JSON.stringify(plan));
  complete.assetLibrary = library.library;
  if (settings.episodeId) {
    complete.project.runId = settings.episodeId;
    complete.project.id = stableId("td", `${complete.project.name}:${settings.episodeId}`);
  }
  return {
    plan: complete, library, episode: splitDirectorPlan(complete, library),
    planPath: path.join(projectDir, `${safeFileName(plan.project.name)}.director.json`),
    episodePath: path.join(projectDir, `${safeFileName(plan.project.name)}.episode.json`),
    libraryPath: settings.libraryPath,
  };
}

function writeJson(file, value) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === text) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp-${process.pid}`;
  try { fs.writeFileSync(temporary, text, "utf8"); fs.renameSync(temporary, file); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}

function buildAssetOnly(projectDir, options) {
  const mapping = read(path.join(projectDir, FILES.mapping));
  const errors = [];
  const parsed = parseAssets(mapping, errors);
  if (!parsed.length) errors.push("素材映射没有素材条目");
  for (const asset of parsed) if (asset.kind !== "image" && !(asset.durationSeconds >= 2 && asset.durationSeconds <= 15)) errors.push(`素材 ${asset.alias} 的音视频时长须为 2–15 秒`);
  if (errors.length) throw new Error(errors.join("；"));
  const name = /^#\s+《(.+?)》素材映射/m.exec(mapping)?.[1] || path.basename(projectDir);
  const settings = splitOptions(projectDir, options, name);
  const genFile = path.join(projectDir, FILES.genPrompts);
  const prompts = fs.existsSync(genFile) ? parseGenPrompts(read(genFile)) : new Map();
  const bibleFile = path.join(projectDir, FILES.bible);
  const locks = fs.existsSync(bibleFile) ? parseBible(read(bibleFile)) : new Map();
  const style = normalize((locks.get("style") ?? "").replace(/^The target video is /, "").replace(/\.\s*$/, ""));
  for (const asset of parsed) errors.push(...imagePromptErrors(asset, prompts.get(asset.alias), locks, style));
  if (errors.length) throw new Error(errors.join("；"));
  const assets = parsed.map((asset, index) => ({ ...asset, id: stableId("asset", `${asset.kind}:${aliasKey(asset.alias)}`), enabled: true, fixed: false, fixedOrder: index + 1, shotIds: [], audioDurationSeconds: null, fingerprint: "", genPrompt: prompts.get(asset.alias) ?? "" }));
  const previous = fs.existsSync(settings.libraryPath) ? JSON.parse(read(settings.libraryPath)) : null;
  const library = mergeSeriesLibrary(previous, assets, settings.seriesName);
  writeJson(settings.libraryPath, library);
  return settings.libraryPath;
}

function main(argv) {
  const args = argv.slice(2);
  const command = ["export", "validate", "assets", "episode", "plan"].includes(args[0]) ? args.shift() : "all";
  const projectArg = args.shift();
  const projectDir = projectArg ? path.resolve(projectArg) : "";
  const options = {};
  try {
    while (args.length) {
      const flag = args.shift();
      const key = { "--library": "libraryPath", "--series": "seriesName", "--episode": "episodeId" }[flag];
      if (!key || !args[0] || args[0].startsWith("--")) throw new Error(`无效参数：${flag}`);
      options[key] = args.shift();
    }
    if (!projectDir || !fs.existsSync(projectDir)) {
      console.log('用法：node director.mjs [export|validate|assets|episode|plan] "<集文件夹>" [--library "<共用.assets.json>"] [--series "<剧名>"] [--episode EP001]');
      return 2;
    }
    if (command === "assets") { console.log(`已导出共用素材库：${buildAssetOnly(projectDir, options)}`); return 0; }
    const result = buildProject(projectDir);
    if (result.plan && !result.errors.length) {
      const documents = buildExportDocuments(result.plan, projectDir, options);
      result.plan = documents.plan;
      if (command === "validate") {
        if (!fs.existsSync(documents.episodePath)) result.errors.push("缺少分镜 JSON，请重新导出");
        else if (JSON.stringify(JSON.parse(read(documents.episodePath))) !== JSON.stringify(documents.episode)) result.errors.push("分镜 JSON 与 Markdown 不一致，请重新导出");
        if (!fs.existsSync(documents.libraryPath)) result.errors.push("缺少系列素材库，请重新导出");
        else if (JSON.stringify(JSON.parse(read(documents.libraryPath))) !== JSON.stringify(documents.library)) result.errors.push("系列素材库与素材映射不一致，请重新导出");
      } else {
        writeJson(documents.libraryPath, documents.library);
        writeJson(documents.episodePath, documents.episode);
        if (command === "plan") writeJson(documents.planPath, documents.plan);
        console.log(`共用素材库：${documents.libraryPath}\n本集分镜：${documents.episodePath}`);
        if (command === "plan") console.log(`兼容完整计划：${documents.planPath}`);
      }
    } else if (command !== "validate") console.log("存在 ERROR，未写出 JSON。");
    for (const item of result.warnings) console.log(`WARNING: ${item}`);
    for (const item of result.errors) console.log(`ERROR: ${item}`);
    const shots = result.plan?.shots.length ?? 0;
    const total = result.plan?.shots.reduce((sum, shot) => sum + shot.durationSeconds, 0) ?? 0;
    console.log(result.errors.length ? `校验失败：${result.errors.length} 个错误，${result.warnings.length} 个警告。` : `校验通过：${shots} 段，共 ${total} 秒，${result.plan?.assets.length ?? 0} 项素材，${result.warnings.length} 个警告。`);
    return result.errors.length ? 1 : 0;
  } catch (error) { console.log(`ERROR: ${error.message}`); return 1; }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv);
}
