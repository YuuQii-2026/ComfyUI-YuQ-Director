/**
 * 对 ComfyUI API 格式的 prompt 做“只影响本次排队”的修改。
 *
 * 导播台过去在序列化前临时改控件、序列化后再恢复，但 Impact 随后自动排队的
 * 下一段会重新读取画布控件，导致一采队列混入二采、单段重生无法只跑一段。
 * 直接改写 API prompt 不触碰画布，也不依赖第三方节点是否为输出节点。
 */

import type { PostprocessMode } from "./types";

export interface ApiNode {
  class_type: string;
  inputs: Record<string, unknown>;
  _meta?: { title?: string };
}

export type ApiPrompt = Record<string, ApiNode>;

type Link = [string, number];

function isLink(value: unknown): value is Link {
  return Array.isArray(value) && value.length === 2 && (typeof value[0] === "string" || typeof value[0] === "number") && typeof value[1] === "number";
}

function linkOrigin(value: unknown): string | null {
  return isLink(value) ? String(value[0]) : null;
}

export function findNodeIds(prompt: ApiPrompt, classType: string): string[] {
  return Object.keys(prompt).filter((id) => prompt[id]?.class_type === classType);
}

function requireSingle(prompt: ApiPrompt, classType: string, label: string): string {
  const ids = findNodeIds(prompt, classType);
  if (!ids.length) throw new Error(`当前工作流缺少 ${label}（${classType}）节点`);
  if (ids.length > 1) throw new Error(`当前工作流存在多个 ${label}（${classType}）节点，无法确定要控制哪一个`);
  return ids[0];
}

/**
 * 沿连线向上找到真正保存整数的节点（如 PrimitiveInt），并写入新值。
 * ImpactExecutionOrderController 只是透传 value，需要继续向上追踪。
 */
function setUpstreamInt(prompt: ApiPrompt, nodeId: string, inputName: string, value: number, depth = 0): boolean {
  const node = prompt[nodeId];
  if (!node || depth > 6) return false;
  const current = node.inputs[inputName];
  if (typeof current === "number") {
    node.inputs[inputName] = value;
    return true;
  }
  const origin = linkOrigin(current);
  if (!origin || !prompt[origin]) return false;
  const upstream = prompt[origin];
  if (typeof upstream.inputs.value === "number" || isLink(upstream.inputs.value)) {
    return setUpstreamInt(prompt, origin, "value", value, depth + 1);
  }
  return false;
}

export interface FirstPassPatch {
  planJson: string;
  activeIndex: number;
  projectId?: string;
  baseSeed?: number;
}

export function dependsOn(prompt: ApiPrompt, id: string, source: string, visited = new Set<string>()): boolean {
  if (id === source) return true;
  if (visited.has(id)) return false;
  visited.add(id);
  return Object.values(prompt[id]?.inputs ?? {}).some((value) => isLink(value) && dependsOn(prompt, String(value[0]), source, visited));
}

/** Keep the selected output and its dependencies, using ComfyUI's native serialization. */
export function sliceApiPrompt(prompt: ApiPrompt, target: string): ApiPrompt {
  const result: ApiPrompt = {};
  const pending = [target];
  while (pending.length) {
    const id = pending.pop()!;
    if (result[id]) continue;
    if (!prompt[id]) throw new Error(`工作流依赖节点 ${id} 不存在`);
    result[id] = prompt[id];
    for (const value of Object.values(prompt[id].inputs)) if (isLink(value)) pending.push(String(value[0]));
  }
  return result;
}

export function patchCanvasImagePrompt(source: ApiPrompt, projectId: string, settings: {
  positivePrompt: string; negativePrompt: string; width: number; height: number; batchSize: number; seed: number; filenamePrefix: string;
}): { output: ApiPrompt; targetId: string; sourceId: string } {
  const prompt = JSON.parse(JSON.stringify(source)) as ApiPrompt;
  const controls = findNodeIds(prompt, "TheodoreDirector_ImageControls").filter((id) => dependsOn(prompt, id, projectId));
  if (controls.length !== 1) throw new Error(`当前项目需要连接一个生图控制节点，找到 ${controls.length} 个`);
  const sourceId = controls[0];
  const targets = findNodeIds(prompt, "SaveImage").filter((id) => {
    const prefix = prompt[id].inputs.filename_prefix;
    return isLink(prefix) && String(prefix[0]) === sourceId && prefix[1] === 6 && dependsOn(prompt, String(linkOrigin(prompt[id].inputs.images)), sourceId);
  });
  if (targets.length !== 1) throw new Error("请将生图控制的保存路径连接到唯一的 SaveImage，图像链也须连接生图控制");
  Object.assign(prompt[sourceId].inputs, {
    positive_prompt: settings.positivePrompt, negative_prompt: settings.negativePrompt,
    width: settings.width, height: settings.height, batch_size: settings.batchSize,
    seed: settings.seed, filename_prefix: settings.filenamePrefix,
  });
  // Resolve literal prompt-enhancement switches before pruning the image job.
  // The optional text model is then absent when enhancement is off.
  for (const node of Object.values(prompt)) for (const [key, value] of Object.entries(node.inputs)) {
    let current = value;
    const seen = new Set<string>();
    while (isLink(current)) {
      const id = String(current[0]);
      const upstream = prompt[id];
      if (current[1] !== 0 || upstream?.class_type !== "ComfySwitchNode" || typeof upstream.inputs.switch !== "boolean") break;
      if (seen.has(id)) throw new Error("生图提示词开关形成循环");
      seen.add(id);
      current = upstream.inputs[upstream.inputs.switch ? "on_true" : "on_false"];
      if (current === undefined) throw new Error("生图提示词开关缺少所选输入");
    }
    node.inputs[key] = current;
  }
  return { output: sliceApiPrompt(prompt, targets[0]), targetId: targets[0], sourceId };
}

/** 一采单段提交：写入一采计划、指定段索引、关闭续跑跳过和 Impact 自动排下一段。 */
export function patchFirstPassPrompt(source: ApiPrompt, patch: FirstPassPatch): ApiPrompt {
  const prompt = JSON.parse(JSON.stringify(source)) as ApiPrompt;
  const projectId = patch.projectId ?? requireSingle(prompt, "TheodoreDirector_Project", "Theodore 项目");
  if (prompt[projectId]?.class_type !== "TheodoreDirector_Project") throw new Error("当前导播台的项目节点不存在或已被旁路");
  prompt[projectId].inputs.plan_json = patch.planJson;

  // 后处理支流里没有 SelectShot；主循环只能有一个当前分镜节点。
  const selectorIds = Object.keys(prompt).filter((id) => ["TheodoreDirector_SelectShot", "TheodoreDirector_ShotControl"].includes(prompt[id].class_type) && dependsOn(prompt, id, projectId));
  if (selectorIds.length !== 1) throw new Error(`当前项目需要连接一个分镜控制节点，找到 ${selectorIds.length} 个`);
  const selectId = selectorIds[0];
  const select = prompt[selectId];
  // 由导播台逐段指定要跑的镜头，不能让 resume 把已完成镜头跳到下一段。
  if ("resume_mode" in select.inputs) select.inputs.resume_mode = "fresh";
  if (select.class_type === "TheodoreDirector_ShotControl") {
    select.inputs.queue_index = patch.activeIndex;
  } else if (!setUpstreamInt(prompt, selectId, "queue_index", patch.activeIndex)) {
    throw new Error("无法定位当前片段序号节点（SelectShot.queue_index 的上游整数）");
  }
  if (select.class_type === "TheodoreDirector_SelectShot" && patch.baseSeed !== undefined) select.inputs.base_seed = patch.baseSeed;

  // 保留 Impact 链路以便 CommitResult 照常提交结果，只把“继续排队”开关改为 false。
  for (const id of findNodeIds(prompt, "ImpactQueueTrigger")) {
    if (!patch.projectId || dependsOn(prompt, id, selectId)) prompt[id].inputs.mode = false;
  }
  if (select.class_type === "TheodoreDirector_ShotControl") {
    const targets = findNodeIds(prompt, "TheodoreDirector_CommitResult").filter((id) => dependsOn(prompt, id, selectId));
    if (targets.length !== 1) throw new Error("当前分镜控制需要连接一个结果提交节点");
    return sliceApiPrompt(prompt, targets[0]);
  }
  return prompt;
}

/** 返回后处理二采支流中使用的调度器节点 ID，用于覆盖 denoise。 */
export function findSecondPassSchedulers(prompt: ApiPrompt): string[] {
  const sourceIds = new Set(findNodeIds(prompt, "TheodoreDirector_PostprocessSecondPassSource"));
  if (!sourceIds.size) return [];
  const noiseIds = new Set(Object.keys(prompt).filter((id) => {
    const node = prompt[id];
    return node.class_type === "RandomNoise" && sourceIds.has(linkOrigin(node.inputs.noise_seed) ?? "");
  }));
  const schedulers = new Set<string>();
  for (const id of Object.keys(prompt)) {
    const node = prompt[id];
    if (node.class_type !== "SamplerCustomAdvanced") continue;
    if (!noiseIds.has(linkOrigin(node.inputs.noise) ?? "")) continue;
    const sigmas = linkOrigin(node.inputs.sigmas);
    if (sigmas && prompt[sigmas]?.class_type === "BasicScheduler") schedulers.add(sigmas);
  }
  return [...schedulers];
}

/** 覆盖后处理二采的 denoise；找不到调度器时返回 0，调用方据此提示用户。 */
export function patchSecondPassDenoise(prompt: ApiPrompt, denoise: number): number {
  const schedulers = findSecondPassSchedulers(prompt);
  for (const id of schedulers) prompt[id].inputs.denoise = denoise;
  return schedulers.length;
}

export interface SecondPassPatch {
  sourceId: string;
  targetId: string;
  requestJson: string;
  processingMode: PostprocessMode;
  denoise?: number;
  scale?: number;
}

/** 升级旧画布的局部提交图；节点 ID 由采样器派生，不修改用户画布。 */
function connectSecondPassRelay(prompt: ApiPrompt, sourceId: string): void {
  const audioIds = findNodeIds(prompt, "VAEEncodeAudio").filter((id) => dependsOn(prompt, id, sourceId));
  for (const id of findNodeIds(prompt, "MiniMaxH3ReferenceToVideo")) {
    if (dependsOn(prompt, id, sourceId)) prompt[id].inputs.length = [sourceId, 13];
  }
  for (const id of findNodeIds(prompt, "CreateVideo")) {
    if (dependsOn(prompt, id, sourceId)) prompt[id].inputs.audio = [sourceId, 14];
  }
  for (const id of findNodeIds(prompt, "SamplerCustomAdvanced")) {
    if (!dependsOn(prompt, id, sourceId)) continue;
    const sampler = prompt[id];
    const guiderId = linkOrigin(sampler.inputs.guider);
    const guider = guiderId ? prompt[guiderId] : undefined;
    if (!guider || guider.class_type !== "BasicGuider") throw new Error("二采接力需要连接 BasicGuider，请使用新版工作流的后处理支流");
    const conditioningId = linkOrigin(guider.inputs.conditioning);
    if (conditioningId && prompt[conditioningId]?.class_type === "TheodoreDirector_SecondPassRelay") continue;
    if (audioIds.length !== 1) throw new Error("二采接力无法定位唯一的源音轨编码节点");
    const vaeId = findNodeIds(prompt, "VAEDecode").find((nodeId) => linkOrigin(prompt[nodeId].inputs.samples) === id);
    if (!vaeId) throw new Error("二采接力找不到采样器对应的视频解码节点");
    const relayId = `yuq_relay_${id}`, guideId = `yuq_guide_${id}`, finalId = `yuq_finalize_${id}`;
    if ([relayId, guideId, finalId].some((key) => prompt[key])) throw new Error("二采接力自动节点 ID 冲突");
    prompt[relayId] = { class_type: "TheodoreDirector_SecondPassRelay", inputs: {
      conditioning: guider.inputs.conditioning, latent: sampler.inputs.latent_image,
      vae: prompt[vaeId].inputs.vae, request: [sourceId, 2],
    } };
    prompt[guideId] = { ...guider, inputs: { ...guider.inputs, conditioning: [relayId, 0] } };
    sampler.inputs.guider = [guideId, 0];
    // 改接现有消费者后才添加 final，避免节点读取自己的输出。
    for (const node of Object.values(prompt)) for (const [name, value] of Object.entries(node.inputs)) {
      if (isLink(value) && String(value[0]) === vaeId && value[1] === 0) node.inputs[name] = [finalId, 0];
    }
    prompt[finalId] = { class_type: "TheodoreDirector_SecondPassFinalize", inputs: {
      images: [vaeId, 0], latent: [id, 0], audio_latent: [audioIds[0], 0], request: [sourceId, 2],
    } };
  }
}

/** 二采只提交保存目标及其依赖，兼容不支持 partialExecutionTargets 的 ComfyUI。 */
export function patchSecondPassPrompt(source: ApiPrompt, patch: SecondPassPatch): ApiPrompt {
  const prompt = JSON.parse(JSON.stringify(source)) as ApiPrompt;
  if (prompt[patch.sourceId]?.class_type !== "TheodoreDirector_PostprocessSecondPassSource") {
    throw new Error("无法序列化后处理二采源节点");
  }
  if (prompt[patch.targetId]?.class_type !== "TheodoreDirector_SaveSecondPass") {
    throw new Error("无法序列化后处理二采保存节点");
  }
  prompt[patch.sourceId].inputs.request_json = patch.requestJson;
  if (patch.processingMode === "latent_upscale_second_pass") {
    const options = prompt[patch.sourceId].inputs;
    for (const [id, node] of Object.entries(prompt)) {
      if (node.class_type !== "MinimaxH3LatentUpscaler3D" || !dependsOn(prompt, id, patch.sourceId)) continue;
      if (options.latent_full_sequence === true) {
        node.inputs.enable_temporal_chunking = false;
        node.inputs.precision = "fp32";
      }
      if (options.diagnose_latent === true) {
        const input = node.inputs.latent;
        if (!isLink(input)) throw new Error("latent 诊断需要放大器直接连接 latent 输入");
        const before = `yuq_probe_before_${id}`, after = `yuq_probe_after_${id}`;
        if (prompt[before] || prompt[after]) throw new Error("latent 诊断节点 ID 冲突");
        for (const consumer of Object.values(prompt)) {
          for (const [key, link] of Object.entries(consumer.inputs)) {
            if (isLink(link) && String(link[0]) === id && link[1] === 0) consumer.inputs[key] = [after, 0];
          }
        }
        prompt[before] = { class_type: "TheodoreDirector_LatentProbe", inputs: { latent: input, request: [patch.sourceId, 2], stage: "encoded" } };
        node.inputs.latent = [before, 0];
        prompt[after] = { class_type: "TheodoreDirector_LatentProbe", inputs: { latent: [id, 0], request: [patch.sourceId, 2], stage: "upscaled" } };
      }
    }
  }
  // Older canvases can still submit an RTX result with odd H3 latent dimensions.
  // Insert alignment only at the RTX -> video VAE boundary, leaving the canvas intact.
  if (patch.processingMode === "super_resolution_second_pass") {
    for (const [id, node] of Object.entries(prompt)) {
      const pixels = node.inputs.pixels;
      if (node.class_type !== "VAEEncode" || !isLink(pixels)) continue;
      const upscaler = prompt[String(pixels[0])];
      if (upscaler?.class_type !== "RTXVideoSuperResolution" || !dependsOn(prompt, String(pixels[0]), patch.sourceId)) continue;
      const alignId = `yuq_align_${id}`;
      if (prompt[alignId]) throw new Error("二采画幅对齐节点 ID 冲突");
      prompt[alignId] = { class_type: "TheodoreDirector_SecondPassAlign", inputs: { images: pixels } };
      node.inputs.pixels = [alignId, 0];
    }
  }
  if (JSON.parse(patch.requestJson).relayVersion === 1 && patch.processingMode !== "super_resolution_only") {
    connectSecondPassRelay(prompt, patch.sourceId);
  }
  if (typeof patch.denoise === "number" && patch.processingMode !== "super_resolution_only") {
    if (!patchSecondPassDenoise(prompt, patch.denoise)) {
      throw new Error("当前工作流的后处理二采支流中找不到 BasicScheduler，无法设置重绘强度");
    }
  }

  // 源节点的三个模式 BOOL：把未选支流替换为同一条已选输入，保留条件节点的必填端口。
  const modeSlots: Record<number, PostprocessMode> = {
    8: "super_resolution_second_pass", 9: "latent_upscale_second_pass", 10: "super_resolution_only",
  };
  for (const node of Object.values(prompt)) {
    const cond = node.inputs.cond;
    if (node.class_type !== "ImpactConditionalBranch" || !isLink(cond) || String(cond[0]) !== patch.sourceId) continue;
    const mode = modeSlots[cond[1]];
    if (!mode) continue;
    const enabled = patch.processingMode === mode;
    const selected = node.inputs[enabled ? "tt_value" : "ff_value"];
    if (selected === undefined) throw new Error("后处理二采模式选择节点缺少输入");
    node.inputs = { cond: enabled, tt_value: selected, ff_value: selected };
  }

  const output: ApiPrompt = {};
  const pending = [patch.targetId];
  while (pending.length) {
    const id = pending.pop()!;
    if (output[id]) continue;
    const node = prompt[id];
    if (!node) throw new Error(`后处理二采依赖节点 ${id} 不存在`);
    if (["TheodoreDirector_Project", "TheodoreDirector_SelectShot", "TheodoreDirector_ShotControl", "TheodoreDirector_ImageControls", "TheodoreDirector_CommitResult", "ImpactQueueTrigger", "ImpactSetWidgetValue"].includes(node.class_type)) {
      throw new Error(`后处理二采支流错误连接到主循环节点 ${id}（${node.class_type}）`);
    }
    output[id] = node;
    for (const value of Object.values(node.inputs)) {
      if (isLink(value)) pending.push(String(value[0]));
    }
  }
  if (!output[patch.sourceId]) throw new Error("后处理二采保存目标未连接到所选源节点");
  if (patch.scale !== undefined) {
    const scale = patch.scale;
    if (!Number.isFinite(scale) || scale < 1 || scale > 2) throw new Error("二采倍率必须在 1 到 2 之间");
    const latent = patch.processingMode === "latent_upscale_second_pass";
    const type = latent ? "MinimaxH3LatentUpscaler3D" : "RTXVideoSuperResolution";
    const upscalers = Object.values(output).filter((node) => node.class_type === type);
    const mode = latent ? "mode" : "resize_type";
    if (upscalers.length !== 1 || upscalers[0].inputs[mode] !== "scale by multiplier" || typeof upscalers[0].inputs[`${mode}.scale`] !== "number") {
      throw new Error("当前二采支路没有唯一的倍率模式放大节点，请在画布设置倍率或切回跟随工作流");
    }
    upscalers[0].inputs[`${mode}.scale`] = scale;
    if (latent) {
      const conditions = Object.values(output).filter((node) => node.class_type === "MiniMaxH3ConditioningUpscale");
      if (conditions.length !== 1 || typeof conditions[0].inputs.scale_by !== "number") throw new Error("当前 latent 二采支路缺少唯一可设置的条件倍率节点");
      conditions[0].inputs.scale_by = scale;
    }
  }
  return output;
}
