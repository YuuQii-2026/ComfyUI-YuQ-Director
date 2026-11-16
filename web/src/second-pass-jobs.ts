import type { GeneratedVideoItem } from "./generated-results";
import { patchSecondPassPrompt, type ApiPrompt } from "./comfy-prompt";
import { chosenTake, firstPassTakes, previousEnabledShot, relaysFromPrevious } from "./review";
import type { DirectorPlan, DirectorShot, PostprocessMode, SecondPassQueueRequest } from "./types";

/** 预检与节点执行使用同一份请求，原生接力模式由实际提交的源节点决定。 */
export function prepareSecondPassSubmission(source: ApiPrompt, sourceId: string, targetId: string, request: SecondPassQueueRequest) {
  const native = source[sourceId]?.inputs.native_continuity;
  if (native !== undefined && typeof native !== "boolean") {
    throw new Error("请在二采源节点直接设置 native_continuity 开关，接力预检需要确定其状态");
  }
  const { onProgress: _onProgress, signal: _signal, ...payload } = request;
  payload.relayVersion = 1;
  delete payload.continuityMode;
  if (native) payload.continuityMode = "h3_native_prefix_right_context_v1";
  const output = patchSecondPassPrompt(source, {
    sourceId, targetId, requestJson: JSON.stringify(payload),
    processingMode: request.processingMode, denoise: request.denoise, scale: request.plan.pipeline?.secondPassScale,
  });
  payload.workflowSignature = secondPassWorkflowSignature(output);
  output[sourceId].inputs.request_json = JSON.stringify(payload);
  return { payload, output };
}

/** 在生成前确定整条上游链；每个已通过的片段只排队一次。 */
export function secondPassJobs(plan: DirectorPlan, requested: string[], results: Record<string, GeneratedVideoItem[]>, mode: PostprocessMode, skipDone: boolean) {
  const selections: Record<string, string> = {};
  for (const shot of plan.shots) {
    const take = chosenTake(shot, firstPassTakes(results[shot.id] ?? []));
    if (take) selections[shot.id] = take.path;
  }
  const selected = new Set(requested);
  const add = (shot: DirectorShot) => {
    if (!selections[shot.id]) throw new Error(`「${shot.title}」缺少选定的一采结果`);
    if (shot.review?.status !== "approved") throw new Error(`接力链中的「${shot.title}」尚未通过审片，请先确认其一采结果`);
    if (mode === "super_resolution_only" || !relaysFromPrevious(plan, shot)) return;
    const previous = previousEnabledShot(plan, shot.id)!;
    selected.add(previous.id);
    add(previous);
  };
  for (const shot of plan.shots) if (selected.has(shot.id)) add(shot);
  return {
    selections,
    jobs: plan.shots.filter((shot) => selected.has(shot.id))
      .map((shot) => ({
      shot, sourcePath: selections[shot.id], skipIfValid: skipDone || !requested.includes(shot.id),
    })),
  };
}

/** 图结构和参数参与状态匹配；每次请求的 ID、选片和进度字段由服务端另行校验。 */
export function secondPassWorkflowSignature(prompt: Record<string, { class_type: string; inputs: Record<string, unknown> }>): string {
  const normalized = Object.fromEntries(Object.keys(prompt).sort().map((id) => {
    const node = prompt[id];
    const inputs = Object.fromEntries(Object.keys(node.inputs).sort().map((key) => [key,
      node.class_type === "TheodoreDirector_PostprocessSecondPassSource" && key === "request_json" ? "" : node.inputs[key],
    ]));
    return [id, { class_type: node.class_type, inputs }];
  }));
  return JSON.stringify(normalized);
}
