import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { Language } from "./i18n";
import { availableStandaloneProcessingModes, normalizeGeneratedResults, type GeneratedVideoResponse } from "./generated-results";
import { LazyVideoThumbnail } from "./lazy-video-thumbnail";
import { assetFileName, comfyViewUrl } from "./media";
import { postprocessShotEntries } from "./postprocess-selection";
import { chosenTake, firstPassTakes } from "./review";
import type { DirectorPlan, PostprocessMode, QueueProgress, QueueSecondPass } from "./types";

interface Props {
  plan: DirectorPlan;
  language: Language;
  queueSecondPass?: QueueSecondPass;
}

interface ShotState { loading: boolean; response: GeneratedVideoResponse }
interface JobState { state: "queued" | "done" | "error"; message?: string }
interface PreviewTarget { path: string; title: string }

function resultUrl(plan: DirectorPlan, shotId: string, activeIndex: number): string {
  const query = new URLSearchParams({ projectName: plan.project.name, runId: plan.project.runId, shotId, activeIndex: String(activeIndex) });
  return `/theodore-director/v1/generated-video?${query.toString()}`;
}

function stageLabel(stage: string | undefined, processingMode: string | undefined, language: Language): string {
  if (processingMode === "latent_upscale_second_pass") return language === "zh" ? "Latent 放大二采" : "Latent upscale 2nd pass";
  if (processingMode === "super_resolution_second_pass" || stage === "second_pass") return language === "zh" ? "超分二采" : "Super-res 2nd pass";
  if (processingMode === "super_resolution_only" || stage === "upscaled") return language === "zh" ? "只超分" : "Super-res only";
  if (stage === "first_pass") return language === "zh" ? "一采" : "1st pass";
  return language === "zh" ? "旧结果" : "Legacy";
}

function postprocessModeLabel(mode: PostprocessMode, language: Language): string {
  if (mode === "latent_upscale_second_pass") return language === "zh" ? "Latent 放大二采" : "Latent upscale 2nd pass";
  if (mode === "super_resolution_only") return language === "zh" ? "只超分" : "Super-res only";
  return language === "zh" ? "超分二采" : "Super-res 2nd pass";
}

export function StandaloneSecondPassPanel({ plan, language, queueSecondPass }: Props) {
  const entries = useMemo(() => postprocessShotEntries(plan), [plan]);
  const [states, setStates] = useState<Record<string, ShotState>>({});
  const [jobs, setJobs] = useState<Record<string, JobState>>({});
  const [preview, setPreview] = useState<PreviewTarget | null>(null);
  const [revision, setRevision] = useState(0);
  const [selectedModes, setSelectedModes] = useState<Record<string, PostprocessMode>>({});
  const [progress, setProgress] = useState<QueueProgress>({ value: 0, max: 0 });
  const submitting = useRef(false);
  const denoise = plan.pipeline?.secondPassDenoise ?? 0.3;

  useEffect(() => {
    let cancelled = false;
    const initial: Record<string, ShotState> = {};
    entries.forEach((entry) => { initial[entry.key] = { loading: true, response: { found: false, results: [] } }; });
    setStates(initial);
    entries.forEach((entry) => {
      void fetch(resultUrl(plan, entry.shot.id, entry.activeIndex))
        .then(async (response) => {
          const result = await response.json() as GeneratedVideoResponse;
          if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
          if (!cancelled) setStates((current) => ({ ...current, [entry.key]: { loading: false, response: result } }));
        })
        .catch((error) => {
          if (!cancelled) setStates((current) => ({ ...current, [entry.key]: { loading: false, response: { found: false, results: [], error: String(error) } } }));
        });
    });
    return () => { cancelled = true; };
  }, [plan.project.name, plan.project.runId, plan.shots.map((shot) => shot.id).join("|"), revision]);

  const startSecondPass = async (shotId: string, path: string, processingMode: PostprocessMode) => {
    if (!queueSecondPass || submitting.current) return;
    submitting.current = true;
    const jobKey = `${path}:${processingMode}`;
    setJobs((current) => ({ ...current, [jobKey]: { state: "queued" } }));
    try {
      await queueSecondPass({
        plan,
        shotId,
        sourcePath: path,
        requestId: `td2_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`,
        processingMode,
        relayVersion: 1,
        sourceSelections: Object.fromEntries(entries.flatMap((entry) => {
          const take = chosenTake(entry.shot, firstPassTakes(normalizeGeneratedResults(states[entry.key]?.response ?? { found: false })));
          return take ? [[entry.shot.id, take.path]] : [];
        })),
        phase: "second_pass",
        denoise: processingMode === "super_resolution_only" ? undefined : denoise,
        onProgress: setProgress,
      });
      setJobs((current) => ({ ...current, [jobKey]: { state: "done" } }));
      setRevision((current) => current + 1);
    } catch (error) {
      setJobs((current) => ({ ...current, [jobKey]: { state: "error", message: String(error instanceof Error ? error.message : error) } }));
    } finally {
      submitting.current = false;
    }
  };
  const runningJob = Object.values(jobs).some((job) => job.state === "queued");

  return <section class="td-postprocess td-second-pass-panel">
    <div class="td-post-header">
      <div><h2>{language === "zh" ? "单独二采" : "Standalone processing"}</h2><p>{language === "zh" ? "对满意结果执行所选高清处理；二采结果只能继续只超分，不重跑一采或启动 Impact 循环。" : "Process a selected result; second-pass outputs may only continue with Super-res only, without rerunning the first pass or Impact loop."}</p></div>
      <div class="td-post-actions"><button onClick={() => setRevision((current) => current + 1)}>↻ {language === "zh" ? "刷新结果" : "Refresh"}</button></div>
    </div>
    <div class="td-post-warning">{language === "zh" ? `整体二采请到「审片与生成」页执行（使用每段选定的结果，按分镜顺序）。这里用于单独处理某一个结果；重绘强度沿用审片页设置：${denoise.toFixed(2)}。` : `Run the batch second pass from Review & generate. Denoise: ${denoise.toFixed(2)}.`}</div>
    {runningJob && <div class="td-batch-progress"><span>{language === "zh" ? "当前任务进度" : "Current task"}</span><progress max={progress.max || 1} value={progress.value}/><b>{progress.max ? `${Math.round(progress.value / progress.max * 100)}%` : "…"}</b></div>}
    {!queueSecondPass && <div class="td-post-warning">{language === "zh" ? "当前工作流缺少后处理二采支流，请重新载入仓库中的 V7 导播台示例工作流。" : "This workflow does not contain the standalone second-pass branch. Reload the V7 example workflow from the repository."}</div>}
    <div class="td-post-shot-list">
      {entries.map((entry) => {
        const state = states[entry.key];
        const results = normalizeGeneratedResults(state?.response ?? { found: false, results: [] });
        return <article class="td-post-shot" key={entry.key}>
          <header><span><strong>{entry.shot.id}</strong><em>{entry.shot.title}</em></span><span>{entry.shot.durationSeconds}s</span></header>
          {!entry.shot.enabled && <div class="td-post-shot-disabled-note">{language === "zh" ? "镜头已禁用，但仍可对历史一采结果进行后处理。" : "This shot is disabled, but its historical first-pass results remain available."}</div>}
          {state?.loading ? <div class="td-post-shot-empty">{language === "zh" ? "正在查询生成结果…" : "Loading results…"}</div>
            : state?.response.error ? <div class="td-post-shot-empty errors">{language === "zh" ? "查询失败，请重启 ComfyUI 后重试。" : "Query failed. Restart ComfyUI and retry."}</div>
            : !results.length ? <div class="td-post-shot-empty">{language === "zh" ? "没有可用的生成结果" : "No generated result available"}</div>
            : <div class="td-post-result-list">{results.map((item) => {
              const url = comfyViewUrl(item.path, "output");
              const availableModes = availableStandaloneProcessingModes(item);
              // 用户对每条视频分别选择处理方式；阶段变化时自动回退到该结果的第一个合法方式。
              const selectedMode = availableModes.includes(selectedModes[item.path]) ? selectedModes[item.path] : availableModes[0];
              const job = selectedMode ? jobs[`${item.path}:${selectedMode}`] : undefined;
              return <div class="td-second-pass-result" key={item.path}>
                <button class="td-post-result-choice" onClick={() => url && setPreview({ path: item.path, title: `${entry.shot.id} · ${entry.shot.title}` })}>
                  {url ? <LazyVideoThumbnail src={url} alt={assetFileName(item.path)}/> : <div class="td-result-thumb">×</div>}
                  <span><strong>{stageLabel(item.stage, item.processingMode, language)}{(item.stage === "legacy_unknown" || !item.stage) && <em>{language === "zh" ? "兼容" : "Compatible"}</em>}</strong><span title={item.path}>{assetFileName(item.path)}</span><small>{item.bytes ? `${(item.bytes / 1024 / 1024).toFixed(1)} MB` : ""}</small></span>
                </button>
                <div class="td-second-pass-actions">
                  {selectedMode ? <select aria-label={language === "zh" ? "该视频可用的处理方式" : "Available processing modes for this video"} value={selectedMode} disabled={runningJob} onChange={(event) => setSelectedModes((current) => ({ ...current, [item.path]: event.currentTarget.value as PostprocessMode }))}>{availableModes.map((mode) => <option value={mode}>{postprocessModeLabel(mode, language)}</option>)}</select> : <span class="td-second-pass-terminal">{language === "zh" ? "只超分后不可再处理" : "Upscaled: no further processing"}</span>}
                  <button class="primary td-second-pass-run" disabled={!queueSecondPass || !selectedMode || runningJob} onClick={() => selectedMode && void startSecondPass(entry.shot.id, item.path, selectedMode)}>{job?.state === "queued" ? (language === "zh" ? "排队/执行中…" : "Queued/running…") : job?.state === "done" ? (language === "zh" ? "处理完成" : "Completed") : (language === "zh" ? "开始处理" : "Process")}</button>
                </div>
                {job?.state === "error" && <div class="td-second-pass-error">{job.message}</div>}
              </div>;
            })}</div>}
        </article>;
      })}
    </div>
    {preview && comfyViewUrl(preview.path, "output") && <div class="td-post-preview-overlay" role="presentation" onClick={() => setPreview(null)}><section role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><header><strong>{preview.title}</strong><button onClick={() => setPreview(null)}>×</button></header><video src={comfyViewUrl(preview.path, "output") ?? ""} controls autoPlay preload="metadata" playsInline/><p>{assetFileName(preview.path)}</p></section></div>}
  </section>;
}
