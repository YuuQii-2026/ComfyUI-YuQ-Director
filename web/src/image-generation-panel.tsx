import { useEffect, useState } from "preact/hooks";
import type { Language } from "./i18n";
import type { DirectorAsset, QueueProgress } from "./types";
import { combineImagePrompt, effectiveImageSettings, imageFilenamePrefix, randomImageSeed, splitImagePrompt, type GeneratedImage, type ImageGenerationDefaults, type ImageGenerationRecord, type ImageGenerationSettings, type PendingImageGeneration, type QueueImageGeneration } from "./image-generation";
import { resolveImagePreferences, saveImagePreferences, type ImageGenerationPreferences } from "./image-generation-preferences";
import { imageBatchCandidates, runImageGenerationBatch, type ImageBatchOutcome } from "./image-generation-batch";

interface ImageGenerationPanelProps {
  asset: DirectorAsset;
  batchAssets?: DirectorAsset[];
  projectName: string;
  language: Language;
  defaults: () => Promise<ImageGenerationDefaults>;
  queue: QueueImageGeneration;
  running: boolean;
  progress: QueueProgress;
  onPromptChange: (assetId: string, prompt: string) => void;
  onStart: (controller: AbortController) => void;
  onProgress: (progress: QueueProgress) => void;
  onFinish: (controller: AbortController) => void;
  register: (projectName: string, image: GeneratedImage) => Promise<string>;
  recover: (pending: PendingImageGeneration) => Promise<ImageGenerationRecord>;
  onPending: (assetId: string, pending: PendingImageGeneration | null) => void;
  onRecord: (assetId: string, record: ImageGenerationRecord) => void | Promise<void>;
  onApply: (assetId: string, path: string, prompt: string, record: ImageGenerationRecord) => void | Promise<void>;
  onCreateAsset: (source: DirectorAsset, path: string, prompt: string, index: number, record: ImageGenerationRecord) => void;
  onStop: () => void;
  onClose: () => void;
}

const DEFAULTS: ImageGenerationDefaults = { negativePrompt: "blurry ugly bad", width: 1080, height: 720, batchSize: 1, steps: 12, cfg: 1, seed: 0, models: [] };

export function ImageGenerationPanel({ asset, batchAssets, projectName, language, defaults, queue, recover, running, progress, register, onPending, onRecord, onPromptChange, onStart, onProgress, onFinish, onApply, onCreateAsset, onStop, onClose }: ImageGenerationPanelProps) {
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  const [config, setConfig] = useState<ImageGenerationDefaults>(DEFAULTS);
  const [loadingDefaults, setLoadingDefaults] = useState(true);
  const [defaultsError, setDefaultsError] = useState("");
  const initialPrompt = splitImagePrompt(asset.genPrompt ?? "");
  const prior = asset.imageGeneration?.settings;
  const [positivePrompt, setPositivePrompt] = useState(initialPrompt.positive || prior?.positivePrompt || "");
  const [negativePrompt, setNegativePrompt] = useState(initialPrompt.negative || "");
  const [preferences, setPreferences] = useState<ImageGenerationPreferences>(() => resolveImagePreferences());
  const { width, height, steps, cfg, batchSize, seed, randomSeed } = preferences;
  const modelFields = [["unetName", "扩散模型 / UNet"], ["clipName", "文本编码器 / CLIP"], ["vaeName", "VAE"], ["clipType", "CLIP 类型"]] as const;
  const missingModels = modelFields.filter(([key]) => config.modelOptions && (!preferences[key] || !config.modelOptions[key].includes(preferences[key]!)));
  const modelError = missingModels.length ? L(`当前选择不可用：${missingModels.map(([, label]) => label).join("、")}。请选择服务器已安装的模型。`, "Some selected model files or types are unavailable. Choose installed models.") : "";
  const changePreference = <K extends keyof ImageGenerationPreferences>(key: K, value: ImageGenerationPreferences[K]) => {
    saveImagePreferences({ [key]: value });
    setPreferences((current) => ({ ...current, [key]: value }));
  };
  const candidates = imageBatchCandidates(batchAssets ?? []);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => imageBatchCandidates(batchAssets ?? []).filter((item) => !item.path.trim()).map((item) => item.id));
  const [outcomes, setOutcomes] = useState<ImageBatchOutcome[]>([]);
  const [batchCurrent, setBatchCurrent] = useState("");
  const batchMode = Boolean(batchAssets);
  const [results, setResults] = useState<GeneratedImage[]>(asset.imageGeneration?.images ?? []);
  const [record, setRecord] = useState<ImageGenerationRecord | null>(asset.imageGeneration ?? null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");
  const [defaultsRetry, setDefaultsRetry] = useState(0);

  useEffect(() => {
    let active = true;
    void defaults().then((value) => {
      if (!active) return;
      setConfig(value);
      setNegativePrompt((current) => current.trim() ? current : value.negativePrompt);
      // Merge saved values after the async workflow load; it must not undo edits made while loading.
      setPreferences(resolveImagePreferences(value));
      setLoadingDefaults(false);
    }).catch((reason: unknown) => {
      if (!active) return;
      setDefaultsError(reason instanceof Error ? reason.message : String(reason));
      setNegativePrompt((current) => current.trim() ? current : DEFAULTS.negativePrompt);
      setLoadingDefaults(false);
    });
    return () => { active = false; };
  }, [defaults, defaultsRetry]);

  const completePrompt = () => combineImagePrompt(positivePrompt, negativePrompt);
  const generate = async () => {
    setError("");
    let settings: ImageGenerationSettings;
    try {
      const { randomSeed: _randomSeed, ...savedSettings } = preferences;
      settings = effectiveImageSettings({ ...savedSettings, positivePrompt, negativePrompt, width, height, steps, cfg, batchSize, seed: randomSeed ? randomImageSeed() : seed, filenamePrefix: imageFilenamePrefix(projectName, asset.alias) });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
      return;
    }
    onPromptChange(asset.id, completePrompt());
    const controller = new AbortController();
    onStart(controller);
    const createdAt = Date.now();
    try {
      const generated = await queue({ ...settings, signal: controller.signal, onProgress, onQueued: (promptId) => onPending(asset.id, { promptId, createdAt, settings }) });
      setRecord(generated);
      setResults(generated.images);
      await onRecord(asset.id, generated);
      onPending(asset.id, null);
      if (!generated.images.length) setError(L("任务完成，但没有可用图片结果。", "The job finished without image results."));
    } catch (reason) {
      if (!(reason instanceof Error && reason.name === "AbortError")) setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      onFinish(controller);
    }
  };

  const generateBatch = async (retry = false) => {
    if (running) return;
    const failedIds = new Set(outcomes.filter((item) => item.status === "error").map((item) => item.assetId));
    const selected = candidates.filter((item) => selectedIds.includes(item.id) && (!retry || failedIds.has(item.id)));
    if (!selected.length) { setError(L("请先勾选要生成的图片素材。", "Select image assets first.")); return; }
    const replacements = selected.filter((item) => item.path.trim());
    if (replacements.length && !window.confirm(L(`将替换 ${replacements.length} 项已有素材，生成并绑定成功后清理未被其他素材使用的旧资源。继续？`, `Replace ${replacements.length} existing assets and remove their unused old resources after assigning the new images?`))) return;
    const controller = new AbortController();
    setError("");
    if (retry) setOutcomes((current) => current.filter((item) => !selected.some((asset) => asset.id === item.assetId)));
    else setOutcomes([]);
    onStart(controller);
    try {
      await runImageGenerationBatch({ assets: selected, projectName, preferences: { ...preferences }, negativePrompt,
        signal: controller.signal, queue, recover, register, onPending, onRecord, onApply, onProgress,
        onItem: (item, index, total) => { setBatchCurrent(`${index + 1}/${total} · ${item.alias}`); onProgress({ value: 0, max: 0 }); },
        onResult: (result) => setOutcomes((current) => [...current, result]),
      });
    } catch (reason) {
      setError(reason instanceof Error && reason.name === "AbortError"
        ? L("批量生成已停止，完成项已保存，未完成任务可在对应素材中恢复结果。", "Batch stopped. Completed assets are saved; recover pending jobs from their asset panels.")
        : reason instanceof Error ? reason.message : String(reason));
    } finally { onFinish(controller); setBatchCurrent(""); }
  };

  const resume = async () => {
    const pending = asset.imageGenerationPending;
    if (!pending || running) return;
    const controller = new AbortController();
    onStart(controller);
    setError("");
    try {
      const restored = await recover(pending);
      setRecord(restored);
      setResults(restored.images);
      await onRecord(asset.id, restored);
      onPending(asset.id, null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      onFinish(controller);
    }
  };

  const saveResult = async (image: GeneratedImage, mode: "replace" | "new", index: number) => {
    if (saving) return;
    if (mode === "replace" && asset.path && !window.confirm(L(`当前素材“${asset.alias}”已有文件。新图绑定成功后将清理未被其他素材使用的旧资源。继续？`, `Replace “${asset.alias}” and remove its unused old resources after assigning the new image?`))) return;
    setSaving(image.filename);
    setError("");
    try {
      if (!record) throw new Error("生成记录不存在，请重新生成");
      const key = `${image.subfolder}/${image.filename}`;
      let next = record;
      let path = record.registeredPaths?.[key];
      if (!path) {
        path = await register(projectName, image);
        next = { ...record, registeredPaths: { ...record.registeredPaths, [key]: path } };
        setRecord(next);
        await onRecord(asset.id, next);
      }
      const resultPrompt = combineImagePrompt(record.settings.positivePrompt, record.settings.negativePrompt);
      if (mode === "replace") await onApply(asset.id, path, resultPrompt, next);
      else onCreateAsset(asset, path, resultPrompt, index, next);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaving("");
    }
  };

  const percent = progress.max > 0 ? Math.max(0, Math.min(100, Math.round(progress.value / progress.max * 100))) : 0;

  return <div class="td-batch-overlay td-imagegen-overlay" role="presentation">
    <section class="td-imagegen-panel" role="dialog" aria-modal="true" aria-label={L("自动生图", "Generate image")}>
      <header class="td-batch-header"><div><h2>{batchMode ? L("批量生图", "Batch image generation") : L("导播台内自动生图", "Generate inside Director")}</h2><p>{batchMode ? L("逐项使用各自提示词生成并自动绑定首张结果；完成项立即保存。", "Generate each asset with its own prompt and assign its first image; save each completed item immediately.") : L(`目标素材：${asset.alias}`, `Target: ${asset.alias}`)}</p><small>{L("参数修改自动记住，下一个素材、重开窗口和刷新后沿用。", "Settings are remembered across assets, panels and page reloads.")}</small></div><button aria-label={L("关闭", "Close")} disabled={running || Boolean(saving)} onClick={onClose}>×</button></header>
      {batchMode && <section class="td-imagegen-batch-selection"><header><strong>{L(`已选 ${selectedIds.length} / ${candidates.length} 项`, `${selectedIds.length} / ${candidates.length} selected`)}</strong><button disabled={running} onClick={() => setSelectedIds(candidates.filter((item) => !item.path.trim()).map((item) => item.id))}>{L("只选缺图", "Missing only")}</button><button disabled={running} onClick={() => setSelectedIds(candidates.map((item) => item.id))}>{L("全选", "Select all")}</button><button disabled={running} onClick={() => setSelectedIds([])}>{L("全不选", "Clear selection")}</button></header><div class="td-imagegen-batch-list">{candidates.map((item) => <label key={item.id}><input type="checkbox" checked={selectedIds.includes(item.id)} disabled={running} onChange={(event) => setSelectedIds((current) => event.currentTarget.checked ? [...current, item.id] : current.filter((id) => id !== item.id))}/><strong>{item.alias}</strong><span>{item.path.trim() ? L("已有图（将替换）", "Existing image (replace)") : L("缺图", "Missing")}</span><small title={item.genPrompt}>{splitImagePrompt(item.genPrompt ?? "").positive.slice(0, 120)}</small></label>)}</div><small>{L("仅列出已启用且填写了生图提示词的图片素材。每项结果可回到“自动生图”查看或换选。", "Only enabled image assets with prompts are listed. View or choose other results from each asset's Generate image panel.")}</small></section>}
      <div class="td-imagegen-models">
        <header><strong>{L("生图模型", "Image models")}</strong><button disabled={running || loadingDefaults} onClick={() => { setLoadingDefaults(true); setDefaultsError(""); setDefaultsRetry((value) => value + 1); }}>{L("刷新模型列表", "Refresh models")}</button></header>
        {config.modelOptions ? <div class="td-imagegen-model-selects">{modelFields.map(([key, label]) => <label key={key}>{label}<select aria-label={label} value={preferences[key] ?? ""} disabled={running || loadingDefaults} onChange={(event) => changePreference(key, event.currentTarget.value)}>
          {!config.modelOptions![key].includes(preferences[key] ?? "") && <option value={preferences[key] ?? ""}>{preferences[key] ? `${preferences[key]} ${L("（不可用）", "(unavailable)")}` : L("请选择", "Select")}</option>}
          {config.modelOptions![key].map((name) => <option key={name} value={name}>{name}</option>)}
        </select></label>)}</div> : config.models.map((model) => <code key={model}>{model}</code>)}
        <small>{L("选择会自动记住，并用于单张和批量生图。UNet、CLIP、VAE 及类型需与当前工作流架构匹配。当前为文生图，不接收参考图片。", "Selections are remembered for single and batch jobs. Match UNet, CLIP, VAE and encoder type to the workflow architecture. This workflow is text-to-image.")}</small>
      </div>
      {modelError && <div class="td-imagegen-error">{modelError}</div>}
      {defaultsError && <div class="td-imagegen-error">{L("读取内置生图工作流失败", "Could not load bundled image workflow")}: {defaultsError}<button onClick={() => { setLoadingDefaults(true); setDefaultsError(""); setDefaultsRetry((value) => value + 1); }}>{L("重试", "Retry")}</button></div>}
      <div class="td-imagegen-form">
        {!batchMode && <label class="wide">{L("正向提示词", "Positive prompt")}<textarea rows={5} value={positivePrompt} disabled={running} onInput={(event) => setPositivePrompt(event.currentTarget.value)} placeholder={L("描述主体、外观、场景、构图与光线", "Describe subject, appearance, scene, framing and light")}/></label>}
        <label class="wide">{L("负向提示词", "Negative prompt")}<textarea rows={3} value={negativePrompt} disabled={running} onInput={(event) => setNegativePrompt(event.currentTarget.value)}/><small>{L("画面无文字、字幕、水印或标识为固定约束。", "No text, captions, watermarks or logos are enforced.")}</small></label>
        <label>{L("宽度", "Width")}<input type="number" min="256" max="2048" step="8" value={width} disabled={running} onInput={(event) => changePreference("width", event.currentTarget.valueAsNumber)}/></label>
        <label>{L("高度", "Height")}<input type="number" min="256" max="2048" step="8" value={height} disabled={running} onInput={(event) => changePreference("height", event.currentTarget.valueAsNumber)}/></label>
        <label>{L("采样步数", "Steps")}<input type="number" min="1" max="100" step="1" value={steps} disabled={running} onInput={(event) => changePreference("steps", event.currentTarget.valueAsNumber)}/></label>
        <label>CFG<input type="number" min="0" max="30" step="0.1" value={cfg} disabled={running} onInput={(event) => changePreference("cfg", event.currentTarget.valueAsNumber)}/></label>
        <label>{L("每项出图数（1–4）", "Images per asset (1–4)")}<input type="number" min="1" max="4" step="1" value={batchSize} disabled={running} onInput={(event) => changePreference("batchSize", event.currentTarget.valueAsNumber)}/></label>
        <label class="td-imagegen-seed"><span>{L("种子", "Seed")}</span><input type="number" min="0" max={Number.MAX_SAFE_INTEGER} value={seed} disabled={running || randomSeed} onInput={(event) => changePreference("seed", event.currentTarget.valueAsNumber)}/></label>
        <label class="td-imagegen-random"><input type="checkbox" checked={randomSeed} disabled={running} onChange={(event) => changePreference("randomSeed", event.currentTarget.checked)}/>{L("每次随机", "Randomize")}</label>
      </div>
      {running && <div class="td-batch-progress"><span>{batchCurrent || L("生图进行中", "Generating")}</span><progress max="100" value={percent}/><b>{progress.max ? `${percent}%` : L("排队中", "Queued")}</b></div>}
      {batchMode && outcomes.length > 0 && <section class="td-imagegen-batch-outcomes"><header><strong>{L(`完成 ${outcomes.filter((item) => item.status === "success").length} · 失败 ${outcomes.filter((item) => item.status === "error").length}`, `${outcomes.filter((item) => item.status === "success").length} completed · ${outcomes.filter((item) => item.status === "error").length} failed`)}</strong></header><div class="td-imagegen-batch-log" role="log" aria-label={L("批量生图日志", "Batch generation log")} tabIndex={0}>{outcomes.map((item) => <div class={`td-imagegen-log-row ${item.status}`} key={item.assetId}><strong>{item.alias}</strong><span>{item.status === "success" ? L("已生成并绑定", "Generated and assigned") : item.error}</span></div>)}</div>{outcomes.some((item) => item.status === "error") && <button disabled={running || loadingDefaults || Boolean(defaultsError) || Boolean(modelError)} onClick={() => void generateBatch(true)}>{L("重试勾选的失败项", "Retry selected failures")}</button>}</section>}
      {!batchMode && asset.imageGenerationPending && !running && <div class="td-imagegen-pending"><span>{L(`未完成任务：${asset.imageGenerationPending.promptId}`, `Pending task: ${asset.imageGenerationPending.promptId}`)}</span><button onClick={() => void resume()}>{L("恢复结果", "Recover results")}</button></div>}
      {error && <div class="td-imagegen-error">{error}</div>}
      {!batchMode && record && <div class="td-imagegen-record"><span>{L("实际种子", "Seed")}: {record.settings.seed}</span><span>{record.settings.width} × {record.settings.height}</span><span>{record.settings.steps} steps · CFG {record.settings.cfg}</span><span title={record.promptId}>ID {record.promptId}</span></div>}
      {!batchMode && results.length > 0 && <section class="td-imagegen-results"><header><strong>{L(`生成结果（${results.length}）`, `Generated images (${results.length})`)}</strong><span>{L("选一张绑定当前素材，或登记为新素材", "Assign an image to this asset or add it as a new asset")}</span></header><div class="td-imagegen-grid">{results.map((image, index) => <article key={`${image.subfolder}/${image.filename}`}><img src={image.url} alt={`${asset.alias} ${index + 1}`} loading="lazy"/><small title={image.filename}>{image.filename}</small><button class="primary" disabled={running || Boolean(saving)} onClick={() => void saveResult(image, "replace", index)}>{saving === image.filename ? L("正在登记…", "Saving…") : L("设为当前素材", "Use for this asset")}</button><button disabled={running || Boolean(saving)} onClick={() => void saveResult(image, "new", index)}>{saving === image.filename ? L("正在登记…", "Saving…") : L("登记为新素材", "Add as new asset")}</button></article>)}</div></section>}
      <footer><span class="td-imagegen-footer-note">{L("按当前选择加载模型；采样器与调度器沿用工作流，入队前检查实际模型。", "Load selected models; retain workflow sampler and scheduler. Validate selected files before queueing.")}</span>{running && <button class="danger" onClick={onStop}>{L("停止生图", "Stop")}</button>}<button disabled={running || loadingDefaults || Boolean(defaultsError) || Boolean(modelError) || (batchMode && !selectedIds.length)} onClick={() => void (batchMode ? generateBatch() : generate())} class="primary">{running ? L("正在生成…", "Generating…") : batchMode ? L(`开始批量生成（${selectedIds.length}项）`, `Generate selected (${selectedIds.length})`) : L("开始生图", "Generate")}</button></footer>
    </section>
  </div>;
}
