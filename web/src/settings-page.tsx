import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { FRAME_RATIOS, frameSize, identifyFrameSize, closestFrameScale, nearestFrameRatio } from "./video-framing";
import { HighlightedTextarea } from "./highlighted-textarea";
import type { Language } from "./i18n";
import { referenceTokenIsGloballyAvailable } from "./reference";
import type { DirectorPlan } from "./types";

interface Props {
  plan: DirectorPlan;
  language: Language;
  busy: boolean;
  builtInControls: boolean;
  mutate: (update: (draft: DirectorPlan) => void) => void;
  onDuration: (value: string) => void;
  children: ComponentChildren;
}

export function SettingsPage({ plan, language, busy, builtInControls, mutate, onDuration, children }: Props) {
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  const [section, setSection] = useState("project");
  const sections = [
    { id: "project", title: L("项目与默认值", "Project & defaults"), description: L("输出目录、新分镜与保存", "Folders, new shots & saving") },
    { id: "generation", title: L("一采画幅与镜头接力", "First-pass framing & shot relay"), description: L("生成尺寸、帧率与前段衔接", "Generation size, FPS & continuity") },
    { id: "prompts", title: L("全局提示词", "Global prompts"), description: L("每个镜头共用的内容", "Shared across shots") },
    { id: "storage", title: L("资源管理", "Storage"), description: L("分镜、素材与运行文件", "Shots, media & generated files") },
  ];
  const size = plan.generation ?? { width: 416, height: 224 };
  const setSize = (width: number, height: number) => mutate((draft) => { draft.generation = { width, height }; });
  const framing = identifyFrameSize(size);
  const suggestedRatio = framing?.ratio ?? nearestFrameRatio(size);
  const scaleValue = framing?.scale ?? closestFrameScale(size, suggestedRatio);
  const restoreInvalidNumber = (event: FocusEvent) => {
    const input = event.target as HTMLInputElement;
    if (input.tagName === "INPUT" && input.type === "number" && !input.checkValidity()) {
      const saved = input.dataset.saved;
      if (saved !== undefined) input.value = saved;
    }
  };
  return <section class="td-config-page">
    <header class="td-config-intro"><div><span class="td-eyebrow">{L("导播台内置功能", "BUILT-IN CONTROLS")}</span><h2>{L("配置保持简单，工作流自由连接", "Simple settings, flexible workflows")}</h2><p>{L("这里只管理项目、画幅和连续性。模型、LoRA 与采样器直接在 ComfyUI 画布调整。", "Manage the project, framing and continuity here. Edit models, LoRAs and samplers on the ComfyUI canvas.")}</p></div><span class="td-chip">{builtInControls ? L("内置控制已连接", "Built-in controls connected") : L("兼容旧工作流", "Legacy workflow")}</span></header>
    <div class="td-config-layout">
      <nav class="td-config-nav" aria-label={L("配置分类", "Settings categories")}>{sections.map((item) => <button key={item.id} class={section === item.id ? "active" : ""} aria-current={section === item.id ? "page" : undefined} onClick={() => setSection(item.id)}><strong>{item.title}</strong><small>{item.description}</small></button>)}</nav>
      <div class="td-config-content" onFocusOut={restoreInvalidNumber}>
        <fieldset class="td-config-card td-form" disabled={busy} hidden={section !== "project"}>
          <legend>{L("项目与默认值", "Project & defaults")}</legend>
          <div class="td-settings-grid">
            <label>{L("项目名", "Project name")}<input value={plan.project.name} onInput={(event) => mutate((draft) => { draft.project.name = event.currentTarget.value; })}/></label>
            <label>Run ID<input value={plan.project.runId} onInput={(event) => mutate((draft) => { draft.project.runId = event.currentTarget.value; })}/></label>
            <label>{L("新分镜默认时长（秒）", "Default shot duration (sec)")}<input type="number" min="0.1" step="0.1" value={plan.defaults.durationSeconds ?? 6} data-saved={plan.defaults.durationSeconds ?? 6} onChange={(event) => { const value = Number(event.currentTarget.value); if (Number.isFinite(value) && value >= 0.1) { mutate((draft) => { draft.defaults.durationSeconds = value; }); onDuration(String(value)); } }}/></label>
            <label>{L("基础种子", "Base seed")}<input type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="1" value={plan.defaults.baseSeed} data-saved={plan.defaults.baseSeed} onChange={(event) => { const value = Number(event.currentTarget.value); if (Number.isSafeInteger(value) && value >= 0) mutate((draft) => { draft.defaults.baseSeed = value; }); }}/></label>
          </div>
          <p class="td-hint">{L("项目名与 Run ID 决定输出目录；修改后会切换目录。保存项目将配置写入当前工作流。", "The project name and Run ID select the output folder. Save the project to store settings in the current workflow.")}</p>
          <label class="td-config-check"><input type="checkbox" checked={plan.uiPreferences?.autoSave ?? false} onChange={(event) => mutate((draft) => { draft.uiPreferences = { ...draft.uiPreferences, autoSave: event.currentTarget.checked }; })}/>{L("编辑后自动保存项目", "Auto-save project edits")}</label>
        </fieldset>
        <fieldset class="td-config-card td-form" disabled={busy || !builtInControls} hidden={section !== "generation"}>
          <legend>{L("一采画幅与镜头接力", "First-pass framing & shot relay")}</legend>
          {!builtInControls && <p class="td-hint">{L("当前为旧版分散控制工作流。导入新版 YuQ 工作流后，画幅与连续性将由此页统一控制。", "Import the new YuQ workflow to control framing and continuity here.")}</p>}
          <p class="td-hint">{L("1.0× 为所选比例的基准尺寸；每次调整 0.1×。实际像素自动对齐到 32 的倍数，比例可能略有偏差。", "1.0× is the base size for the selected ratio; dimensions are rounded to multiples of 32.")}</p>
          <div class="td-settings-grid">
            <label>{L("一采画幅比例", "First-pass aspect ratio")}<select aria-label={L("一采画幅比例", "First-pass aspect ratio")} value={framing?.ratio ?? "custom"} onChange={(event) => { const ratio = event.currentTarget.value; if (ratio !== "custom") { const next = frameSize(ratio, framing?.scale ?? closestFrameScale(size, ratio)); setSize(next.width, next.height); } }}>
              {!framing && <option value="custom">{L("自定义（保留原尺寸）", "Custom (existing size)")}</option>}
              {FRAME_RATIOS.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}
            </select></label>
            <label>{L("一采尺寸倍率", "First-pass size scale")}<input aria-label={L("一采尺寸倍率", "First-pass size scale")} type="number" min="0.3" max="2" step="0.1" value={scaleValue} data-saved={scaleValue} onChange={(event) => { const scale = event.currentTarget.valueAsNumber; if (Number.isFinite(scale) && scale >= 0.3 && scale <= 2 && Math.abs(scale * 10 - Math.round(scale * 10)) < 1e-6) { const next = frameSize(suggestedRatio, scale); setSize(next.width, next.height); } }}/></label>
          </div>
          <p class="td-hint" aria-live="polite">{L(`实际一采尺寸：${size.width} × ${size.height} 像素${framing ? ` · ${framing.scale.toFixed(1)}×` : ` · 保留原尺寸；调整倍率将采用最接近的 ${suggestedRatio} 比例`}`, `Actual first-pass size: ${size.width} × ${size.height} px${framing ? ` · ${framing.scale.toFixed(1)}×` : " · existing custom size; changing scale uses the nearest ratio"}`)}</p>
          <label>{L("二采放大倍率", "Second-pass upscale factor")}<select value={plan.pipeline?.secondPassScale === undefined ? "workflow" : String(plan.pipeline.secondPassScale)} onChange={(event) => mutate((draft) => { if (!draft.pipeline) return; const value = event.currentTarget.value; if (value === "workflow") delete draft.pipeline.secondPassScale; else draft.pipeline.secondPassScale = Number(value); })}>
            <option value="workflow">{L("跟随工作流画布", "Use workflow setting")}</option>
            {[1, 1.2, 1.4, 1.6, 1.8, 2].map((value) => <option key={value} value={String(value)}>{value.toFixed(1)}×</option>)}
          </select></label>
          <p class="td-hint">{L("修改倍率后，请从接力链第一段重新运行二采；实际尺寸会按节点规则对齐。", "After changing the factor, rerun the second-pass chain from the first shot; output dimensions follow the upscaler alignment.")}</p>
          <div class="td-settings-grid">
            <label>{L("输出帧率（FPS）", "Output frame rate (FPS)")}<input aria-label="FPS" type="number" min="1" max="120" step="1" value={plan.defaults.fps} data-saved={plan.defaults.fps} onChange={(event) => { const value = Number(event.currentTarget.value); if (Number.isInteger(value) && value >= 1 && value <= 120) mutate((draft) => { draft.defaults.fps = value; }); }}/></label>
            <label>{L("视频接力帧数", "Video context frames")}<select aria-label={L("视频接力帧数", "Video context frames")} value={plan.continuity.videoContextFrames} onChange={(event) => mutate((draft) => { draft.continuity.videoContextFrames = Number(event.currentTarget.value); })}>{[5, 22, 39, 56].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label>{L("音频接力帧数", "Audio context frames")}<input type="number" min="0" max="240" step="1" value={plan.continuity.audioContextFrames} data-saved={plan.continuity.audioContextFrames} onChange={(event) => { const value = Number(event.currentTarget.value); if (Number.isInteger(value) && value >= 0 && value <= 240) mutate((draft) => { draft.continuity.audioContextFrames = value; }); }}/></label>
          </div>
          <p class="td-hint">{L(`视频接力：借用上一段末尾的 ${plan.continuity.videoContextFrames} 帧画面（按当前 FPS 约 ${(plan.continuity.videoContextFrames / plan.defaults.fps).toFixed(2)} 秒）衔接本段，成片会裁去重复的接力画面。只对开启接力的后续分镜生效，首段不使用。`, `Video relay borrows the previous shot's last ${plan.continuity.videoContextFrames} frames (about ${(plan.continuity.videoContextFrames / plan.defaults.fps).toFixed(2)} sec at the current FPS). Duplicate context frames are trimmed from the result. Only subsequent shots with relay enabled use it.`)}</p>
          <p class="td-hint">{L("音频接力：独立控制上一段尾音的衔接窗口；0 表示跟随画面窗口。音频使用独立的 latent 时间网格，不能直接用此数值除以 FPS 换算。可先保留画面 22、音频 24，再按接缝效果调整。", "Audio relay independently controls the tail-audio context window; 0 follows the video window. Audio uses its own latent time grid, so dividing this value by video FPS does not give its duration. Start with video 22 / audio 24 and adjust after reviewing joins.")}</p>
        </fieldset>
        <fieldset class="td-config-card td-form" disabled={busy} hidden={section !== "prompts"}>
          <legend>{L("全局提示词", "Global prompts")}</legend>
          <p class="td-hint">{L("只填写全片共用的内容；具体动作、对白和素材引用在分镜中编辑。", "Use shared instructions here; edit action, dialogue and references per shot.")}</p>
          <label>{L("全局前缀", "Global prefix")}<HighlightedTextarea value={plan.promptPrefix} isReferenceValid={(alias) => referenceTokenIsGloballyAvailable(plan, alias)} onInput={(event) => mutate((draft) => { draft.promptPrefix = event.currentTarget.value; })}/></label>
          <label>{L("全局后缀", "Global suffix")}<HighlightedTextarea value={plan.promptSuffix} isReferenceValid={(alias) => referenceTokenIsGloballyAvailable(plan, alias)} onInput={(event) => mutate((draft) => { draft.promptSuffix = event.currentTarget.value; })}/></label>
          <details class="td-config-notes"><summary>{L("项目备注（不发送给模型）", "Project notes (not sent to the model)")}</summary><textarea aria-label={L("项目备注", "Project notes")} rows={5} value={plan.project.notes ?? ""} onInput={(event) => mutate((draft) => { draft.project.notes = event.currentTarget.value; })}/></details>
        </fieldset>
        <section class="td-config-card" hidden={section !== "storage"}>{children}</section>
        {busy && <p class="td-hint" role="status">{L("任务执行中，完成后可以修改配置。", "Settings are locked while a job is running.")}</p>}
      </div>
    </div>
  </section>;
}
