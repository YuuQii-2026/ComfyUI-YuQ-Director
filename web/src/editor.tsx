import { render } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { AssetsPanel } from "./assets-panel";
import { BatchAssetImport } from "./batch-asset-import";
import { filledAssetFromDraft } from "./batch-assets";
import { moveCurrentProjectToTrash } from "./clear-project";
import { loadLanguage, saveLanguage, t, type Language } from "./i18n";
import { assertAssetLibrary, assertEpisode, assertPlanShape, assetLibraryFromPlan, episodeFromPlan, exportFileStem, mergeAssetLibrary, mergeImportedEpisode, mergeImportedPlan, normalizePlan } from "./plan-io";
import { PostprocessPanel } from "./postprocess";
import { clearAssetReferences, validatePlan } from "./reference";
import { activeIndexOf, chosenTake, deliverableFor, firstPassTakes, latentWriteSlot, processedResultsFor, randomSeed, relaysFromPrevious, shotSignature, withRelayPredecessors } from "./review";
import { IDLE_RUN, ReviewPanel, type RunState } from "./review-panel";
import { appendShots, randomShotSuffix, resetStoryboard } from "./shot-batch";
import { useAllShotResults } from "./shot-results";
import { formatDuration, ShotsPanel } from "./shots-panel";
import { ImageGenerationPanel } from "./image-generation-panel";
import { generatedAsset, type ImageGenerationController, type ImageGenerationRecord, type PendingImageGeneration } from "./image-generation";
import { imageBatchCandidates } from "./image-generation-batch";
import { cleanupAssetResources, clearStoryboardResources, collectAssetResources } from "./resource-cleanup";
import { SettingsPage } from "./settings-page";
import { secondPassJobs } from "./second-pass-jobs";
import type { AssetKind, DirectorPlan, DirectorShot, QueueFirstPass, QueueSecondPass, ShotReview } from "./types";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
type Tab = "shots" | "assets" | "review" | "postprocess" | "settings";
interface Toast { id: number; message: string; tone: "info" | "error" }

async function uploadAsset(projectName: string, kind: AssetKind, file: File): Promise<string> {
  const body = new FormData();
  body.append("projectName", projectName);
  body.append("kind", kind);
  body.append("file", file);
  const response = await fetch("/theodore-director/v1/assets", { method: "POST", body });
  const result = await response.json() as { path?: string; error?: string };
  if (!response.ok || !result.path) throw new Error(result.error || `HTTP ${response.status}`);
  return result.path;
}

function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function ProjectCleanupSection({ language, projectName, runId, busy, onClearShots, onClearAssets, onProjectCleared }: { language: Language; projectName: string; runId: string; busy: boolean; onClearShots: (deleteResources: boolean) => Promise<void>; onClearAssets: () => void; onProjectCleared: () => void }) {
  const [clearing, setClearing] = useState(false);
  const [deleteShotResources, setDeleteShotResources] = useState(false);
  const ready = Boolean(projectName.trim() && runId.trim());
  const clearProject = async () => {
    const target = `${projectName.trim()} / Run ${runId.trim()}`;
    const message = language === "zh"
      ? `确认清空 ${target}？\n\n该运行目录内的全部视频、latent、尾帧、结果文件和元数据都会移入系统回收站。输入素材及其他 Run 不会被删除。`
      : `Clear ${target}?\n\nAll videos, latent files, tail frames, result files, and metadata in this run will be moved to the system trash. Input assets and other runs will not be deleted.`;
    if (!window.confirm(message)) return;
    setClearing(true);
    try {
      const path = await moveCurrentProjectToTrash(projectName, runId);
      onProjectCleared();
      window.alert(language === "zh" ? `已移入系统回收站：${path}` : `Moved to system trash: ${path}`);
    } catch (error) {
      window.alert(`${language === "zh" ? "清空项目失败" : "Failed to clear project"}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setClearing(false);
    }
  };
  const clearShots = async () => {
    const message = language === "zh"
      ? `确认清空全部分镜及其正向、负向提示词？\n\n操作后会保留一个空白镜头以便继续编辑。${deleteShotResources ? "当前 Run 的生成文件也会删除。" : "磁盘生成文件会保留。"}`
      : `Clear every shot and its positive and negative prompts?\n\nOne blank shot will remain. ${deleteShotResources ? "Generated files for this Run will also be deleted." : "Generated files remain on disk."}`;
    if (!window.confirm(message)) return;
    setClearing(true);
    try { await onClearShots(deleteShotResources); } catch (error) { window.alert(`${language === "zh" ? "清理失败" : "Cleanup failed"}: ${error instanceof Error ? error.message : String(error)}`); } finally { setClearing(false); }
  };
  const clearAssets = () => {
    const message = language === "zh"
      ? "确认清空素材库中的全部引用？\n\n素材条目会从当前工作流中移除，但本地图片、视频和音频文件不会被删除。提示词中的引用文本会保留并显示为不可用。"
      : "Clear every media reference from this workflow?\n\nMedia entries will be removed, but local image, video, and audio files will not be deleted. Reference text in prompts will remain and be shown as unavailable.";
    if (window.confirm(message)) onClearAssets();
  };
  return <section class="td-project-cleanup">
    <h3>{language === "zh" ? "危险操作" : "Danger zone"}</h3>
    <article><div><strong>{language === "zh" ? "清空分镜" : "Clear shots"}</strong><p>{language === "zh" ? "删除全部分镜及其提示词，并保留一个空白镜头。" : "Remove all shots and their prompts, leaving one blank shot."}</p><label class="td-inline-check"><input type="checkbox" checked={deleteShotResources} disabled={clearing || busy} onChange={(event) => setDeleteShotResources(event.currentTarget.checked)}/>{language === "zh" ? "同时删除当前 Run 的生成资源" : "Also delete generated resources for this Run"}</label></div><button class="danger" disabled={clearing || busy} onClick={() => void clearShots()}>{clearing ? (language === "zh" ? "清理中…" : "Cleaning…") : (language === "zh" ? "清空分镜" : "Clear shots")}</button></article>
    <article><div><strong>{language === "zh" ? "清空素材库" : "Clear media library"}</strong><p>{language === "zh" ? "只移除当前工作流中的素材引用；本地图片、视频和音频文件保持不变。" : "Remove media references from this workflow only; local image, video, and audio files remain untouched."}</p></div><button class="danger" onClick={clearAssets}>{language === "zh" ? "清空素材库" : "Clear media"}</button></article>
    <article><div><strong>{language === "zh" ? "清空当前项目的生成文件" : "Clear generated files"}</strong><p>{language === "zh" ? "把当前 Project name + Run ID 的全部生成文件移入系统回收站。输入素材和其他 Run 不受影响。" : "Move every generated file for the current Project name + Run ID to the system trash. Input assets and other runs are unaffected."}</p></div><button class="danger" disabled={!ready || clearing} onClick={() => void clearProject()}>{clearing ? (language === "zh" ? "正在移入回收站…" : "Moving to trash…") : (language === "zh" ? "清空项目" : "Clear project")}</button></article>
  </section>;
}

interface EditorProps { initial: DirectorPlan; onSave: (plan: DirectorPlan) => void; onPersist?: (plan: DirectorPlan) => void; onClose: () => void; supportsSecondSampling: boolean; queueSecondPass?: QueueSecondPass; queueFirstPass?: QueueFirstPass; imageGeneration?: ImageGenerationController; builtInControls?: boolean }

function Editor({ initial, onSave, onPersist, onClose, supportsSecondSampling, queueSecondPass, queueFirstPass, imageGeneration, builtInControls = false }: EditorProps) {
  // 只规范化一次：缺少 project.id 时会生成随机 ID，两次规范化会让窗口一打开就显示“未保存”。
  const [initialPlan] = useState<DirectorPlan>(() => normalizePlan(initial));
  const [plan, setPlan] = useState<DirectorPlan>(initialPlan);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initialPlan));
  // 运行期间的回调需要读取最新计划（用户可能在生成时继续编辑）。
  const planRef = useRef(plan);
  planRef.current = plan;
  const [tab, setTab] = useState<Tab>("shots");
  const [selected, setSelected] = useState(0);
  const [language, setLanguageState] = useState<Language>(loadLanguage);
  const [revision, setRevision] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [run, setRun] = useState<RunState>(IDLE_RUN);
  const [batchOpen, setBatchOpen] = useState(false);
  const [assetBatchOpen, setAssetBatchOpen] = useState(false);
  const [imageAsset, setImageAsset] = useState<DirectorPlan["assets"][number] | null>(null);
  const [imageBatchOpen, setImageBatchOpen] = useState(false);
  const [closePrompt, setClosePrompt] = useState(false);
  const [batchShots, setBatchShots] = useState<DirectorShot[]>([]);
  const [uniformDuration, setUniformDuration] = useState(() => String(initialPlan.defaults.durationSeconds ?? 6));
  const [appendCount, setAppendCount] = useState("1");
  const [appendDuration, setAppendDuration] = useState(() => String(initialPlan.defaults.durationSeconds ?? 6));
  const abortRef = useRef<AbortController | null>(null);
  const toastId = useRef(0);
  const results = useAllShotResults(plan, revision);
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  const planJson = useMemo(() => JSON.stringify(plan), [plan]);
  const dirty = planJson !== savedJson;
  const allBatchEnabled = batchShots.length > 0 && batchShots.every((item) => item.enabled);
  const missingAssets = plan.assets.filter((asset) => asset.enabled && !asset.path.trim()).length;
  const busy = run.kind !== null;

  const setLanguage = (value: Language) => { setLanguageState(value); saveLanguage(value); };
  const notify = (message: string, tone: "info" | "error" = "info") => {
    const id = ++toastId.current;
    setToasts((current) => [...current.slice(-3), { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), tone === "error" ? 7000 : 3200);
  };
  // 修改生成相关内容；审片状态等元数据用 setReview/setPipeline，不影响生成签名。
  const mutate = (fn: (draft: DirectorPlan) => void) => setPlan((current) => {
    const draft = clone(current);
    fn(draft);
    if (current.uiPreferences?.autoSave) queueMicrotask(() => persist(draft));
    return draft;
  });
  const setReview = (shotId: string, patch: Partial<ShotReview>) => mutate((draft) => {
    const shot = draft.shots.find((item) => item.id === shotId);
    if (shot) shot.review = { status: "pending", ...shot.review, ...patch, updatedAt: Date.now() };
  });
  const setPipeline = (patch: Partial<NonNullable<DirectorPlan["pipeline"]>>) => mutate((draft) => {
    draft.pipeline = { phase: "first_pass", firstPassConfirmed: false, secondPassMode: "super_resolution_second_pass", ...draft.pipeline, ...patch };
  });

  const persist = (next: DirectorPlan) => {
    (onPersist ?? onSave)(next);
    setSavedJson(JSON.stringify(next));
  };
  const updateImageAsset = (assetId: string, update: (asset: DirectorPlan["assets"][number]) => void, save = true) => {
    const next = clone(planRef.current);
    const asset = next.assets.find((item) => item.id === assetId);
    if (!asset) return;
    update(asset);
    planRef.current = next;
    setPlan(next);
    if (save) persist(next);
  };
  const savePlan = () => {
    // 保存不要求素材齐全：skill 导入后通常先保存，再逐步上传参考图。
    persist(plan);
    notify(L("已保存到工作流", "Saved to workflow"));
  };
  const requestClose = () => {
    if (busy) { notify(L("任务执行中，请先停止或等待完成再关闭", "A job is running"), "error"); return; }
    if (dirty) setClosePrompt(true); else onClose();
  };

  const downloadJson = (value: unknown, fileName: string) => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url; link.download = fileName; link.click();
    URL.revokeObjectURL(url);
  };
  const exportPlan = () => downloadJson(plan, `${exportFileStem(plan.project.name)}.director.json`);
  const exportEpisode = () => {
    try { downloadJson(episodeFromPlan(plan), `${exportFileStem(plan.project.name)}.episode.json`); }
    catch (error) { notify(String(error), "error"); }
  };
  const exportAssets = () => {
    const doc = assetLibraryFromPlan(plan);
    downloadJson(doc, `${exportFileStem(doc.library.name)}.assets.json`);
  };
  const importPlan = async (file: File, mode: "auto" | "episode" | "assets" = "auto") => {
    if (busy) return;
    try {
      const imported = JSON.parse(await file.text()) as unknown;
      const format = (imported as { format?: string } | null)?.format;
      if (mode === "assets" || format === "theodore-assets") {
        let doc;
        if (format === "theodore-assets") { assertAssetLibrary(imported); doc = imported; }
        else { assertPlanShape(imported); doc = assetLibraryFromPlan(normalizePlan(imported)); }
        const report = mergeAssetLibrary(plan, doc);
        setPlan(report.plan);
        setTab("assets");
        notify(L(`已导入素材库：新增 ${report.added} 项，更新 ${report.updated} 项，沿用 ${report.keptPaths.length} 个已上传文件。分镜保持原样。`, `Library imported: ${report.added} added, ${report.updated} updated, ${report.keptPaths.length} uploaded files kept. Shots preserved.`));
      } else if (mode === "episode" || format === "theodore-episode") {
        let doc;
        if (format === "theodore-episode") { assertEpisode(imported); doc = imported; }
        else { assertPlanShape(imported); doc = episodeFromPlan(normalizePlan(imported)); }
        const report = mergeImportedEpisode(plan, doc);
        setPlan(report.plan);
        setSelected(0);
        setTab("shots");
        notify(L(`已导入 ${report.plan.shots.length} 个分镜，保留素材库 ${report.keptPaths.length} 个已上传文件${report.missingAssets.length ? `；待补素材：${report.missingAssets.join("、")}` : ""}。点“保存”写入工作流。`, `Imported ${report.plan.shots.length} shots; ${report.keptPaths.length} uploaded assets kept${report.missingAssets.length ? `; missing: ${report.missingAssets.join(", ")}` : ""}. Click Save.`));
      } else {
        assertPlanShape(imported);
        const report = mergeImportedPlan(plan, imported);
        setPlan(report.plan);
        setSelected(0);
        setTab("shots");
        notify(L(`已导入 ${report.plan.shots.length} 个镜头，沿用 ${report.keptPaths.length} 个已上传素材。点“保存”写入工作流。`, `Imported ${report.plan.shots.length} shots; kept ${report.keptPaths.length} uploaded assets. Click Save.`));
      }
      setAssetBatchOpen(false);
    } catch (error) {
      notify(`${L("导入失败", "Import failed")}：${error instanceof Error ? error.message : String(error)}`, "error");
    }
  };

  const preflight = (shotIds: string[]): boolean => {
    const errors = validatePlan(planRef.current, shotIds);
    if (!errors.length) return true;
    window.alert(`${L("计划未通过校验，请先修正", "Plan validation failed")}：\n\n${errors.slice(0, 20).join("\n")}${errors.length > 20 ? "\n…" : ""}`);
    return false;
  };

  const commit = (next: DirectorPlan) => {
    planRef.current = next;
    setPlan(next);
    persist(next);
  };

  const runFirstPass = async (requested: string[], reseed: boolean) => {
    if (!queueFirstPass) { notify(L("当前环境无法排队（未连接 ComfyUI）", "Queue unavailable"), "error"); return; }
    if (busy || !requested.length) return;
    const current = planRef.current;
    // 接力段读取的 latent 槽位若不是当前上一段写入的（插删/禁用/调换过镜头），建议连同上一段一起生成。
    const expansion = withRelayPredecessors(current, requested);
    let shotIds = current.shots.filter((shot) => requested.includes(shot.id)).map((shot) => shot.id);
    let reseedIds = new Set(reseed ? shotIds : []);
    if (expansion.added.length) {
      const names = expansion.added.map((id) => current.shots.find((shot) => shot.id === id)?.title ?? id).join("、");
      const include = window.confirm(L(
        `接力段需要的上一段 latent 不是当前顺序下生成的（插入、删除、禁用或调换过镜头后会这样）。\n\n建议连同上一段一起生成：${names}\n\n点“确定”一起生成（推荐，上一段会换种子重生）；点“取消”只生成所选镜头，接缝可能不衔接。`,
        `Relay shots would read a latent not written by their current previous shot. Also regenerate: ${names}?`,
      ));
      if (include) {
        shotIds = expansion.shotIds;
        // 上一段必须真正重新执行才能重写槽位，同种子会命中缓存，所以一并换种子。
        reseedIds = new Set([...reseedIds, ...expansion.added]);
      }
    }
    if (!preflight(shotIds)) return;
    const next = clone(current);
    for (const shotId of reseedIds) {
      const shot = next.shots.find((item) => item.id === shotId);
      // 重生必须换种子，否则 ComfyUI 会命中缓存，不会产生新结果。
      if (shot) shot.seed = randomSeed();
    }
    next.pipeline = { phase: "first_pass", firstPassConfirmed: false, secondPassMode: "super_resolution_second_pass", ...next.pipeline, latentWriters: next.pipeline?.latentWriters ?? {} };
    // 签名与写入槽位按开始时的计划计算：本次提交的就是这份计划。
    const signatures = new Map(shotIds.map((id) => [id, shotSignature(next, next.shots.find((shot) => shot.id === id)!)]));
    const slots = new Map(shotIds.map((id) => [id, latentWriteSlot(next, id)]));
    const relayIds = new Set(shotIds.filter((id) => relaysFromPrevious(next, next.shots.find((shot) => shot.id === id)!)));
    const starts = new Map<string, { at: number; source: string | null; sourceAt: number | null }>();
    commit(next);
    const controller = new AbortController();
    abortRef.current = controller;
    setRun({ kind: "first", total: shotIds.length, done: 0, progress: { value: 0, max: 0 }, message: "" });
    try {
      await queueFirstPass({
        plan: next,
        shotIds,
        signal: controller.signal,
        onProgress: (progress) => setRun((state) => ({ ...state, progress })),
        onShotStart: (shotId, index) => {
          // 记录本段这次实际读取的槽位当时由谁写入（前面的段可能刚在本次运行中写过）。
          const writer = planRef.current.pipeline?.latentWriters?.[String(activeIndexOf(next, shotId))];
          starts.set(shotId, { at: Date.now() / 1000, source: writer?.shotId ?? null, sourceAt: writer?.at ?? null });
          setRun((state) => ({ ...state, currentShotId: shotId, done: index, progress: { value: 0, max: 0 } }));
        },
        onShotDone: (shotId, index) => {
          // 只有真正完成的镜头才更新审片状态与槽位记录；停止或失败的镜头保持原样。
          const done = clone(planRef.current);
          const now = Date.now() / 1000;
          const shot = done.shots.find((item) => item.id === shotId);
          if (shot) {
            const history = shot.review?.relayHistory ?? [];
            const start = starts.get(shotId);
            shot.review = {
              status: "pending",
              generatedSig: signatures.get(shotId),
              updatedAt: Date.now(),
              relayHistory: relayIds.has(shotId) && start ? [...history, start].slice(-20) : history,
            };
          }
          done.pipeline = { phase: "first_pass", firstPassConfirmed: false, secondPassMode: "super_resolution_second_pass", ...done.pipeline, latentWriters: { ...done.pipeline?.latentWriters, [String(slots.get(shotId) ?? 0)]: { shotId, at: now } } };
          commit(done);
          setRun((state) => ({ ...state, done: index + 1 }));
          setRevision((value) => value + 1);
        },
      });
      setRun({ ...IDLE_RUN, message: L(`一采完成：${shotIds.length} 段。请在“审片”页逐段确认。`, `First pass done: ${shotIds.length} shots.`) });
      notify(L(`一采完成 ${shotIds.length} 段`, `First pass done (${shotIds.length})`));
      setTab("review");
    } catch (error) {
      setRun({ ...IDLE_RUN, error: isAbort(error) ? L("已停止", "Stopped") : String(error instanceof Error ? error.message : error) });
    } finally {
      abortRef.current = null;
      setRevision((value) => value + 1);
    }
  };

  const runSecondPass = async (shotIds: string[], skipDone: boolean) => {
    if (!queueSecondPass || busy) return;
    const mode = plan.pipeline?.secondPassMode ?? "super_resolution_second_pass";
    const denoise = plan.pipeline?.secondPassDenoise ?? 0.3;
    let prepared: ReturnType<typeof secondPassJobs>;
    try { prepared = secondPassJobs(plan, shotIds, results.byShot, mode, skipDone); }
    catch (error) { setRun({ ...IDLE_RUN, error: error instanceof Error ? error.message : String(error) }); return; }
    const { jobs, selections } = prepared;
    if (!jobs.length) { notify(L("没有需要二采的镜头（已全部完成或缺少一采结果）", "Nothing to process")); return; }
    const controller = new AbortController();
    abortRef.current = controller;
    const batchId = `td_batch_${Date.now().toString(36)}`;
    setRun({ kind: "second", total: jobs.length, done: 0, progress: { value: 0, max: 0 }, message: "" });
    try {
      for (const [index, { shot, sourcePath, skipIfValid }] of jobs.entries()) {
        setRun((current) => ({ ...current, currentShotId: shot.id, done: index, progress: { value: 0, max: 0 } }));
        await queueSecondPass({
          plan, shotId: shot.id, sourcePath, requestId: `${batchId}_${shot.id}`, processingMode: mode,
          batchId, sequenceIndex: index, latentRelay: Boolean(shot.latentRelay), phase: "second_pass",
          relayVersion: 1, sourceSelections: selections, skipIfValid,
          denoise: mode === "super_resolution_only" ? undefined : denoise,
          signal: controller.signal,
          onProgress: (progress) => setRun((current) => ({ ...current, progress })),
        });
        setRun((current) => ({ ...current, done: index + 1 }));
        setRevision((value) => value + 1);
      }
      setPipeline({ phase: "second_pass", firstPassConfirmed: true });
      setRun({ ...IDLE_RUN, message: L(`二采完成：${jobs.length} 段`, `Second pass done: ${jobs.length}`) });
      notify(L(`二采完成 ${jobs.length} 段`, `Second pass done (${jobs.length})`));
    } catch (error) {
      setRun({ ...IDLE_RUN, error: isAbort(error) ? L("已停止", "Stopped") : String(error instanceof Error ? error.message : error) });
    } finally {
      abortRef.current = null;
      setRevision((value) => value + 1);
    }
  };

  const mergeShots = async (processed: boolean) => {
    if (busy) return;
    const enabled = plan.shots.filter((shot) => shot.enabled);
    const selections: Array<{ shotId: string; activeIndex: number; path: string }> = [];
    const missing: string[] = [];
    for (const shot of enabled) {
      const all = results.byShot[shot.id] ?? [];
      const chosen = processed ? deliverableFor(shot, all) : undefined;
      const take = chosenTake(shot, firstPassTakes(all));
      const path = processed ? (chosen?.processed ? chosen.item.path : "") : take?.path ?? "";
      if (!path) missing.push(shot.title); else selections.push({ shotId: shot.id, activeIndex: activeIndexOf(plan, shot.id), path });
    }
    if (missing.length) { notify(`${L("以下镜头缺少可合并的结果", "Missing results")}：${missing.join("、")}`, "error"); return; }
    setRun({ kind: "merge", total: 1, done: 0, progress: { value: 0, max: 0 }, message: "" });
    try {
      const response = await fetch("/theodore-director/v1/postprocess/merge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectName: plan.project.name, runId: plan.project.runId, selections }) });
      const result = await response.json() as { error?: string; result?: { path?: string } };
      if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
      setRun({ ...IDLE_RUN, message: `${L("已合并", "Merged")}：${result.result?.path ?? ""}` });
      notify(L("合并完成，可在“后处理 → 合并视频”查看", "Merged; see Post-process → Merge"));
    } catch (error) {
      setRun({ ...IDLE_RUN, error: String(error instanceof Error ? error.message : error) });
    }
  };

  const stopRun = () => abortRef.current?.abort();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "s") {
        // 捕获阶段处理并阻止传播，避免同时触发 ComfyUI 自己的“保存工作流”。
        event.preventDefault();
        event.stopPropagation();
        savePlan();
        return;
      }
      if (event.key !== "Escape" || event.defaultPrevented) return;
      // Esc 只关闭最上层弹窗；在输入框中按 Esc 不会关掉整个导播台。
      const target = event.target as HTMLElement | null;
      if (target && /^(TEXTAREA|INPUT|SELECT)$/.test(target.tagName)) { target.blur(); return; }
      if (imageAsset) return;
      if (closePrompt) { setClosePrompt(false); return; }
      // 后处理页的预览/确认浮层点击遮罩即关闭，这里复用同一行为，避免 Esc 直接关掉导播台。
      const overlay = document.querySelector<HTMLElement>("#theodore-director-modal .td-post-preview-overlay");
      if (overlay) { overlay.click(); return; }
      if (batchOpen) { setBatchOpen(false); return; }
      if (assetBatchOpen) return;
      requestClose();
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  });

  const openBatchEditor = () => { setBatchShots(clone(plan.shots)); setBatchOpen(true); };
  const applyUniformDuration = () => {
    const duration = Number(uniformDuration);
    if (!Number.isFinite(duration) || duration <= 0) { window.alert(L("统一时长必须大于 0 秒", "The shared duration must be greater than 0 seconds.")); return; }
    setBatchShots((current) => current.map((item) => ({ ...item, durationSeconds: duration })));
  };
  const appendBatchShots = () => {
    const count = Number(appendCount);
    const duration = Number(appendDuration);
    if (!Number.isInteger(count) || count < 1 || count > 100) { window.alert(L("新增镜头数量必须是 1–100 的整数", "The shot count must be an integer from 1 to 100.")); return; }
    if (!Number.isFinite(duration) || duration <= 0) { window.alert(L("新增镜头时长必须大于 0 秒", "The new-shot duration must be greater than 0 seconds.")); return; }
    setBatchShots((current) => appendShots(current, count, duration, randomShotSuffix, planRef.current.defaults.secondSamplingMode ?? "off").map((item, index) => index >= current.length ? { ...item, latentRelay: false } : item));
  };
  const applyBatchChanges = () => {
    if (batchShots.some((item) => !Number.isFinite(item.durationSeconds) || item.durationSeconds <= 0)) { window.alert(L("每个镜头的时长都必须大于 0 秒", "Every shot duration must be greater than 0 seconds.")); return; }
    mutate((draft) => { draft.shots = clone(batchShots); });
    setSelected((current) => Math.min(current, batchShots.length - 1));
    setBatchOpen(false);
  };

  const enabledShots = plan.shots.filter((shot) => shot.enabled);
  const takenCount = enabledShots.filter((shot) => firstPassTakes(results.byShot[shot.id] ?? []).length).length;
  const approvedCount = enabledShots.filter((shot) => shot.review?.status === "approved").length;
  const totalSeconds = enabledShots.reduce((sum, shot) => sum + shot.durationSeconds, 0);
  const runPercent = run.progress.max ? Math.round(run.progress.value / run.progress.max * 100) : 0;
  const stages: Array<{ id: Tab; number: string; title: string; description: string; badge?: string }> = [
    { id: "assets", number: "01", title: L("素材库", "Media library"), description: L("角色 · 场景 · 声音", "Cast · sets · voices"), badge: missingAssets ? String(missingAssets) : undefined },
    { id: "shots", number: "02", title: L("分镜工作台", "Storyboard"), description: L("写镜头，安排连续性", "Compose each shot") },
    { id: "review", number: "03", title: L("生成与审片", "Generate & review"), description: L("挑选结果，确认成片", "Choose your takes"), badge: `${approvedCount}/${enabledShots.length}` },
    { id: "postprocess", number: "04", title: L("后处理与交付", "Finish & deliver"), description: L("高清处理 · 合并导出", "Enhance · assemble") },
  ];
  const stage = stages.find((item) => item.id === tab) ?? { number: "⚙", title: L("导播台配置", "Director settings"), description: L("项目 · 内置控制 · 全局提示词", "Project · built-in controls · global prompts") };

  return <div class={`td-shell ${plan.uiPreferences?.compactMode ? "td-compact" : ""}`} lang={language === "zh" ? "zh-CN" : "en"}>
    <aside class="td-workspace-rail">
      <div class="td-rail-brand"><span class="td-brand-mark">YQ</span><div><h1>{t(language, "title")}</h1><small>MINIMAX H3 · STUDIO</small></div></div>
      <button class="td-project-home" onClick={() => setTab("settings")} title={plan.project.name}><small>{L("当前项目", "CURRENT PROJECT")}</small><strong>{plan.project.name}</strong><span>{plan.project.runId}</span></button>
      <nav class="td-stage-nav" aria-label={L("制作阶段", "Production stages")}>
        {stages.map((item) => <button key={item.id} class={tab === item.id ? "active" : ""} aria-label={item.title} title={item.title} aria-current={tab === item.id ? "page" : undefined} onClick={() => setTab(item.id)}><span class="td-stage-number">{item.number}</span><span><strong>{item.title}</strong><small>{item.description}</small></span>{item.badge && <em class={item.id === "assets" ? "warn" : ""}>{item.badge}</em>}</button>)}
      </nav>
      <div class="td-rail-progress"><div><span>{L("本集进度", "EPISODE PROGRESS")}</span><strong>{approvedCount}/{enabledShots.length}</strong></div><progress max={Math.max(1, enabledShots.length)} value={approvedCount}/><p>{L(`已生成 ${takenCount} 段 · ${formatDuration(totalSeconds)}`, `${takenCount} generated · ${formatDuration(totalSeconds)}`)}</p><button onClick={() => setTab(missingAssets ? "assets" : "review")}>{missingAssets ? L(`补齐 ${missingAssets} 个素材`, `Fill ${missingAssets} media files`) : L("查看审片进度 →", "Review progress →")}</button></div>
      <button class={`td-config-entry ${tab === "settings" ? "active" : ""}`} aria-label={L("导播台配置", "Director settings")} title={L("导播台配置", "Director settings")} aria-current={tab === "settings" ? "page" : undefined} onClick={() => setTab("settings")}><span>⚙</span><strong>{L("导播台配置", "Director settings")}</strong></button>
    </aside>
    <header class="td-topbar">
      <div class="td-workspace-title"><span class="td-eyebrow">{L("制作空间", "PRODUCTION SPACE")} / {stage.number}</span><div><h2>{stage.title}</h2>
        {dirty ? <span class="td-chip warn">{L("未保存", "Unsaved")}</span> : <span class="td-chip">{L("已保存", "Saved")}</span>}
      </div></div>
      <div class="td-actions">
        <details class="td-project-menu"><summary>{L("导入 / 导出", "Import / export")} <span>⌄</span></summary><div class="td-project-menu-items">
        <label class="td-button" title={L("只更新本集分镜与提示词，保留整个素材库", "Import episode shots and preserve the media library")}>{L("导入分镜", "Import shots")}<input type="file" accept="application/json,.json" disabled={busy} onChange={(event) => { const input = event.currentTarget; const file = input.files?.[0]; input.value = ""; if (file) void importPlan(file, "episode"); }}/></label>
        <button onClick={exportEpisode}>{L("导出分镜", "Export shots")}</button>
        <label class="td-button" title={L("导入 skill 生成的 .director.json；同名素材会沿用已上传文件", "Import a .director.json")}>{L("导入计划", "Import")}<input type="file" accept="application/json,.json" disabled={busy} onChange={(event) => { const input = event.currentTarget; const file = input.files?.[0]; input.value = ""; if (file) void importPlan(file); }}/></label>
        <button onClick={exportPlan}>{L("导出计划", "Export")}</button>
        </div></details>
        <button class="td-lang" title={L("切换语言", "Language")} onClick={() => setLanguage(language === "zh" ? "en" : "zh")}>{language === "zh" ? "EN" : "中文"}</button>
        <button class="primary" title="Ctrl+S" onClick={savePlan}>{L("保存项目", "Save project")}</button>
        <button onClick={requestClose}>{t(language, "close")}</button>
      </div>
    </header>
    <section class="td-session-bar" aria-label={L("生成状态", "Generation status")}>
      <span class="td-session-context">{tab === "shots" ? L("编辑镜头 → 右侧监看 → 底部切换分镜", "Compose → monitor → switch shots below") : stage.description}</span>
      <div class="td-tab-status" aria-live="polite">
        {busy
          ? <span class="td-run-pill"><i/>{run.kind === "first" ? L("一采", "1st pass") : run.kind === "second" ? L("二采", "2nd pass") : run.kind === "image" ? L("生图", "Image") : L("合并", "Merge")} {run.done}/{run.total}{run.kind !== "merge" && run.progress.max ? ` · ${runPercent}%` : ""}<button onClick={stopRun}>{L("停止", "Stop")}</button></span>
          : <span class="td-progress-text">{L(`一采 ${takenCount}/${enabledShots.length} · 通过 ${approvedCount}/${enabledShots.length}`, `Generated ${takenCount}/${enabledShots.length} · Approved ${approvedCount}/${enabledShots.length}`)}</span>}
        {tab !== "settings" && !busy && !results.loading && queueFirstPass && takenCount < enabledShots.length && <button class="primary" onClick={() => void runFirstPass(enabledShots.filter((shot) => !firstPassTakes(results.byShot[shot.id] ?? []).length).map((shot) => shot.id), false)}>{L(`开始一采（${enabledShots.length - takenCount} 段）`, `Start first pass (${enabledShots.length - takenCount})`)}</button>}
      </div>
    </section>
    <main>
      {tab === "shots" && <ShotsPanel plan={plan} language={language} selected={selected} setSelected={setSelected} mutate={mutate} setReview={setReview} results={results} supportsSecondSampling={supportsSecondSampling} running={busy} runningShotId={run.kind === "first" ? run.currentShotId : undefined} onRegenerate={(ids) => void runFirstPass(ids, true)} onOpenBatch={openBatchEditor} notify={notify}/>}
      {tab === "assets" && <AssetsPanel plan={plan} language={language} mutate={mutate} uploadAsset={uploadAsset} importingDisabled={busy || Boolean(imageAsset) || imageBatchOpen} onImportLibrary={(file) => void importPlan(file, "assets")} onExportLibrary={exportAssets} onOpenBatch={() => setAssetBatchOpen(true)} onGenerateImage={imageGeneration ? setImageAsset : undefined} onBatchGenerateImages={imageGeneration ? () => {
        const first = imageBatchCandidates(planRef.current.assets)[0];
        if (!first) { notify(L("请先添加已启用且填写了生图提示词的图片素材。", "Add enabled image assets with generation prompts first."), "error"); return; }
        setImageAsset(first); setImageBatchOpen(true);
      } : undefined} notify={notify}/>}
      {tab === "review" && <ReviewPanel plan={plan} language={language} results={results} run={run} supportsSecondPass={Boolean(queueSecondPass)} setReview={setReview} setPipeline={setPipeline} onRunFirstPass={(ids, reseed) => void runFirstPass(ids, reseed)} onRunSecondPass={(ids, skipDone) => void runSecondPass(ids, skipDone)} onMerge={(processed) => void mergeShots(processed)} onStop={stopRun} onRefresh={() => setRevision((value) => value + 1)} onOpenShot={(shotId) => { setSelected(Math.max(0, plan.shots.findIndex((shot) => shot.id === shotId))); setTab("shots"); }}/>}
      <section hidden={tab !== "settings"}>
        <SettingsPage plan={plan} language={language} busy={busy} builtInControls={builtInControls} mutate={mutate} onDuration={(value) => { setUniformDuration(value); setAppendDuration(value); }}>
        <ProjectCleanupSection language={language} projectName={plan.project.name} runId={plan.project.runId} busy={busy} onClearShots={async (deleteResources) => { if (deleteResources) await clearStoryboardResources(plan.project.name, plan.project.runId); mutate((draft) => { draft.shots = resetStoryboard(draft.defaults.durationSeconds ?? 6, randomShotSuffix, draft.defaults.secondSamplingMode ?? "off"); }); setSelected(0); setBatchShots([]); setRevision((value) => value + 1); }} onClearAssets={() => { mutate((draft) => { const cleared = clearAssetReferences(draft); draft.assets = cleared.assets; draft.shots = cleared.shots; }); }} onProjectCleared={() => setRevision((value) => value + 1)}/>
        </SettingsPage>
      </section>
      {tab === "postprocess" && <PostprocessPanel plan={plan} language={language} queueSecondPass={queueSecondPass}/>}
    </main>

    {batchOpen && <div class="td-batch-overlay" role="presentation"><section class="td-batch-panel" role="dialog" aria-modal="true" aria-label={L("批量编辑镜头", "Batch edit shots")}>
      <header class="td-batch-header"><div><h2>{L("批量编辑镜头", "Batch edit shots")}</h2><p>{L(`当前共 ${batchShots.length} 个镜头`, `${batchShots.length} shots`)}</p></div><button aria-label={L("关闭", "Close")} onClick={() => setBatchOpen(false)}>×</button></header>
      <div class="td-batch-tools">
        <div><label>{L("所有镜头时长", "Duration for all shots")}<span><input type="number" min="0.1" step="0.1" value={uniformDuration} onInput={(event) => setUniformDuration(event.currentTarget.value)}/><em>{L("秒", "sec")}</em></span></label><button onClick={applyUniformDuration}>{L("一键设置所有时长", "Set all durations")}</button></div>
        <div><label>{L("新增镜头数量", "New shot count")}<input type="number" min="1" max="100" step="1" value={appendCount} onInput={(event) => setAppendCount(event.currentTarget.value)}/></label><label>{L("每个镜头时长", "Duration per shot")}<span><input type="number" min="0.1" step="0.1" value={appendDuration} onInput={(event) => setAppendDuration(event.currentTarget.value)}/><em>{L("秒", "sec")}</em></span></label><button onClick={appendBatchShots}>{L("批量新增镜头", "Add shots")}</button></div>
      </div>
      <div class="td-batch-global-actions"><span>{L(`已启用 ${batchShots.filter((item) => item.enabled).length}/${batchShots.length} 个镜头`, `${batchShots.filter((item) => item.enabled).length}/${batchShots.length} shots enabled`)}</span><button class={allBatchEnabled ? "active" : ""} onClick={() => setBatchShots((current) => current.map((item) => ({ ...item, enabled: !allBatchEnabled })))}>{allBatchEnabled ? L("全部禁用", "Disable all") : L("全部启用", "Enable all")}</button></div>
      <div class="td-batch-table"><div class="td-batch-row td-batch-table-head"><span>#</span><span>{L("镜头名", "Shot name")}</span><span>{L("启用", "Enabled")}</span><span>{L("具体时长", "Duration")}</span><span>{L("接力上一段", "Relay")}</span></div>{batchShots.map((item, index) => <div class="td-batch-row" key={item.id}><span>{index + 1}</span><input value={item.title} aria-label={`${L("镜头名", "Shot name")} ${index + 1}`} onInput={(event) => setBatchShots((current) => current.map((shotItem, shotIndex) => shotIndex === index ? { ...shotItem, title: event.currentTarget.value } : shotItem))}/><label class="td-batch-enabled"><input type="checkbox" checked={item.enabled} onChange={(event) => setBatchShots((current) => current.map((shotItem, shotIndex) => shotIndex === index ? { ...shotItem, enabled: event.currentTarget.checked } : shotItem))}/><span>{item.enabled ? L("开", "ON") : L("关", "OFF")}</span></label><label class="td-batch-duration"><input type="number" min="0.1" step="0.1" value={item.durationSeconds} onInput={(event) => setBatchShots((current) => current.map((shotItem, shotIndex) => shotIndex === index ? { ...shotItem, durationSeconds: Number(event.currentTarget.value) } : shotItem))}/><span>{L("秒", "sec")}</span></label><label class="td-batch-relay"><input type="checkbox" checked={item.latentRelay} onChange={(event) => setBatchShots((current) => current.map((shotItem, shotIndex) => shotIndex === index ? { ...shotItem, latentRelay: event.currentTarget.checked } : shotItem))}/><span>{item.latentRelay ? L("开", "ON") : L("关", "OFF")}</span></label></div>)}</div>
      <footer><button onClick={() => setBatchOpen(false)}>{L("取消", "Cancel")}</button><button class="primary" onClick={applyBatchChanges}>{L("应用更改", "Apply changes")}</button></footer>
    </section></div>}
    {assetBatchOpen && <BatchAssetImport language={language} assets={plan.assets} projectName={plan.project.name} uploadFile={uploadAsset} onImported={(items) => mutate((draft) => { draft.assets.push(...items); })} onFilled={(assetId, path, duration) => mutate((draft) => { const target = draft.assets.find((item) => item.id === assetId); if (target) Object.assign(target, filledAssetFromDraft(target, path, duration)); })} onClose={() => setAssetBatchOpen(false)}/>}
    {imageAsset && imageGeneration && <ImageGenerationPanel
      key={imageBatchOpen ? "batch-images" : imageAsset.id}
      asset={plan.assets.find((item) => item.id === imageAsset.id) ?? imageAsset}
      batchAssets={imageBatchOpen ? plan.assets : undefined}
      projectName={plan.project.name} language={language} defaults={imageGeneration.defaults} queue={imageGeneration.queue} recover={imageGeneration.recover}
      running={run.kind === "image"} progress={run.progress} register={imageGeneration.register}
      onPending={(assetId, pending: PendingImageGeneration | null) => updateImageAsset(assetId, (target) => { if (pending) target.imageGenerationPending = pending; else delete target.imageGenerationPending; })}
      onRecord={(assetId, record: ImageGenerationRecord) => updateImageAsset(assetId, (target) => { if (target.imageGeneration && target.imageGeneration.promptId !== record.promptId) target.imageGenerationHistory = [...(target.imageGenerationHistory ?? []), target.imageGeneration].slice(-20); target.imageGeneration = record; })}
      onPromptChange={(assetId, prompt) => updateImageAsset(assetId, (target) => { target.genPrompt = prompt; })}
      onStart={(controller) => { abortRef.current = controller; setRun({ kind: "image", total: 1, done: 0, progress: { value: 0, max: 0 }, message: "" }); }}
      onProgress={(progress) => setRun((state) => ({ ...state, progress }))}
      onFinish={(controller) => { if (abortRef.current === controller) abortRef.current = null; setRun((state) => state.kind === "image" ? { ...IDLE_RUN } : state); }}
      onApply={async (assetId, path, prompt, record) => {
        const previous = planRef.current.assets.find((item) => item.id === assetId);
        updateImageAsset(assetId, (target) => { target.path = path; target.genPrompt = prompt; target.fingerprint = ""; target.imageGeneration = record; delete target.imageGenerationPending; delete target.imageGenerationHistory; });
        const resources = previous ? collectAssetResources(planRef.current, [], { assetId, oldPath: previous.path, oldGeneration: previous.imageGeneration, oldGenerations: previous.imageGenerationHistory }) : { candidates: [], keep: [] };
        try { const result = await cleanupAssetResources(plan.project.name, resources); if (result.deleted.length) notify(L(`已替换素材并清理 ${result.deleted.length} 个旧资源`, `Replaced asset and removed ${result.deleted.length} old resources`)); else notify(L("已将生图绑定到当前素材", "Generated image assigned to the asset")); }
        catch (error) { notify(`${L("新图已绑定，但旧资源清理失败", "New image assigned, but old-resource cleanup failed")}：${error instanceof Error ? error.message : String(error)}`, "error"); }
      }}
      onCreateAsset={(source, path, prompt, _index, record) => { const next = clone(planRef.current); next.assets.push(generatedAsset(source, path, prompt, next.assets, record)); planRef.current = next; setPlan(next); persist(next); notify(L("已登记为新素材", "Generated image added as a new asset")); }}
      onStop={stopRun} onClose={() => { if (run.kind !== "image") { setImageAsset(null); setImageBatchOpen(false); } }}
    />}
    {closePrompt && <div class="td-batch-overlay" role="presentation"><section class="td-confirm" role="dialog" aria-modal="true">
      <h2>{L("有未保存的修改", "Unsaved changes")}</h2>
      <p>{L("关闭前要把修改保存到工作流吗？", "Save changes to the workflow before closing?")}</p>
      <footer><button onClick={() => setClosePrompt(false)}>{L("取消", "Cancel")}</button><button class="danger" onClick={() => { setClosePrompt(false); onClose(); }}>{L("不保存，直接关闭", "Discard")}</button><button class="primary" onClick={() => { persist(plan); setClosePrompt(false); onClose(); }}>{L("保存并关闭", "Save & close")}</button></footer>
    </section></div>}
    <div class="td-toasts" aria-live="polite">{toasts.map((toast) => <div key={toast.id} class={`td-toast ${toast.tone}`}>{toast.message}</div>)}</div>
  </div>;
}

export function openEditor(initial: DirectorPlan, onSave: (plan: DirectorPlan) => void, supportsSecondSampling = false, queueSecondPass?: QueueSecondPass, queueFirstPass?: QueueFirstPass, onPersist?: (plan: DirectorPlan) => void, imageGeneration?: ImageGenerationController, builtInControls = false): void {
  const existing = document.getElementById("theodore-director-modal");
  if (existing) {
    // 防止快速重复点击在画布上叠加多个编辑器实例。
    existing.focus();
    return;
  }
  const host = document.createElement("div");
  host.id = "theodore-director-modal";
  host.className = "td-modal";
  host.tabIndex = -1;
  document.body.append(host);
  const close = () => {
    render(null, host);
    host.remove();
  };
  // ComfyUI 画布会监听全局快捷键；导播台打开时阻止按键冒泡到画布。
  host.addEventListener("keydown", (event) => event.stopPropagation());
  render(<Editor initial={initial} onSave={onSave} onPersist={onPersist} onClose={close} supportsSecondSampling={supportsSecondSampling} queueSecondPass={queueSecondPass} queueFirstPass={queueFirstPass} imageGeneration={imageGeneration} builtInControls={builtInControls}/>, host);
  host.focus();
}
