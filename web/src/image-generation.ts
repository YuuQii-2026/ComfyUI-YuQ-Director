import { abortError } from "./comfy-queue";
import type { DirectorAsset, QueueProgress } from "./types";

export interface ImageWorkflowNode {
  id: number | string;
  type: string;
  title?: string;
  mode?: number;
  inputs?: Array<{ name: string; link?: number | string | null }>;
  outputs?: Array<{ type?: string }>;
  widgets_values?: unknown[];
  widgets_values_named?: Record<string, unknown>;
}
export interface ImageWorkflowGraph { nodes: ImageWorkflowNode[]; links: unknown[] }
export interface ImageModelSettings { unetName?: string; clipName?: string; vaeName?: string; clipType?: string }
export type ImageModelOptions = Record<keyof ImageModelSettings, string[]>;
export interface ImageGenerationSettings extends ImageModelSettings {
  workflowSource?: "canvas";
  positivePrompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  steps: number;
  cfg: number;
  batchSize: number;
  seed: number;
  filenamePrefix: string;
}
export interface GeneratedImage { filename: string; subfolder: string; type: "output"; url: string }
export interface ImageGenerationRecord {
  promptId: string;
  createdAt: number;
  settings: ImageGenerationSettings;
  images: GeneratedImage[];
  registeredPaths?: Record<string, string>;
}
export interface PendingImageGeneration { promptId: string; createdAt: number; settings: ImageGenerationSettings }
export interface ImageGenerationDefaults extends Omit<ImageGenerationSettings, "positivePrompt" | "filenamePrefix"> { models: string[]; modelOptions?: ImageModelOptions; canvasWorkflow?: boolean; fixedSteps?: boolean }
export interface QueueImageGenerationRequest extends ImageGenerationSettings {
  signal?: AbortSignal;
  onProgress?: (progress: QueueProgress) => void;
  onQueued?: (promptId: string) => void;
}
export type QueueImageGeneration = (request: QueueImageGenerationRequest) => Promise<ImageGenerationRecord>;
export interface ImageGenerationController {
  defaults: () => Promise<ImageGenerationDefaults>;
  queue: QueueImageGeneration;
  register: (projectName: string, image: GeneratedImage) => Promise<string>;
  recover: (pending: PendingImageGeneration) => Promise<ImageGenerationRecord>;
}
export interface ApiPromptNode { class_type: string; inputs: Record<string, unknown>; _meta?: { title?: string } }
export type ImageApiPrompt = Record<string, ApiPromptNode>;

export function imageSamplingDefaults(prompt: ImageApiPrompt): { steps: number; cfg: number; fixedSteps: boolean } {
  const values = Object.values(prompt);
  const schedule = values.find((node) => node.class_type === "ManualSigmas");
  const sampler = values.find((node) => node.class_type === "KSampler");
  const guider = values.find((node) => node.class_type === "CFGGuider");
  return { steps: schedule ? String(schedule.inputs.sigmas).split(",").filter((part) => part.trim()).length - 1 : Number(sampler?.inputs.steps ?? 12), cfg: Number(guider?.inputs.cfg ?? sampler?.inputs.cfg ?? 1), fixedSteps: Boolean(schedule) };
}

// Explicit widget order for the core nodes used by the supplied workflow. Frontend-only widgets never enter /prompt.
const WIDGETS: Record<string, string[]> = {
  KSampler: ["seed", "control_after_generate", "steps", "cfg", "sampler_name", "scheduler", "denoise"],
  EmptySD3LatentImage: ["width", "height", "batch_size"], CLIPTextEncode: ["text"],
  UNETLoader: ["unet_name", "weight_dtype"], CLIPLoader: ["clip_name", "type", "device"],
  VAELoader: ["vae_name"], SaveImage: ["filename_prefix"], ModelSamplingAuraFlow: ["shift"], VAEDecode: [],
  EmptyLatentImage: ["width", "height", "batch_size"],
  TextEncodeQwenImage21: ["prompt", "negative_prompt", "resolution"],
  QwenImage21Cache: ["device", "dtype"], ManualSigmas: ["sigmas"],
  RandomNoise: ["noise_seed", "control_after_generate"], CFGGuider: ["cfg"],
  KSamplerSelect: ["sampler_name"], SamplerCustomAdvanced: [],
  ComfySwitchNode: ["switch"], PrimitiveStringMultiline: ["value"],
  TextGenerate: ["prompt", "max_length", "sampling_mode", "sampling_mode.temperature", "sampling_mode.top_k", "sampling_mode.top_p", "sampling_mode.min_p", "sampling_mode.repetition_penalty", "sampling_mode.seed", "sampling_mode.presence_penalty", "thinking", "use_default_template", "mtp"],
};
const REQUIRED: Record<string, string[]> = {
  KSampler: ["model", "positive", "negative", "latent_image", "seed", "steps", "cfg", "sampler_name", "scheduler", "denoise"],
  EmptySD3LatentImage: ["width", "height", "batch_size"], CLIPTextEncode: ["text", "clip"],
  UNETLoader: ["unet_name", "weight_dtype"], CLIPLoader: ["clip_name", "type"], VAELoader: ["vae_name"],
  SaveImage: ["images", "filename_prefix"], ModelSamplingAuraFlow: ["model", "shift"], VAEDecode: ["samples", "vae"],
  EmptyLatentImage: ["width", "height", "batch_size"],
  TextEncodeQwenImage21: ["clip", "prompt", "negative_prompt", "resolution"],
  QwenImage21Cache: ["model", "device", "dtype"], ManualSigmas: ["sigmas"],
  RandomNoise: ["noise_seed"], CFGGuider: ["model", "positive", "negative", "cfg"],
  KSamplerSelect: ["sampler_name"], SamplerCustomAdvanced: ["noise", "guider", "sampler", "sigmas", "latent_image"],
  ComfySwitchNode: ["switch"], PrimitiveStringMultiline: ["value"],
  TextGenerate: ["clip", "prompt", "max_length", "sampling_mode"],
};
export const IMAGE_NO_TEXT_POSITIVE = "画面干净，无文字、字幕、标语、水印、Logo 或画面叠字。";
export const IMAGE_NO_TEXT_NEGATIVE = "text, subtitles, captions, watermark, logo, letters, typography, signature";

export function splitImagePrompt(value: string): { positive: string; negative: string } {
  const match = /(?:^|\n)\s*(?:Negative\s+prompt|负向提示词|负面提示词)\s*[:：]\s*/i.exec(value);
  return match ? { positive: value.slice(0, match.index).trim(), negative: value.slice(match.index + match[0].length).trim() } : { positive: value.trim(), negative: "" };
}
export function combineImagePrompt(positive: string, negative: string): string {
  return negative.trim() ? `${positive.trim()}\nNegative prompt: ${negative.trim()}` : positive.trim();
}
export function missingImageAssets(assets: DirectorAsset[]): DirectorAsset[] {
  return assets.filter((asset) => asset.enabled && asset.kind === "image" && !asset.path.trim() && splitImagePrompt(asset.genPrompt ?? "").positive);
}

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)); }
function nodeValues(node: ImageWorkflowNode): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  (WIDGETS[node.type] ?? []).forEach((key, i) => {
    const value = node.widgets_values_named?.[key] ?? node.widgets_values?.[i];
    if (value !== undefined) result[key] = value;
  });
  return result;
}
function oneNode(graph: ImageWorkflowGraph, type: string): ImageWorkflowNode {
  const nodes = graph.nodes.filter((node) => node.type === type);
  if (nodes.length !== 1) throw new Error(`生图工作流需要一个 ${type} 节点，当前为 ${nodes.length} 个`);
  return nodes[0];
}
function encoder(graph: ImageWorkflowGraph, kind: "positive" | "negative"): ImageWorkflowNode {
  const qwen = graph.nodes.find((node) => node.type === "TextEncodeQwenImage21");
  if (qwen) return qwen;
  const sampler = oneNode(graph, "KSampler");
  const input = sampler.inputs?.find((item) => item.name === kind);
  const link = graph.links.find((raw) => Array.isArray(raw) && raw[0] === input?.link) as unknown[] | undefined;
  const node = link && graph.nodes.find((item) => String(item.id) === String(link[1]));
  if (!node || node.type !== "CLIPTextEncode") throw new Error(`生图工作流的 ${kind} 未直连 CLIPTextEncode`);
  return node;
}

function imageClip(graph: ImageWorkflowGraph): ImageWorkflowNode {
  const clipLink = encoder(graph, "positive").inputs?.find((input) => input.name === "clip")?.link;
  const link = graph.links.find((raw) => Array.isArray(raw) && raw[0] === clipLink) as unknown[] | undefined;
  const clip = graph.nodes.find((node) => String(node.id) === String(link?.[1]));
  if (!clip || clip.type !== "CLIPLoader") throw new Error("生图文本编码器未连接 CLIPLoader");
  return clip;
}

// ComfyUI's mode 4 is the graph's bypass mode.  The supplied image workflow
// keeps ModelSamplingAuraFlow bypassed, so serialize it as a direct link to
// its upstream model instead of rejecting an otherwise usable workflow.
const BYPASS_MODE = 4;

/** Convert only the provided core-node workflow; reject unsupported nodes rather than guessing their serialization. */
export function uiWorkflowToApiPrompt(graph: ImageWorkflowGraph): ImageApiPrompt {
  if (!Array.isArray(graph?.nodes) || !Array.isArray(graph.links)) throw new Error("生图工作流需要 nodes 与 links");
  const nodes = new Map(graph.nodes.map((node) => [String(node.id), node]));
  if (nodes.size !== graph.nodes.length) throw new Error("生图工作流节点 ID 重复");
  const links = new Map<string, unknown[]>();
  for (const raw of graph.links) {
    if (!Array.isArray(raw) || raw.length < 6 || !nodes.has(String(raw[1])) || !nodes.has(String(raw[3])) || !Number.isInteger(raw[2]) || raw[2] < 0) throw new Error("生图工作流存在无效连线");
    if (links.has(String(raw[0]))) throw new Error("生图工作流连线 ID 重复");
    links.set(String(raw[0]), raw);
  }
  const output: ImageApiPrompt = {};
  const visiting = new Set<string>();
  const sourceRef = (node: ImageWorkflowNode, outputSlot: number): [string, number] => {
    const id = String(node.id);
    // A literal switch can be folded before submission. Disabled prompt enhancement
    // then has no dependency on the optional text-generation model.
    if (node.type === "ComfySwitchNode" && !node.inputs?.find((input) => input.name === "switch")?.link && typeof nodeValues(node).switch === "boolean") {
      if (visiting.has(id)) throw new Error("生图工作流连线形成循环");
      const selected = node.inputs?.find((input) => input.name === (nodeValues(node).switch ? "on_true" : "on_false"));
      const link = links.get(String(selected?.link));
      const upstream = link && nodes.get(String(link[1]));
      if (!upstream) throw new Error("提示词增强开关缺少所选输入");
      visiting.add(id);
      try { return sourceRef(upstream, Number(link![2])); }
      finally { visiting.delete(id); }
    }
    if (node.mode === BYPASS_MODE) {
      if (outputSlot !== 0) throw new Error(`旁路节点 ${id} 不支持输出端口 ${outputSlot}`);
      const linkedInputs = (node.inputs ?? []).filter((input) => input.link != null);
      if (linkedInputs.length !== 1) throw new Error(`旁路节点 ${id} 需要恰好一个输入连线`);
      const bypassLink = links.get(String(linkedInputs[0].link));
      const upstream = bypassLink && nodes.get(String(bypassLink[1]));
      const inputIndex = (node.inputs ?? []).indexOf(linkedInputs[0]);
      if (!bypassLink || !upstream || String(bypassLink[3]) !== id || bypassLink[4] !== inputIndex || !upstream.outputs?.[Number(bypassLink[2])]) {
        throw new Error(`旁路节点 ${id} 的输入连线无效`);
      }
      if (visiting.has(id)) throw new Error("生图工作流连线形成循环");
      visiting.add(id);
      try { return sourceRef(upstream, Number(bypassLink[2])); }
      finally { visiting.delete(id); }
    }
    visit(node);
    return [id, outputSlot];
  };
  const visit = (node: ImageWorkflowNode) => {
    const id = String(node.id);
    if (visiting.has(id)) throw new Error("生图工作流连线形成循环");
    if (output[id]) return;
    if (!(node.type in WIDGETS)) throw new Error(`生图工作流包含未支持的节点：${node.type}`);
    if (node.mode === BYPASS_MODE) return;
    if (node.mode && node.mode !== 0) throw new Error(`生图节点 ${id} 已静音或旁路`);
    visiting.add(id);
    const inputs = nodeValues(node);
    delete inputs.control_after_generate;
    for (const [slot, input] of (node.inputs ?? []).entries()) {
      if (input.link == null) continue;
      const link = links.get(String(input.link));
      const source = link && nodes.get(String(link[1]));
      if (!link || !source || String(link[3]) !== id || link[4] !== slot || !source.outputs?.[Number(link[2])]) throw new Error(`生图节点 ${id}.${input.name} 的连线无效`);
      inputs[input.name] = sourceRef(source, Number(link[2]));
    }
    for (const name of REQUIRED[node.type]) if (inputs[name] == null) throw new Error(`生图节点 ${id} 缺少输入 ${name}`);
    output[id] = { class_type: node.type, inputs, _meta: { title: node.title ?? node.type } };
    visiting.delete(id);
  };
  visit(oneNode(graph, "SaveImage"));
  // The positive and negative branches are resolved from links, independent of titles and prompt contents.
  encoder(graph, "positive"); encoder(graph, "negative");
  return output;
}

function integer(value: number, label: string, min: number, max: number, multiple = 1): void {
  if (!Number.isSafeInteger(value) || value < min || value > max || value % multiple) throw new Error(`${label} 必须为 ${min}–${max} 的整数${multiple > 1 ? `，且为 ${multiple} 的倍数` : ""}`);
}
export function validateImageGenerationSettings(settings: ImageGenerationSettings): void {
  if (!settings.positivePrompt.trim()) throw new Error("请填写生图提示词");
  integer(settings.width, "宽度", 256, 2048, 8); integer(settings.height, "高度", 256, 2048, 8);
  integer(settings.steps, "步数", 1, 100); integer(settings.batchSize, "生成数量", 1, 4);
  integer(settings.seed, "种子", 0, Number.MAX_SAFE_INTEGER);
  if (!Number.isFinite(settings.cfg) || settings.cfg < 0 || settings.cfg > 30) throw new Error("CFG 范围为 0–30");
  if (!settings.filenamePrefix.startsWith("TheodoreDirector/ImageGen/") || /[\\:*?"<>|\u0000-\u001f]/.test(settings.filenamePrefix) || settings.filenamePrefix.split("/").some((part) => !part || part === "." || part === "..")) throw new Error("生图保存路径无效");
}
export function effectiveImageSettings(settings: ImageGenerationSettings): ImageGenerationSettings {
  validateImageGenerationSettings(settings);
  return { ...settings,
    positivePrompt: settings.positivePrompt.includes(IMAGE_NO_TEXT_POSITIVE) ? settings.positivePrompt.trim() : `${settings.positivePrompt.trim()}\n${IMAGE_NO_TEXT_POSITIVE}`,
    negativePrompt: settings.negativePrompt.includes(IMAGE_NO_TEXT_NEGATIVE) ? settings.negativePrompt.trim() : [settings.negativePrompt.trim(), IMAGE_NO_TEXT_NEGATIVE].filter(Boolean).join(", "),
  };
}
export function imageWorkflowDefaults(graph: ImageWorkflowGraph): ImageGenerationDefaults {
  const qwen = graph.nodes.some((node) => node.type === "TextEncodeQwenImage21");
  const sampler = qwen ? { seed: nodeValues(oneNode(graph, "RandomNoise")).noise_seed, cfg: nodeValues(oneNode(graph, "CFGGuider")).cfg, steps: String(nodeValues(oneNode(graph, "ManualSigmas")).sigmas).split(",").length - 1 } : nodeValues(oneNode(graph, "KSampler"));
  const latent = nodeValues(oneNode(graph, qwen ? "EmptyLatentImage" : "EmptySD3LatentImage"));
  const models = graph.nodes.flatMap((node) => [nodeValues(node).unet_name, nodeValues(node).clip_name, nodeValues(node).vae_name].filter((value): value is string => typeof value === "string"));
  return { negativePrompt: String(nodeValues(encoder(graph, "negative"))[qwen ? "negative_prompt" : "text"] ?? ""),
    width: Number(latent.width), height: Number(latent.height), batchSize: Number(latent.batch_size),
    steps: Number(sampler.steps), cfg: Number(sampler.cfg), seed: Number(sampler.seed), models, fixedSteps: qwen,
    unetName: String(nodeValues(oneNode(graph, "UNETLoader")).unet_name),
    clipName: String(nodeValues(imageClip(graph)).clip_name),
    clipType: String(nodeValues(imageClip(graph)).type),
    vaeName: String(nodeValues(oneNode(graph, "VAELoader")).vae_name) };
}

/** Get the filenames supported by each loader from the connected ComfyUI, including subfolders. */
export async function fetchImageModelOptions(fetcher: typeof fetch = fetch, signal?: AbortSignal): Promise<ImageModelOptions> {
  const fields = [["unetName", "UNETLoader", "unet_name"], ["clipName", "CLIPLoader", "clip_name"], ["vaeName", "VAELoader", "vae_name"], ["clipType", "CLIPLoader", "type"]] as const;
  const types = [...new Set(fields.map(([, type]) => type))];
  const results = await Promise.all(types.map(async (type) => {
    const response = await fetcher(`/object_info/${type}`, { signal });
    if (!response.ok) throw new Error(`读取生图模型列表失败：${type} HTTP ${response.status}`);
    return await response.json() as Record<string, { input?: { required?: Record<string, unknown> } }>;
  }));
  const info = Object.assign({}, ...results);
  const result = {} as ImageModelOptions;
  for (const [key, type, name] of fields) {
    const field = info[type]?.input?.required?.[name];
    const choices = Array.isArray(field) && Array.isArray(field[0]) ? field[0] : [];
    result[key] = [...new Set(choices.filter((item): item is string => typeof item === "string" && Boolean(item.trim())))];
    if (!result[key].length) throw new Error(`当前 ComfyUI 的 ${type}.${name} 没有可用选项`);
  }
  return result;
}
export function patchImageGenerationPrompt(source: ImageApiPrompt, graph: ImageWorkflowGraph, settings: ImageGenerationSettings): ImageApiPrompt {
  const effective = effectiveImageSettings(settings);
  const prompt = clone(source);
  const node = (type: string) => {
    const id = String(oneNode(graph, type).id);
    if (prompt[id]?.class_type !== type) throw new Error(`生图 API 缺少节点 ${id} (${type})`);
    return prompt[id];
  };
  const qwen = graph.nodes.some((item) => item.type === "TextEncodeQwenImage21");
  if (qwen) {
    node("TextEncodeQwenImage21").inputs.negative_prompt = effective.negativePrompt;
    const enhancer = graph.nodes.find((item) => item.type === "TextGenerate");
    if (enhancer && prompt[String(enhancer.id)]) {
      prompt[String(enhancer.id)].inputs.prompt = effective.positivePrompt;
      prompt[String(enhancer.id)].inputs["sampling_mode.seed"] = effective.seed;
    } else node("TextEncodeQwenImage21").inputs.prompt = effective.positivePrompt;
    node("RandomNoise").inputs.noise_seed = effective.seed;
    node("CFGGuider").inputs.cfg = effective.cfg;
    // Turbo's supplied ManualSigmas is authoritative; a stored legacy step count
    // must never replace its schedule.
  } else {
    prompt[String(encoder(graph, "positive").id)].inputs.text = effective.positivePrompt;
    prompt[String(encoder(graph, "negative").id)].inputs.text = effective.negativePrompt;
    Object.assign(node("KSampler").inputs, { seed: effective.seed, steps: effective.steps, cfg: effective.cfg });
  }
  Object.assign(node(qwen ? "EmptyLatentImage" : "EmptySD3LatentImage").inputs, { width: effective.width, height: effective.height, batch_size: effective.batchSize });
  for (const [key, type, input] of [["unetName", "UNETLoader", "unet_name"], ["clipName", "CLIPLoader", "clip_name"], ["clipType", "CLIPLoader", "type"], ["vaeName", "VAELoader", "vae_name"]] as const) {
    if (effective[key]) (type === "CLIPLoader" ? prompt[String(imageClip(graph).id)] : node(type)).inputs[input] = effective[key];
  }
  node("SaveImage").inputs.filename_prefix = effective.filenamePrefix;
  return prompt;
}
export function patchImageWorkflow(graph: ImageWorkflowGraph, prompt: ImageApiPrompt): ImageWorkflowGraph {
  const workflow = clone(graph);
  for (const node of workflow.nodes) {
    const values = prompt[String(node.id)]?.inputs;
    if (!values) continue;
    for (const [index, key] of (WIDGETS[node.type] ?? []).entries()) {
      const value = key === "control_after_generate" ? "fixed" : values[key];
      if (value === undefined || Array.isArray(value)) continue;
      if (node.widgets_values) node.widgets_values[index] = value;
      if (node.widgets_values_named) node.widgets_values_named[key] = value;
    }
  }
  return workflow;
}

export function safeImageStem(value: string): string {
  return value.trim().replace(/[^\p{L}\p{N}._-]+/gu, "_").replace(/^[_.]+|[_.]+$/g, "").slice(0, 72) || "asset";
}
export function imageFilenamePrefix(projectName: string, alias: string): string {
  return `TheodoreDirector/ImageGen/${safeImageStem(projectName)}/${safeImageStem(alias)}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
export function randomImageSeed(): number { return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); }
export function imageViewUrl(image: Pick<GeneratedImage, "filename" | "subfolder" | "type">): string {
  return `/view?${new URLSearchParams({ filename: image.filename, subfolder: image.subfolder, type: image.type })}`;
}
export function imagesFromHistory(history: unknown, promptId: string, outputNodeId?: string): GeneratedImage[] {
  const entry = historyEntry(history, promptId);
  const outputs = entry?.outputs;
  if (!outputs || typeof outputs !== "object") return [];
  const candidates = outputNodeId ? [(outputs as Record<string, unknown>)[outputNodeId]] : Object.values(outputs);
  const images = new Map<string, GeneratedImage>();
  for (const output of candidates) {
    const values = (output as { images?: unknown } | null)?.images;
    if (!Array.isArray(values)) continue;
    for (const raw of values) {
      const item = raw as Partial<GeneratedImage> | null;
      if (!item || typeof item.filename !== "string" || !/\.(png|jpe?g|webp|bmp)$/i.test(item.filename) || (item.type && item.type !== "output")) continue;
      const image = { filename: item.filename, subfolder: typeof item.subfolder === "string" ? item.subfolder : "", type: "output" as const };
      images.set(`${image.subfolder}/${image.filename}`, { ...image, url: imageViewUrl(image) });
    }
  }
  return [...images.values()];
}
function historyEntry(history: unknown, promptId: string): { outputs?: unknown; status?: { completed?: boolean; status_str?: string; messages?: unknown[] } } | undefined {
  if (!history || typeof history !== "object") return;
  const entry = (history as Record<string, unknown>)[promptId];
  return entry && typeof entry === "object" ? entry : undefined;
}
export function historyJobStatus(history: unknown, promptId: string): "pending" | "success" {
  const status = historyEntry(history, promptId)?.status;
  if (status?.status_str === "error") {
    for (const message of status.messages ?? []) {
      if (Array.isArray(message) && message[1] && typeof message[1] === "object") {
        const data = message[1] as Record<string, unknown>;
        if (data.exception_message) throw new Error(String(data.exception_message));
        if (message[0] === "execution_interrupted") throw new Error("生图任务已中断");
      }
    }
    throw new Error("生图任务执行失败，请查看 ComfyUI 执行记录");
  }
  return status?.completed ? "success" : "pending";
}
export async function fetchGeneratedImages(promptId: string, signal?: AbortSignal, fetcher: typeof fetch = fetch, outputNodeId?: string): Promise<GeneratedImage[]> {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (signal?.aborted) throw abortError();
    const response = await fetcher(`/history/${encodeURIComponent(promptId)}`, { signal });
    if (!response.ok) throw new Error(`读取生图结果失败：HTTP ${response.status}`);
    const history: unknown = await response.json();
    historyJobStatus(history, promptId);
    const images = imagesFromHistory(history, promptId, outputNodeId);
    if (images.length) return images;
    if (attempt < 39) await new Promise<void>((resolve, reject) => {
      const onAbort = () => { clearTimeout(timer); reject(abortError()); };
      const timer = setTimeout(() => { signal?.removeEventListener("abort", onAbort); resolve(); }, 500);
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }
  throw new Error("任务已结束，但没有 SaveImage 图片输出；可用任务 ID 在 ComfyUI 历史记录中核查");
}

export function generatedAsset(source: DirectorAsset, path: string, prompt: string, assets: DirectorAsset[], record?: ImageGenerationRecord): DirectorAsset {
  const used = new Set(assets.map((asset) => asset.alias.toLowerCase()));
  let index = 1;
  while (used.has(`${source.alias}_${index}`.toLowerCase())) index++;
  return { ...source, id: `image_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`,
    alias: `${source.alias}_${index}`, kind: "image", path, genPrompt: prompt, fingerprint: "", fixed: false,
    enabled: true, fixedOrder: Math.max(0, ...assets.map((asset) => asset.fixedOrder)) + 1, shotIds: [],
    imageGeneration: record, imageGenerationPending: undefined,
    includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null };
}
