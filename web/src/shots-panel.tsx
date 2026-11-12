import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { writeClipboardText } from "./clipboard";
import { HighlightedTextarea } from "./highlighted-textarea";
import type { Language } from "./i18n";
import { LazyVideoThumbnail } from "./lazy-video-thumbnail";
import { assetFileName, comfyViewUrl, MediaPreview } from "./media";
import { availableReferenceAssets, previewReferences, referenceTokenIsAvailable } from "./reference";
import { buildCameraMovementSentence, CAMERA_AMPLITUDES, CAMERA_MOVEMENTS, CAMERA_SPEEDS } from "./camera-movement";
import { chosenTake, firstPassTakes, randomSeed, relayChain, relaysFromPrevious, shotModifiedSinceGeneration } from "./review";
import { appendShots, randomShotSuffix } from "./shot-batch";
import type { ShotResultsState } from "./shot-results";
import type { DirectorPlan, SecondSamplingMode, ShotReview } from "./types";

const SECOND_SAMPLING_MODES: SecondSamplingMode[] = ["off", "super_resolution_second_pass", "latent_upscale_second_pass", "super_resolution_only"];
const MODE_LABELS: Record<SecondSamplingMode, [string, string]> = {
  off: ["关闭（推荐）", "Off (recommended)"],
  super_resolution_second_pass: ["超分二采", "Super-res 2nd pass"],
  latent_upscale_second_pass: ["Latent 放大二采", "Latent upscale 2nd pass"],
  super_resolution_only: ["只超分", "Super-res only"],
};

export function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

interface ShotsPanelProps {
  plan: DirectorPlan;
  language: Language;
  selected: number;
  setSelected: (index: number) => void;
  mutate: (fn: (draft: DirectorPlan) => void) => void;
  setReview: (shotId: string, patch: Partial<ShotReview>) => void;
  results: ShotResultsState;
  supportsSecondSampling: boolean;
  running: boolean;
  runningShotId?: string;
  onRegenerate: (shotIds: string[]) => void;
  onOpenBatch: () => void;
  notify: (message: string, tone?: "info" | "error") => void;
}

export function ShotsPanel({ plan, language, selected, setSelected, mutate, setReview, results, supportsSecondSampling, running, runningShotId, onRegenerate, onOpenBatch, notify }: ShotsPanelProps) {
  const timeline = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = timeline.current, card = strip?.querySelector<HTMLElement>(".selected");
    if (!strip || !card) return;
    const a = strip.getBoundingClientRect(), b = card.getBoundingClientRect();
    if (b.left < a.left) strip.scrollLeft -= a.left - b.left;
    else if (b.right > a.right) strip.scrollLeft += b.right - a.right;
  }, [selected]);
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  const [showCompiled, setShowCompiled] = useState(false);
  const [movement, setMovement] = useState<string>(CAMERA_MOVEMENTS[0].value);
  const [movementAmplitude, setMovementAmplitude] = useState("");
  const [movementSpeed, setMovementSpeed] = useState("");
  const [movementTrigger, setMovementTrigger] = useState("");
  const [movementTarget, setMovementTarget] = useState("");
  const [movementPath, setMovementPath] = useState("");
  const [movementEnding, setMovementEnding] = useState("");
  const shot = plan.shots[Math.min(selected, plan.shots.length - 1)];
  const preview = useMemo(() => shot ? previewReferences(plan, shot) : null, [plan, shot]);
  const mentionAssets = useMemo(() => shot ? availableReferenceAssets(plan, shot) : [], [plan, shot]);
  const enabledShots = plan.shots.filter((item) => item.enabled);
  const totalSeconds = enabledShots.reduce((sum, item) => sum + item.durationSeconds, 0);
  const isFirstEnabled = shot ? enabledShots[0]?.id === shot.id : false;
  const takes = shot ? firstPassTakes(results.byShot[shot.id] ?? []) : [];
  const take = shot ? chosenTake(shot, takes) : undefined;
  const takeUrl = take ? comfyViewUrl(take.path, "output") : null;
  const chain = shot ? relayChain(plan, shot.id) : [];
  const staticMove = movement === "remains static";
  const focusMove = movement === "holds position and racks focus";
  const framedMotion = movement.startsWith("shakes") || movement.startsWith("rolls");
  const updateShot = (fn: (draft: DirectorPlan["shots"][number]) => void) => mutate((draft) => { const target = draft.shots[selected]; if (target) fn(target); });

  const moveShot = (from: number, direction: number) => mutate((draft) => {
    const to = from + direction;
    if (to < 0 || to >= draft.shots.length) return;
    [draft.shots[from], draft.shots[to]] = [draft.shots[to], draft.shots[from]];
    setSelected(to);
  });
  const deleteShot = (index: number) => {
    const target = plan.shots[index];
    if (plan.shots.length <= 1 || !target) return;
    if (!window.confirm(L(`删除镜头「${target.title}」？已生成的视频文件不会被删除。`, `Delete "${target.title}"? Generated files are kept.`))) return;
    mutate((draft) => { draft.shots.splice(index, 1); });
    setSelected(Math.max(0, Math.min(selected > index ? selected - 1 : selected, plan.shots.length - 2)));
  };

  return <div class="td-shots">
    <aside class="td-shot-sidebar">
      <div class="td-timeline-heading"><strong>{L("分镜时间线", "SHOT TIMELINE")}</strong><span>{L("按顺序选择镜头 · 接力镜头保持相邻", "Select shots in sequence · keep relay shots together")}</span></div>
      <div class="td-shot-list" ref={timeline}>
        {plan.shots.map((item, index) => {
          const itemTakes = firstPassTakes(results.byShot[item.id] ?? []);
          const relay = relaysFromPrevious(plan, item);
          const status = item.review?.status;
          return <div key={item.id} class={`td-shot-card ${index === selected ? "selected" : ""} ${item.enabled ? "" : "off"} ${relay ? "relay" : ""} ${runningShotId === item.id ? "running" : ""}`} onClick={() => setSelected(index)}>
            {relay && <span class="td-relay-link" title={L("latent 接力：本段从上一段末尾无缝延续", "Latent relay from previous shot")}/>}
            <div class="td-shot-card-main">
              <strong><em>{index + 1}</em>{item.title}</strong>
              <span class="td-shot-card-meta">
                <b>{item.durationSeconds}s</b>
                {relay && <i class="relay">{L("接力", "relay")}</i>}
                {!item.enabled && <i>{L("已禁用", "off")}</i>}
                {itemTakes.length > 0 && <i>{L(`${itemTakes.length} 个结果`, `${itemTakes.length} takes`)}</i>}
                {status === "approved" && <i class="ok">✓ {L("通过", "OK")}</i>}
                {status === "redo" && <i class="warn">↻ {L("需重生", "redo")}</i>}
                {shotModifiedSinceGeneration(plan, item) && <i class="warn">{L("已修改", "edited")}</i>}
                {runningShotId === item.id && <i class="run">{L("生成中", "running")}</i>}
              </span>
            </div>
            <div class="td-shot-card-actions" onClick={(event) => event.stopPropagation()}>
              <button title={L("上移", "Move up")} disabled={index === 0} onClick={() => moveShot(index, -1)}>↑</button>
              <button title={L("下移", "Move down")} disabled={index === plan.shots.length - 1} onClick={() => moveShot(index, 1)}>↓</button>
              <button class="danger" title={L("删除镜头", "Delete")} disabled={plan.shots.length <= 1} onClick={() => deleteShot(index)}>×</button>
            </div>
          </div>;
        })}
      </div>
      <div class="td-shot-sidebar-footer">
        <span class="td-total">{L(`${enabledShots.length} 段启用 · 总时长 ${formatDuration(totalSeconds)}`, `${enabledShots.length} enabled · ${formatDuration(totalSeconds)}`)}</span>
        <div class="td-two-buttons">
          <button onClick={() => mutate((draft) => { const addedIndex = draft.shots.length; draft.shots = appendShots(draft.shots, 1, draft.defaults.durationSeconds ?? 6, randomShotSuffix, draft.defaults.secondSamplingMode ?? "off").map((item, index) => index === addedIndex ? { ...item, latentRelay: false, title: L(`镜头 ${addedIndex + 1}`, `Shot ${addedIndex + 1}`) } : item); setSelected(addedIndex); })}>＋ {L("添加镜头", "Add shot")}</button>
          <button onClick={onOpenBatch}>{L("批量编辑", "Batch edit")}</button>
        </div>
      </div>
    </aside>

    {shot && <section class="td-form td-shot-form">
      <div class="td-composer-heading"><div><small>{L(`镜头 ${String(selected + 1).padStart(2, "0")} / ${plan.shots.length}`, `SHOT ${String(selected + 1).padStart(2, "0")} / ${plan.shots.length}`)}</small><h3>{L("镜头编排", "Shot composer")}</h3></div><div><button disabled={selected === 0} onClick={() => setSelected(selected - 1)} aria-label={L("上一镜头", "Previous shot")}>←</button><button disabled={selected === plan.shots.length - 1} onClick={() => setSelected(selected + 1)} aria-label={L("下一镜头", "Next shot")}>→</button></div></div>
      <div class="td-shot-head">
        <label class="grow">{L("标题", "Title")}<input value={shot.title} onInput={(event) => updateShot((target) => { target.title = event.currentTarget.value; })}/></label>
        <label class="narrow">{L("时长（秒）", "Duration (s)")}<input type="number" min="1" max="15" step="0.5" value={shot.durationSeconds} onInput={(event) => updateShot((target) => { target.durationSeconds = Number(event.currentTarget.value); })}/></label>
        <label class="seed">{L("种子", "Seed")}
          <span class="td-seed-input">
            <input type="number" placeholder={L("自动", "auto")} value={shot.seed ?? ""} onInput={(event) => updateShot((target) => { target.seed = event.currentTarget.value === "" ? null : Number(event.currentTarget.value); })}/>
            <button title={L("随机新种子（重生时会自动换）", "Random seed")} onClick={() => updateShot((target) => { target.seed = randomSeed(); })}>🎲</button>
          </span>
        </label>
      </div>
      {(shot.durationSeconds < 5 || shot.durationSeconds > 15) && <div class="td-inline-warning">{L("H3 单段建议 5–15 秒；超出范围容易出现动作压缩或拖沓。", "H3 segments work best between 5 and 15 seconds.")}</div>}
      <div class="td-shot-switches">
        <label class="td-toggle"><input type="checkbox" checked={shot.enabled} onChange={(event) => updateShot((target) => { target.enabled = event.currentTarget.checked; })}/><span>{L("启用", "Enabled")}</span></label>
        <label class="td-toggle" title={L("只在与上一段是同一个不切镜的连续长镜头时开启。开启后本段开头会钉住上一段末尾约 0.9 秒画面与声音。", "Only for an uninterrupted long take.")}><input type="checkbox" checked={shot.latentRelay} disabled={isFirstEnabled} onChange={(event) => updateShot((target) => { target.latentRelay = event.currentTarget.checked; })}/><span>{isFirstEnabled ? L("接力上一段（首段不可用）", "Relay (n/a for first)") : L("接力上一段（同一长镜头）", "Relay from previous (long take)")}</span></label>
        <details class="td-advanced">
          <summary>{L("高级", "Advanced")}</summary>
          <div class="td-advanced-body">
            <label>{L("镜头 ID", "Shot ID")}<input value={shot.id} onInput={(event) => updateShot((target) => { target.id = event.currentTarget.value; })}/></label>
            {supportsSecondSampling && <label title={L("导播台的“一采”始终关闭高清处理；该选项只在直接点击 ComfyUI 原生 Queue 时生效。", "The director's first pass always disables this.")}>{L("原生 Queue 时的高清处理", "Processing for native Queue")}<select value={shot.secondSamplingMode} onChange={(event) => updateShot((target) => { target.secondSamplingMode = event.currentTarget.value as SecondSamplingMode; })}>{SECOND_SAMPLING_MODES.map((mode) => <option value={mode}>{MODE_LABELS[mode][language === "zh" ? 0 : 1]}</option>)}</select></label>}
          </div>
        </details>
      </div>
      <details class="td-note" open={Boolean(shot.note)}>
        <summary>{L("分镜说明（中文，审片对照用）", "Shot notes")}</summary>
        <textarea rows={4} placeholder={L("画面、站位、动作与对白摘要。只供审片对照，不会发送给模型。", "Not sent to the model.")} value={shot.note ?? ""} onInput={(event) => updateShot((target) => { target.note = event.currentTarget.value; })}/>
      </details>
      <label class="td-prompt-field"><span class="td-field-label">{L("正向提示词", "Prompt")}<small>{L("用 {{ref:别名}} 引用素材，输入 @ 快速选择", "Use {{ref:alias}}; type @ to pick")}</small></span>
        <HighlightedTextarea key={shot.id} rows={18} value={shot.prompt} mentionAssets={mentionAssets} mentionLanguage={language} isReferenceValid={(alias) => referenceTokenIsAvailable(plan, shot, alias)} onInput={(event) => updateShot((target) => { target.prompt = event.currentTarget.value; })}/>
      </label>
      <details class="td-camera-builder">
        <summary>{L("运镜句构造", "Camera move")}</summary>
        <div class="td-camera-builder-fields">
          <label>{L("主运动", "Main move")}<select value={movement} onChange={(event) => setMovement(event.currentTarget.value)}>{CAMERA_MOVEMENTS.map((item) => <option value={item.value}>{item.label[language === "zh" ? 0 : 1]}</option>)}</select></label>
          <label>{L("幅度", "Amplitude")}<select value={movementAmplitude} disabled={staticMove || focusMove || movement === "uses a POV shot"} onChange={(event) => setMovementAmplitude(event.currentTarget.value)}>{CAMERA_AMPLITUDES.map((item) => <option value={item.value}>{item.label[language === "zh" ? 0 : 1]}</option>)}</select></label>
          <label>{L("速度", "Speed")}<select value={movementSpeed} disabled={staticMove || focusMove || movement === "uses a POV shot"} onChange={(event) => setMovementSpeed(event.currentTarget.value)}>{CAMERA_SPEEDS.map((item) => <option value={item.value}>{item.label[language === "zh" ? 0 : 1]}</option>)}</select></label>
          <label>{L("触发动作", "Action trigger")}<input value={movementTrigger} disabled={staticMove || focusMove || movement === "uses a POV shot"} onInput={(event) => setMovementTrigger(event.currentTarget.value)} placeholder={L("可选", "Optional")}/></label>
          <label>{L(focusMove ? "起始焦点" : movement === "uses a POV shot" ? "视点主体" : "运动目标", focusMove ? "Focus from" : movement === "uses a POV shot" ? "POV subject" : "Movement target")}<input value={movementTarget} disabled={staticMove || framedMotion} onInput={(event) => setMovementTarget(event.currentTarget.value)} placeholder={L("可选", "Optional")}/></label>
          <label>{L("经过路径", "Path")}<input value={movementPath} disabled={staticMove || focusMove || framedMotion || movement === "uses a POV shot"} onInput={(event) => setMovementPath(event.currentTarget.value)} placeholder={L("可选", "Optional")}/></label>
          <label>{L(focusMove ? "结束焦点" : "结束构图", focusMove ? "Focus to" : "End framing")}<input value={movementEnding} onInput={(event) => setMovementEnding(event.currentTarget.value)} placeholder={L("可选", "Optional")}/></label>
          <button onClick={() => updateShot((target) => { const sentence = buildCameraMovementSentence(movement, movementTrigger, movementTarget, movementEnding, movementAmplitude, movementSpeed, movementPath); target.prompt = [target.prompt.trimEnd(), sentence].filter(Boolean).join("\n"); })}>{L("追加到提示词", "Append to prompt")}</button>
        </div>
      </details>
      <label><span class="td-field-label">{L("负向提示词", "Negative prompt")}</span><textarea rows={3} value={shot.negativePrompt} onInput={(event) => updateShot((target) => { target.negativePrompt = event.currentTarget.value; })}/></label>
      {plan.assets.length > 0 && <fieldset class="td-shot-media">
        <legend>{L("本镜头可用素材（点名称复制引用，取消勾选=本镜头禁用）", "Shot media")}</legend>
        {plan.assets.map((asset) => {
          const checked = !shot.disabledAssetIds.includes(asset.id);
          const reference = `{{ref:${asset.alias}}}`;
          const used = shot.prompt.includes(reference) || shot.prompt.includes(`{{ref:${asset.alias}.audio}}`);
          return <div class={`td-shot-media-card ${checked ? "" : "disabled"} ${used ? "used" : ""}`} key={asset.id}>
            <div class="td-shot-media-frame"><MediaPreview asset={asset} compact/>
              <label class="td-shot-media-toggle" title={checked ? L("在本镜头禁用", "Disable in this shot") : L("在本镜头启用", "Enable")}><input type="checkbox" checked={checked} onChange={(event) => updateShot((target) => { target.disabledAssetIds = event.currentTarget.checked ? target.disabledAssetIds.filter((id) => id !== asset.id) : [...new Set([...target.disabledAssetIds, asset.id])]; })}/></label>
            </div>
            <button class="td-shot-media-name" title={`${asset.note ?? ""}\n${L("点击复制", "Copy")} ${reference}`} onMouseDown={(event) => event.preventDefault()} onClick={async () => { try { await writeClipboardText(reference); notify(L(`已复制 ${reference}`, `Copied ${reference}`)); } catch (error) { notify(String(error), "error"); } }}>{used && <i>●</i>}{asset.alias}</button>
          </div>;
        })}
      </fieldset>}
    </section>}

    {shot && <aside class="td-preview">
      <section class="td-card">
        <header><strong>{L("H3 预检", "H3 check")}</strong><span class="td-summary-counts">{L("图", "Img")} {preview?.slots.filter((x) => x.kind === "picture").length ?? 0}/9 · {L("视频", "Vid")} {preview?.slots.filter((x) => x.kind === "video").length ?? 0}/3 · {L("音频", "Aud")} {preview?.audioCount ?? 0}/3</span></header>
        <div class="td-card-body">
          {preview?.errors.length ? <ul class="errors">{preview.errors.map((error) => <li>{error}</li>)}</ul> : <p class="ok">✓ {L("本镜头通过预检", "This shot passes")}</p>}
          {preview && preview.slots.length > 0 && <ol class="td-slot-list">{preview.slots.map((slot) => <li><code>{slot.label}</code><span>{slot.alias}</span></li>)}</ol>}
          <button class="td-link-button" onClick={() => setShowCompiled((value) => !value)}>{showCompiled ? L("收起编译结果", "Hide compiled prompt") : L("查看发送给 H3 的最终提示词", "Show compiled prompt")}</button>
          {showCompiled && <pre class="td-compiled">{preview?.compiledPrompt}</pre>}
        </div>
      </section>
      <section class="td-card">
        <header><strong>{L("本段结果", "Takes")}</strong><span class={`td-chip ${takes.length ? "ok" : ""}`}>{results.loading ? L("查询中", "Loading") : L(`${takes.length} 个一采`, `${takes.length} takes`)}</span></header>
        <div class="td-card-body">
          {take && takeUrl ? <video key={take.path} class="td-take-player" src={takeUrl} controls preload="metadata" playsInline/> : <div class="td-result-empty">{L("还没有一采结果", "No first-pass take yet")}</div>}
          {takes.length > 1 && <div class="td-take-strip">{takes.map((item, index) => { const url = comfyViewUrl(item.path, "output"); return <button key={item.path} class={`td-take ${item.path === take?.path ? "selected" : ""}`} title={assetFileName(item.path)} onClick={() => setReview(shot.id, { take: item.path })}>{url ? <LazyVideoThumbnail src={url} alt={item.path}/> : null}<span>#{takes.length - index}</span></button>; })}</div>}
          <div class="td-take-actions">
            <button class="primary" disabled={running || !shot.enabled} onClick={() => onRegenerate([shot.id])}>↻ {takes.length ? L("重生本段", "Re-roll") : L("生成本段", "Generate")}</button>
            {chain.length > 1 && <button disabled={running || !shot.enabled} title={L("后面这些镜头接力自本段，本段换结果后它们的接缝会失配", "Following shots relay from this one")} onClick={() => onRegenerate(chain)}>↻ {L(`连同后续 ${chain.length - 1} 段接力`, `+${chain.length - 1} relay shots`)}</button>}
          </div>
        </div>
      </section>
    </aside>}
  </div>;
}
