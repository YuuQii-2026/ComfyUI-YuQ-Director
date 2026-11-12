/** 网页编辑当前画布中的真实控件；字段按节点类型筛选，连线输入保持由上游管理。 */
export interface GraphWidget {
  name: string;
  value: unknown;
  options?: { values?: unknown; min?: number; max?: number; step?: number };
  callback?: (value: unknown) => void;
}
export interface SettingsNode {
  id?: string | number;
  type?: string;
  title?: string;
  widgets?: GraphWidget[];
  inputs?: Array<{ name: string; link?: number | null }>;
  setDirtyCanvas: (foreground: boolean, background: boolean) => void;
}
export interface WorkflowField {
  id: string;
  group: string;
  label: string;
  value: string | number | boolean;
  choices?: string[];
  min?: number;
  max?: number;
}
export interface WorkflowSettingsController {
  read: () => WorkflowField[];
  apply: (changes: Record<string, string | number | boolean>) => void;
}

const FIELDS: Record<string, string[]> = {
  UNETLoader: ["unet_name", "weight_dtype"],
  CLIPLoader: ["clip_name", "type", "device"],
  VAELoader: ["vae_name"],
  ResolutionSelector: ["aspect_ratio", "megapixels", "multiple"],
  BasicScheduler: ["scheduler", "steps", "denoise"],
  KSamplerSelect: ["sampler_name"],
  MiniMaxH3TurboSampler: ["solver", "sampler_name", "eta"],
  MiniMaxH3TurboLoRA: ["lora_name", "strength", "low_vram"],
  LoraLoaderModelOnly: ["lora_name", "strength_model"],
  MiniMaxH3SigmaShift: ["shift_video", "shift_audio"],
  RTXVideoSuperResolution: ["scale", "scale_factor", "quality"],
};

function choices(widget: GraphWidget): string[] | undefined {
  const values = widget.options?.values;
  return Array.isArray(values) && values.every((value) => typeof value === "string") ? values : undefined;
}

export function createWorkflowSettings(getNodes: () => SettingsNode[], markDirty: () => void): WorkflowSettingsController {
  const entries = () => getNodes().flatMap((node) => (node.widgets ?? [])
    .filter((widget) => FIELDS[node.type ?? ""]?.includes(widget.name) && !node.inputs?.some((input) => input.name === widget.name && input.link != null)
      && ["string", "number", "boolean"].includes(typeof widget.value))
    .map((widget) => ({ node, widget, id: `${node.id}:${widget.name}` })));
  return {
    read: () => entries().map(({ node, widget, id }) => ({
      id, group: `${node.title || node.type} · #${node.id}`, label: widget.name,
      value: widget.value as WorkflowField["value"], choices: choices(widget), min: widget.options?.min, max: widget.options?.max,
    })),
    apply: (changes) => {
      const available = new Map(entries().map((entry) => [entry.id, entry]));
      // 先完整校验，再修改控件，避免输入错误时留下半套参数。
      const updates = Object.entries(changes).map(([id, value]) => {
        const entry = available.get(id);
        if (!entry) throw new Error(`配置控件已变化，请重新打开项目配置：${id}`);
        const { widget } = entry;
        if (typeof value !== typeof widget.value) throw new Error(`${widget.name} 的值类型不正确`);
        if (typeof value === "number" && ["steps", "multiple"].includes(widget.name) && !Number.isInteger(value)) throw new Error(`${widget.name} 必须为整数`);
        if (typeof value === "number" && (!Number.isFinite(value) || (widget.options?.min != null && value < widget.options.min) || (widget.options?.max != null && value > widget.options.max))) throw new Error(`${widget.name} 超出可用范围`);
        const options = choices(widget);
        if (options && !options.includes(String(value))) throw new Error(`${widget.name} 的选项不可用：${value}`);
        return { ...entry, value, previous: widget.value };
      });
      try {
        for (const { widget, value } of updates) { widget.value = value; widget.callback?.(value); }
      } catch (error) {
        for (const { widget, previous } of updates) widget.value = previous;
        throw error;
      }
      for (const { node } of updates) node.setDirtyCanvas(true, true);
      if (updates.length) markDirty();
    },
  };
}
