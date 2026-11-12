import { openEditor } from "./editor";
import { patchFirstPassPrompt, patchSecondPassPrompt, type ApiPrompt } from "./comfy-prompt";
import { activeIndexOf } from "./review";
import { abortError, runQueuedJob, type ComfyQueueApi } from "./comfy-queue";
import imageWorkflowText from "../../workflows/image-generation.json?raw";
import { effectiveImageSettings, fetchGeneratedImages, fetchImageModelOptions, historyJobStatus, imageWorkflowDefaults, patchImageGenerationPrompt, patchImageWorkflow, uiWorkflowToApiPrompt, type ImageGenerationController, type ImageGenerationDefaults, type ImageGenerationSettings, type ImageWorkflowGraph, type PendingImageGeneration, type QueueImageGenerationRequest } from "./image-generation";
import type { DirectorPlan, FirstPassQueueRequest, QueueFirstPass, QueueSecondPass, SecondPassQueueRequest } from "./types";
import directorStyles from "./style.css?inline";
import { createWorkflowSettings, type GraphWidget } from "./workflow-settings";

const STYLE_ID = "yuq-director-styles";

function ensureDirectorStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = directorStyles;
  document.head.append(style);
}

// ComfyUI 只自动加载 web 目录中的 JavaScript，样式必须由扩展主动注入。
ensureDirectorStyles();

interface Widget extends GraphWidget { type?: string; computeSize?: () => [number, number] }
interface ComfyNode { id?: number | string; mode?: number; widgets?: Widget[]; inputs?: Array<{ name: string; link?: number | null }>; outputs?: Array<{ name: string; links?: number[] | null }>; addWidget: (type: string, name: string, value: unknown, callback: () => void) => Widget; setDirtyCanvas: (foreground: boolean, background: boolean) => void; size?: [number, number]; type?: string; title?: string }
interface NodeType { prototype: { onNodeCreated?: () => void } }
interface GraphPrompt { output: ApiPrompt; workflow: unknown }
interface ComfyApp { registerExtension: (extension: unknown) => void; graph?: { _nodes?: ComfyNode[]; setDirtyCanvas?: (foreground: boolean, background: boolean) => void }; rootGraph?: unknown; graphToPrompt: (graph?: unknown) => Promise<GraphPrompt> }
interface ComfyApi extends ComfyQueueApi {
  queuePrompt: (number: number, prompt: GraphPrompt, options?: { partialExecutionTargets?: string[] }) => Promise<{ prompt_id?: string }>;
  fetchApi?: (input: string, init?: RequestInit) => Promise<Response>;
}

function loadBundledImageWorkflow(): ImageWorkflowGraph & { links?: unknown[] } {
  const value = JSON.parse(imageWorkflowText) as ImageWorkflowGraph & { links?: unknown[] };
  if (!Array.isArray(value.nodes) || !value.nodes.length) throw new Error("内置生图工作流为空");
  return value;
}

// ComfyUI 在浏览器运行时提供此模块，使用动态导入可让前端独立构建与测试。
const comfyAppUrl = "/scripts/app.js";
const comfyApiUrl = "/scripts/api.js";
void Promise.all([
  import(/* @vite-ignore */ comfyAppUrl),
  import(/* @vite-ignore */ comfyApiUrl),
]).then(([{ app }, { api }]: [{ app: ComfyApp }, { api: ComfyApi }]) => {
  const queueFirstPass: QueueFirstPass = async (request: FirstPassQueueRequest) => {
    const firstPassPlan: DirectorPlan = {
      ...request.plan,
      pipeline: { ...(request.plan.pipeline ?? { firstPassConfirmed: false, secondPassMode: "super_resolution_second_pass" }), phase: "first_pass", firstPassConfirmed: false },
      // 一采只生成基础结果；二采只在审片确认后由后处理支流单独执行。
      shots: request.plan.shots.map((shot) => ({ ...shot, secondSamplingMode: "off" })),
    };
    const shotIds = request.shotIds ?? firstPassPlan.shots.filter((shot) => shot.enabled).map((shot) => shot.id);
    const planJson = JSON.stringify(firstPassPlan);
    const base = await app.graphToPrompt(app.rootGraph);
    for (const [index, shotId] of shotIds.entries()) {
      if (request.signal?.aborted) throw abortError();
      const activeIndex = activeIndexOf(firstPassPlan, shotId);
      if (activeIndex < 0) throw new Error(`镜头 ${shotId} 未启用或不存在，无法生成`);
      // 每段都单独提交并关闭 Impact 自动续排，导播台掌握顺序、进度与停止。
      const output = patchFirstPassPrompt(base.output, { planJson, activeIndex });
      request.onShotStart?.(shotId, index, shotIds.length);
      request.onProgress?.({ value: 0, max: 0 });
      await runQueuedJob(api, () => api.queuePrompt(0, { output, workflow: base.workflow }), request.onProgress, `镜头 ${shotId} 一采执行失败`, request.signal);
      request.onShotDone?.(shotId, index, shotIds.length);
    }
  };

  const queueStandaloneSecondPass: QueueSecondPass = async (request: SecondPassQueueRequest) => {
    const nodes = app.graph?._nodes ?? [];
    const source = nodes.find((node) => node.type === "TheodoreDirector_PostprocessSecondPassSource");
    const target = nodes.find((node) => node.type === "TheodoreDirector_SaveSecondPass");
    if (!source || !target || source.id === undefined || target.id === undefined) {
      throw new Error("当前工作流缺少后处理单独二采支流，请重新载入仓库中的 V7 导播台示例工作流");
    }
    const previousSourceMode = source.mode;
    const previousTargetMode = target.mode;
    let prompt: GraphPrompt;
    try {
      // 支流平时保持旁路；这里只在序列化局部任务时临时启用，不污染用户工作流。
      source.mode = 0;
      target.mode = 0;
      prompt = await app.graphToPrompt(app.rootGraph);
    } finally {
      source.mode = previousSourceMode;
      target.mode = previousTargetMode;
    }
    const { onProgress, signal, ...payload } = request;
    const output = patchSecondPassPrompt(prompt.output, {
      sourceId: String(source.id), targetId: String(target.id), requestJson: JSON.stringify(payload),
      processingMode: request.processingMode, denoise: request.denoise,
    });
    if (signal?.aborted) throw abortError();
    await runQueuedJob(api, () => api.queuePrompt(0, { output, workflow: prompt.workflow }), onProgress, "单独二采任务执行失败", signal);
  };

  let imageGraph: ImageWorkflowGraph | undefined;
  let imageApiPrompt: ReturnType<typeof uiWorkflowToApiPrompt> | undefined;
  const getImageWorkflow = () => {
    imageGraph ??= loadBundledImageWorkflow();
    imageApiPrompt ??= uiWorkflowToApiPrompt(imageGraph);
    return { graph: imageGraph, prompt: imageApiPrompt };
  };
  const apiFetch: typeof fetch = (input, init) => {
    const path = input instanceof Request ? input.url : String(input);
    return api.fetchApi ? api.fetchApi(path, init) : fetch(input, init);
  };
  const checkImageWorkflow = async (graph: ImageWorkflowGraph, signal?: AbortSignal) => {
    const errors: string[] = [];
    const requiredModels: Array<[string, string, unknown]> = [];
    for (const node of graph.nodes) {
      const values = node.widgets_values_named ?? {};
      if (node.type === "UNETLoader") requiredModels.push([node.type, "unet_name", values.unet_name]);
      if (node.type === "CLIPLoader") requiredModels.push([node.type, "clip_name", values.clip_name]);
      if (node.type === "CLIPLoader") requiredModels.push([node.type, "type", values.type]);
      if (node.type === "VAELoader") requiredModels.push([node.type, "vae_name", values.vae_name]);
    }
    const classes = [...new Set(graph.nodes.filter((node) => node.mode !== 4).map((node) => node.type).filter((type) => type !== "Note"))];
    await Promise.all(classes.map(async (type) => {
      const response = await apiFetch(`/object_info/${encodeURIComponent(type)}`, { signal });
      if (!response.ok) { errors.push(`节点 ${type} 不可用（HTTP ${response.status}）`); return; }
      const data = await response.json() as Record<string, { input?: { required?: Record<string, unknown> } }>;
      if (!data[type]) { errors.push(`当前 ComfyUI 缺少节点 ${type}`); return; }
      for (const [className, fieldName, modelName] of requiredModels.filter((entry) => entry[0] === type)) {
        const field = data[className]?.input?.required?.[fieldName];
        const options = Array.isArray(field) && Array.isArray(field[0]) ? field[0] as unknown[] : [];
        if (typeof modelName !== "string" || !options.includes(modelName)) errors.push(`模型/类型 ${String(modelName)} 未安装或不在 ${className}.${fieldName} 可用列表中`);
      }
    }));
    if (signal?.aborted) throw abortError();
    if (errors.length) throw new Error(errors.join("\n"));
  };
  const imageGeneration: ImageGenerationController = {
    defaults: async (): Promise<ImageGenerationDefaults> => ({ ...imageWorkflowDefaults(getImageWorkflow().graph), width: 1080, height: 720, batchSize: 1, modelOptions: await fetchImageModelOptions(apiFetch) }),
    register: async (projectName, image) => {
      const response = await apiFetch("/theodore-director/v1/image-generation/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, filename: image.filename, subfolder: image.subfolder, type: image.type }),
      });
      const result = await response.json() as { path?: string; error?: string };
      if (!response.ok || !result.path) throw new Error(result.error ?? `登记图片失败：HTTP ${response.status}`);
      return result.path;
    },
    recover: async (pending: PendingImageGeneration) => ({
      promptId: pending.promptId, createdAt: pending.createdAt, settings: pending.settings,
      images: await fetchGeneratedImages(pending.promptId, undefined, apiFetch),
    }),
    queue: async (request: QueueImageGenerationRequest) => {
      const { graph, prompt: basePrompt } = getImageWorkflow();
      const { signal, onProgress, onQueued, ...rawSettings } = request;
      const settings: ImageGenerationSettings = effectiveImageSettings(rawSettings);
      const output = patchImageGenerationPrompt(basePrompt, graph, settings);
      const workflow = patchImageWorkflow(graph, output);
      await checkImageWorkflow(workflow, signal);
      if (signal?.aborted) throw abortError();
      let promptId = "";
      await runQueuedJob(api, async () => {
        const queued = await api.queuePrompt(0, { output, workflow });
        promptId = String(queued.prompt_id ?? "");
        if (promptId) onQueued?.(promptId);
        return queued;
      }, onProgress, "自动生图任务执行失败", signal, 60_000, {
        probe: async (id) => {
          const response = await apiFetch(`/history/${encodeURIComponent(id)}`);
          if (!response.ok) throw new Error(`查询生图任务状态失败：HTTP ${response.status}`);
          return historyJobStatus(await response.json(), id);
        },
        pollMs: 2500,
      });
      if (!promptId) throw new Error("ComfyUI 没有返回生图任务 ID");
      const images = await fetchGeneratedImages(promptId, signal, apiFetch);
      return { promptId, createdAt: Date.now(), settings, images };
    },
  };

  app.registerExtension({
    name: "YuQ.Director.UI",
    beforeRegisterNodeDef(nodeType: NodeType, nodeData: { name: string }) {
      if (nodeData.name === "TheodoreDirector_PostprocessSecondPassSource") {
        const originalSourceCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function (this: ComfyNode) {
          originalSourceCreated?.apply(this);
          const requestWidget = this.widgets?.find((widget) => widget.name === "request_json");
          if (requestWidget) {
            // 请求仅由导播台在局部排队瞬间写入，画布上不开放手工编辑。
            requestWidget.type = "hidden";
            requestWidget.computeSize = () => [0, -4];
          }
          this.size = [Math.max(this.size?.[0] ?? 300, 380), 80];
        };
        return;
      }
      if (nodeData.name !== "TheodoreDirector_Project") return;
      const original = nodeType.prototype.onNodeCreated;
      nodeType.prototype.onNodeCreated = function (this: ComfyNode) {
        original?.apply(this);
        const dataWidget = this.widgets?.find((widget) => widget.name === "plan_json");
        if (!dataWidget) return;
        // JSON 仍嵌入工作流，但收起原始文本控件，日常操作只通过可视化编辑器。
        dataWidget.type = "hidden";
        dataWidget.computeSize = () => [0, -4];
        this.addWidget("button", "打开 YuQ 导播台", null, () => {
          try {
            const initial = JSON.parse(String(dataWidget.value)) as DirectorPlan;
            const workflowNodes = app.graph?._nodes ?? [];
            const supportsStandaloneSecondPass = workflowNodes.some((node) => node.type === "TheodoreDirector_PostprocessSecondPassSource")
              && workflowNodes.some((node) => node.type === "TheodoreDirector_SaveSecondPass");
            const persistPlan = (plan: DirectorPlan) => {
              dataWidget.value = JSON.stringify(plan, null, 2);
              this.setDirtyCanvas(true, true);
              app.graph?.setDirtyCanvas?.(true, true);
            };
            const supportsInlineProcessing = workflowNodes.some((node) => node.type === "TheodoreDirector_SelectShot" && node.outputs?.some((output) => ["super-res 2nd pass", "latent upscale 2nd pass", "super-res only"].includes(output.name) && output.links?.length));
            const workflowSettings = createWorkflowSettings(() => app.graph?._nodes ?? [], () => app.graph?.setDirtyCanvas?.(true, true));
            openEditor(initial, persistPlan, supportsInlineProcessing, supportsStandaloneSecondPass ? queueStandaloneSecondPass : undefined, queueFirstPass, persistPlan, imageGeneration, workflowSettings);
          } catch (error) {
            window.alert(`YuQ Director: ${error instanceof Error ? error.message : String(error)}`);
          }
        });
        this.size = [Math.max(this.size?.[0] ?? 300, 360), 110];
      };
    },
  });
});
