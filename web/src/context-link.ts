import type { ApiPrompt } from "./comfy-prompt";

export const VIDEO_CONTEXT_OPTIONS = ["22", "5", "39", "56"];

interface Port { name: string; type?: unknown; link?: number | null; links?: number[] | null }
export interface ContextNode { id?: number | string; type?: string; inputs?: Port[]; outputs?: Port[] }
interface ContextLink { origin_id: number | string; origin_slot: number; target_id: number | string; target_slot: number; type?: unknown }
export interface ContextGraph {
  nodes?: ContextNode[];
  _nodes?: ContextNode[];
  links?: Array<[number, number | string, number, number | string, number, unknown]> | Record<number, ContextLink>;
}

/** 修复工作流恢复的旧端口类型，不改动连线、参数或项目内容。 */
export function repairVideoContextTypes(graph: ContextGraph): void {
  const nodes = graph._nodes ?? graph.nodes ?? [];
  const byId = new Map(nodes.map((node) => [String(node.id), node]));
  for (const node of nodes) {
    if (node.type !== "TheodoreDirector_ShotControl") continue;
    const port = node.outputs?.find((output) => output.name === "video_context");
    if (port) port.type = [...VIDEO_CONTEXT_OPTIONS];
  }
  for (const link of Object.values(graph.links ?? {})) {
    const [originId, originSlot, targetId, targetSlot] = Array.isArray(link)
      ? link.slice(1, 5) as [number | string, number, number | string, number]
      : [link.origin_id, link.origin_slot, link.target_id, link.target_slot];
    const origin = byId.get(String(originId));
    const target = byId.get(String(targetId));
    if (origin?.type !== "TheodoreDirector_ShotControl" || origin.outputs?.[originSlot]?.name !== "video_context"
      || target?.type !== "MiniMaxH3MotionContext" || target.inputs?.[targetSlot]?.name !== "context_length") continue;
    target.inputs[targetSlot].type = [...VIDEO_CONTEXT_OPTIONS];
    if (Array.isArray(link)) link[5] = [...VIDEO_CONTEXT_OPTIONS];
    else link.type = [...VIDEO_CONTEXT_OPTIONS];
  }
}

/** 在最终排队时读取该控制节点的项目，避免不同 ComfyUI 版本的枚举连线校验差异。 */
export function materializeVideoContext(source: ApiPrompt): ApiPrompt {
  let output = source;
  for (const [id, node] of Object.entries(source)) {
    const link = node.inputs.context_length;
    if (node.class_type !== "MiniMaxH3MotionContext" || !Array.isArray(link) || link.length !== 2 || link[1] !== 13) continue;
    const control = source[String(link[0])];
    if (control?.class_type !== "TheodoreDirector_ShotControl") continue;
    const planLink = control.inputs.plan;
    if (!Array.isArray(planLink) || planLink.length !== 2 || planLink[1] !== 0) continue;
    const project = source[String(planLink[0])];
    if (project?.class_type !== "TheodoreDirector_Project") continue;
    let plan: { continuity?: { videoContextFrames?: unknown } };
    try { plan = JSON.parse(String(project.inputs.plan_json)); }
    catch { throw new Error("镜头接力配置无法读取：请先保存导播台项目"); }
    const frames = plan?.continuity?.videoContextFrames ?? 22;
    if (typeof frames !== "number" || !Number.isInteger(frames) || !VIDEO_CONTEXT_OPTIONS.includes(String(frames))) {
      throw new Error("视频接力帧数只能为 5、22、39 或 56");
    }
    if (output === source) output = { ...source };
    output[id] = { ...node, inputs: { ...node.inputs, context_length: String(frames) } };
  }
  return output;
}
