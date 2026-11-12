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
}

/** 一采单段提交：写入一采计划、指定段索引、关闭续跑跳过和 Impact 自动排下一段。 */
export function patchFirstPassPrompt(source: ApiPrompt, patch: FirstPassPatch): ApiPrompt {
  const prompt = JSON.parse(JSON.stringify(source)) as ApiPrompt;
  const projectId = requireSingle(prompt, "TheodoreDirector_Project", "Theodore 项目");
  prompt[projectId].inputs.plan_json = patch.planJson;

  // 后处理支流里没有 SelectShot；主循环只能有一个当前分镜节点。
  const selectId = requireSingle(prompt, "TheodoreDirector_SelectShot", "Theodore 当前分镜");
  const select = prompt[selectId];
  // 由导播台逐段指定要跑的镜头，不能让 resume 把已完成镜头跳到下一段。
  if ("resume_mode" in select.inputs) select.inputs.resume_mode = "fresh";
  if (!setUpstreamInt(prompt, selectId, "queue_index", patch.activeIndex)) {
    throw new Error("无法定位当前片段序号节点（SelectShot.queue_index 的上游整数）");
  }

  // 保留 Impact 链路以便 CommitResult 照常提交结果，只把“继续排队”开关改为 false。
  for (const id of findNodeIds(prompt, "ImpactQueueTrigger")) {
    prompt[id].inputs.mode = false;
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
    if (["TheodoreDirector_Project", "TheodoreDirector_SelectShot", "TheodoreDirector_CommitResult", "ImpactQueueTrigger", "ImpactSetWidgetValue"].includes(node.class_type)) {
      throw new Error(`后处理二采支流错误连接到主循环节点 ${id}（${node.class_type}）`);
    }
    output[id] = node;
    for (const value of Object.values(node.inputs)) {
      if (isLink(value)) pending.push(String(value[0]));
    }
  }
  if (!output[patch.sourceId]) throw new Error("后处理二采保存目标未连接到所选源节点");
  return output;
}
