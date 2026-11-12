import { useState } from "preact/hooks";
import type { GeneratedVideoItem } from "./generated-results";
import type { Language } from "./i18n";
import { LazyVideoPlayer, LazyVideoThumbnail } from "./lazy-video-thumbnail";
import { assetFileName, comfyViewUrl } from "./media";
import { chosenTake, deliverableFor, firstPassTakes, previousEnabledShot, processedResultsFor, relayChain, relayRecordFor, relaySourceIssue, relaysFromPrevious, seamState, shotModifiedSinceGeneration } from "./review";
import type { ShotResultsState } from "./shot-results";
import type { DirectorPlan, DirectorShot, PostprocessMode, QueueProgress, ShotReview } from "./types";

export interface RunState {
  kind: "first" | "second" | "merge" | "image" | null;
  total: number;
  done: number;
  currentShotId?: string;
  progress: QueueProgress;
  message: string;
  error?: string;
}

export const IDLE_RUN: RunState = { kind: null, total: 0, done: 0, progress: { value: 0, max: 0 }, message: "" };

const MODE_LABELS: Record<PostprocessMode, [string, string]> = {
  super_resolution_second_pass: ["超分二采（RTX 1.5× + 低噪重采）", "Super-res 2nd pass"],
  latent_upscale_second_pass: ["Latent 放大二采", "Latent upscale 2nd pass"],
  super_resolution_only: ["只超分（不重采，接缝零变化）", "Super-res only"],
};

interface ReviewPanelProps {
  plan: DirectorPlan;
  language: Language;
  results: ShotResultsState;
  run: RunState;
  supportsSecondPass: boolean;
  setReview: (shotId: string, patch: Partial<ShotReview>) => void;
  setPipeline: (patch: Partial<NonNullable<DirectorPlan["pipeline"]>>) => void;
  onRunFirstPass: (shotIds: string[], reseed: boolean) => void;
  onRunSecondPass: (shotIds: string[], skipDone: boolean) => void;
  onMerge: (processed: boolean) => void;
  onStop: () => void;
  onRefresh: () => void;
  onOpenShot: (shotId: string) => void;
}

type Filter = "all" | "pending" | "approved" | "redo";

export function ReviewPanel({ plan, language, results, run, supportsSecondPass, setReview, setPipeline, onRunFirstPass, onRunSecondPass, onMerge, onStop, onRefresh, onOpenShot }: ReviewPanelProps) {
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  const [filter, setFilter] = useState<Filter>("all");
  const [skipDone, setSkipDone] = useState(true);
  const enabled = plan.shots.filter((shot) => shot.enabled);
  const takesOf = (shot: DirectorShot) => firstPassTakes(results.byShot[shot.id] ?? []);
  const missing = enabled.filter((shot) => !takesOf(shot).length);
  const approved = enabled.filter((shot) => shot.review?.status === "approved" && takesOf(shot).length);
  const redo = enabled.filter((shot) => shot.review?.status === "redo");
  const mode = plan.pipeline?.secondPassMode ?? "super_resolution_second_pass";
  const denoise = plan.pipeline?.secondPassDenoise ?? 0.3;
  const processedCount = enabled.filter((shot) => { const take = chosenTake(shot, takesOf(shot)); return take && processedResultsFor(results.byShot[shot.id] ?? [], take.path).length; }).length;
  const allReady = enabled.length > 0 && enabled.every((shot) => deliverableFor(shot, results.byShot[shot.id] ?? []));
  const allProcessed = enabled.length > 0 && processedCount === enabled.length;
  const busy = run.kind !== null;
  const status = (shot: DirectorShot) => shot.review?.status ?? "pending";
  const visible = plan.shots.filter((shot) => filter === "all" || (shot.enabled && status(shot) === filter));
  const percent = run.progress.max ? Math.round(run.progress.value / run.progress.max * 100) : 0;
  const currentTitle = plan.shots.find((shot) => shot.id === run.currentShotId)?.title;

  const startSecondPass = () => {
    const targets = approved.map((shot) => shot.id);
    if (!targets.length) return;
    const unapproved = enabled.length - approved.length;
    if (unapproved > 0 && !window.confirm(L(`还有 ${unapproved} 段没有通过审片，本次只对已通过的 ${targets.length} 段执行二采。继续？`, `${unapproved} shots are not approved; only ${targets.length} will be processed. Continue?`))) return;
    onRunSecondPass(targets, skipDone);
  };

  return <div class="td-review">
    <section class="td-review-steps">
      <div class={`td-step ${missing.length ? "active" : "done"}`}><b>1</b><div><strong>{L("整体一采", "First pass")}</strong><span>{L(`${enabled.length - missing.length}/${enabled.length} 段已有结果`, `${enabled.length - missing.length}/${enabled.length} generated`)}</span></div></div>
      <div class={`td-step ${!missing.length && approved.length < enabled.length ? "active" : approved.length === enabled.length && enabled.length ? "done" : ""}`}><b>2</b><div><strong>{L("审片 / 单段重生", "Review / re-roll")}</strong><span>{L(`通过 ${approved.length} · 需重生 ${redo.length}`, `${approved.length} approved · ${redo.length} redo`)}</span></div></div>
      <div class={`td-step ${approved.length === enabled.length && enabled.length && processedCount < enabled.length ? "active" : processedCount === enabled.length && enabled.length ? "done" : ""}`}><b>3</b><div><strong>{L("整体二采", "Batch 2nd pass")}</strong><span>{L(`${processedCount}/${enabled.length} 段已二采`, `${processedCount}/${enabled.length} processed`)}</span></div></div>
      <div class={`td-step ${allProcessed ? "active" : ""}`}><b>4</b><div><strong>{L("合并成片", "Merge")}</strong><span>{L("每段使用选定结果", "Uses each chosen take")}</span></div></div>
    </section>

    <section class="td-review-actions">
      <div class="td-action-group">
        <span class="td-action-title">{L("一采", "First pass")}</span>
        <button class="primary" disabled={busy || results.loading || !missing.length} onClick={() => onRunFirstPass(missing.map((shot) => shot.id), false)}>{results.loading ? L("正在读取结果…", "Loading results…") : missing.length ? L(`生成缺失的 ${missing.length} 段`, `Generate ${missing.length} missing`) : L("全部已有一采", "All generated")}</button>
        {redo.length > 0 && <button disabled={busy} onClick={() => onRunFirstPass(redo.map((shot) => shot.id), true)}>↻ {L(`重生标记的 ${redo.length} 段`, `Re-roll ${redo.length} marked`)}</button>}
        <button disabled={busy || !enabled.length} onClick={() => { if (window.confirm(L(`为全部 ${enabled.length} 段换新种子重新一采？旧结果会保留。`, `Re-roll all ${enabled.length} shots with new seeds?`))) onRunFirstPass(enabled.map((shot) => shot.id), true); }}>{L("全部重新一采", "Re-roll all")}</button>
      </div>
      {supportsSecondPass && <div class="td-action-group">
        <span class="td-action-title">{L("二采", "2nd pass")}</span>
        <select value={mode} disabled={busy} onChange={(event) => setPipeline({ secondPassMode: event.currentTarget.value as PostprocessMode })}>{(Object.keys(MODE_LABELS) as PostprocessMode[]).map((item) => <option value={item}>{MODE_LABELS[item][language === "zh" ? 0 : 1]}</option>)}</select>
        {mode !== "super_resolution_only" && <label class="td-denoise" title={L("重绘强度越低，段与段接缝越稳定、人物越不易变；越高细节越多但接缝可能跳变。接力镜头多时建议 0.20–0.25。", "Lower = steadier seams, higher = more detail")}>
          <span>{L("重绘强度", "Denoise")}</span>
          <input type="range" min="0.1" max="0.45" step="0.01" value={denoise} disabled={busy} onInput={(event) => setPipeline({ secondPassDenoise: Number(event.currentTarget.value) })}/>
          <b>{denoise.toFixed(2)}</b>
        </label>}
        <label class="td-inline-check"><input type="checkbox" checked={skipDone} onChange={(event) => setSkipDone(event.currentTarget.checked)}/>{L("跳过已二采的段", "Skip processed")}</label>
        <button class="primary" disabled={busy || !approved.length} onClick={startSecondPass}>{L(`整体二采（已通过 ${approved.length} 段）`, `Batch 2nd pass (${approved.length})`)}</button>
      </div>}
      <div class="td-action-group">
        <button disabled={busy || !allReady} title={L("把每段选定的一采结果拼成整片，审片时检查整体连贯性", "Concatenate chosen first-pass takes for review")} onClick={() => onMerge(false)}>{L("合并一采样片", "Merge 1st-pass cut")}</button>
        <button class="accent" disabled={busy || !allProcessed} title={allProcessed ? "" : L("全部镜头完成二采后才能合并成片（一采与二采分辨率不同，不能混拼）", "All shots need a 2nd pass first")} onClick={() => onMerge(true)}>{L("合并二采成片", "Merge final")}</button>
        <button disabled={busy} onClick={onRefresh}>↻ {L("刷新", "Refresh")}</button>
      </div>
    </section>

    {(busy || run.error || run.message) && <section class={`td-run-bar ${run.error ? "error" : busy ? "running" : "done"}`}>
      <div>
        <strong>{run.error ? L("执行中断", "Stopped") : busy ? (run.kind === "first" ? L("一采进行中", "First pass running") : run.kind === "second" ? L("二采进行中", "Second pass running") : L("合并中", "Merging")) : L("完成", "Done")}</strong>
        <span>{run.error || (busy ? `${run.done}/${run.total}${currentTitle ? ` · ${currentTitle}` : ""}` : run.message)}</span>
      </div>
      {busy && run.kind !== "merge" && <progress max={100} value={percent}/>}
      {busy && run.kind !== "merge" && <b>{percent}%</b>}
      {busy && <button class="danger" onClick={onStop}>{L("停止", "Stop")}</button>}
    </section>}

    <nav class="td-review-filter">
      {(["all", "pending", "approved", "redo"] as Filter[]).map((item) => <button class={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{{ all: L(`全部 ${plan.shots.length}`, `All ${plan.shots.length}`), pending: L(`待审 ${enabled.filter((shot) => status(shot) === "pending").length}`, "Pending"), approved: L(`通过 ${approved.length}`, "Approved"), redo: L(`需重生 ${redo.length}`, "Redo") }[item]}</button>)}
      <span class="td-review-hint">{L("提示：接力段读取的是上一段“最近一次生成”的 latent，重生上一段后请连同后续接力段一起重生。", "Relay shots continue from the previous shot's latest take.")}</span>
    </nav>

    <div class="td-review-grid">
      {visible.map((shot) => <ReviewCard key={shot.id} plan={plan} shot={shot} language={language} results={results} busy={busy} running={run.currentShotId === shot.id} setReview={setReview} onRunFirstPass={onRunFirstPass} onOpenShot={onOpenShot}/>)}
    </div>
  </div>;
}

interface ReviewCardProps {
  plan: DirectorPlan;
  shot: DirectorShot;
  language: Language;
  results: ShotResultsState;
  busy: boolean;
  running: boolean;
  setReview: (shotId: string, patch: Partial<ShotReview>) => void;
  onRunFirstPass: (shotIds: string[], reseed: boolean) => void;
  onOpenShot: (shotId: string) => void;
}

function ReviewCard({ plan, shot, language, results, busy, running, setReview, onRunFirstPass, onOpenShot }: ReviewCardProps) {
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  const [showProcessed, setShowProcessed] = useState(false);
  const all = results.byShot[shot.id] ?? [];
  const takes = firstPassTakes(all);
  const take = chosenTake(shot, takes);
  const processed = take ? processedResultsFor(all, take.path) : [];
  const shown: GeneratedVideoItem | undefined = showProcessed && processed[0] ? processed[0] : take;
  const url = shown ? comfyViewUrl(shown.path, "output") : null;
  const index = plan.shots.findIndex((item) => item.id === shot.id);
  const relay = relaysFromPrevious(plan, shot);
  const previous = relay ? previousEnabledShot(plan, shot.id) : undefined;
  const previousTakes = previous ? firstPassTakes(results.byShot[previous.id] ?? []) : [];
  const seam = previous ? seamState(chosenTake(previous, previousTakes), previousTakes, take, previous.id, relayRecordFor(shot, take)) : "unknown";
  const sourceIssue = relaySourceIssue(plan, shot.id);
  const chain = relayChain(plan, shot.id);
  const status = shot.review?.status ?? "pending";
  const modified = shotModifiedSinceGeneration(plan, shot);

  return <article class={`td-review-card ${status} ${shot.enabled ? "" : "off"} ${running ? "running" : ""}`}>
    <header>
      <button class="td-review-title" title={L("在分镜页打开", "Open in editor")} onClick={() => onOpenShot(shot.id)}><em>{index + 1}</em>{shot.title}</button>
      <span class="td-review-tags">
        <i>{shot.durationSeconds}s</i>
        {relay && <i class="relay" title={L(`接力自「${previous?.title}」`, "Relay")}>⛓ {L("接力", "relay")}</i>}
        {!shot.enabled && <i>{L("禁用", "off")}</i>}
        <i class={status}>{status === "approved" ? L("✓ 通过", "✓ OK") : status === "redo" ? L("↻ 需重生", "↻ redo") : L("待审", "pending")}</i>
      </span>
    </header>
    <div class="td-review-media">
      {running ? <div class="td-result-empty running">{L("正在生成…", "Generating…")}</div> : url ? <LazyVideoPlayer src={url}/> : <div class="td-result-empty">{L("还没有一采结果", "No take yet")}</div>}
      {processed.length > 0 && <div class="td-review-media-switch"><button class={!showProcessed ? "active" : ""} onClick={() => setShowProcessed(false)}>{L("一采", "1st")}</button><button class={showProcessed ? "active" : ""} onClick={() => setShowProcessed(true)}>{L("二采", "2nd")}</button></div>}
    </div>
    {takes.length > 1 && <div class="td-take-strip">{takes.map((item, takeIndex) => { const thumb = comfyViewUrl(item.path, "output"); return <button key={item.path} class={`td-take ${item.path === take?.path ? "selected" : ""}`} title={`${assetFileName(item.path)}${item.modifiedAt ? `\n${new Date(item.modifiedAt * 1000).toLocaleString()}` : ""}`} onClick={() => setReview(shot.id, { take: item.path })}>{thumb ? <LazyVideoThumbnail src={thumb} alt={item.path}/> : null}<span>#{takes.length - takeIndex}{processedResultsFor(all, item.path).length ? " ★" : ""}</span></button>; })}</div>}
    {seam === "mismatch" && <p class="td-review-warning">{L(`接缝不匹配：本段结果生成时接力的是「${previous?.title}」的另一个结果。请把上一段选回对应结果，或重生本段。`, "Seam mismatch with the chosen take of the previous shot.")}</p>}
    {seam === "wrong_source" && <p class="td-review-warning">{L(`接力来源错误：本段结果生成时读取的不是「${previous?.title}」的 latent（镜头顺序或启用状态变过）。请连同上一段一起重生。`, "This take relayed from a different shot; re-roll it together with the previous shot.")}</p>}
    {sourceIssue && seam !== "wrong_source" && <p class="td-review-warning">{L(`下次生成本段时将读到不属于「${previous?.title}」的 latent（镜头顺序或启用状态变过），重生时会建议连同上一段一起生成。`, "The relay slot no longer belongs to the previous shot.")}</p>}
    {modified && <p class="td-review-warning">{L("提示词或素材在生成后被修改过，当前结果不代表最新设置。", "Prompt changed after this take was generated.")}</p>}
    {shot.note && <p class="td-review-note" title={shot.note}>{shot.note}</p>}
    <footer>
      <button class={`ok ${status === "approved" ? "active" : ""}`} disabled={!take} onClick={() => setReview(shot.id, { status: status === "approved" ? "pending" : "approved", take: take?.path })}>✓ {L("通过", "Approve")}</button>
      <button class={`warn ${status === "redo" ? "active" : ""}`} onClick={() => setReview(shot.id, { status: status === "redo" ? "pending" : "redo" })}>✗ {L("需重生", "Redo")}</button>
      <button disabled={busy || !shot.enabled} onClick={() => onRunFirstPass([shot.id], true)}>↻ {L("重生", "Re-roll")}</button>
      {chain.length > 1 && <button disabled={busy || !shot.enabled} title={L(`后面 ${chain.length - 1} 段接力自本段；一起重生才能保证接缝衔接`, "Re-roll with following relay shots")} onClick={() => onRunFirstPass(chain, true)}>↻ {L(`连同后续 ${chain.length - 1} 段`, `+${chain.length - 1} relay`)}</button>}
    </footer>
  </article>;
}
