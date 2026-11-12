import { useState } from "preact/hooks";
import type { Language } from "./i18n";
import type { WorkflowField, WorkflowSettingsController } from "./workflow-settings";

const LABELS: Record<string, string> = { unet_name: "H3 主模型", weight_dtype: "模型精度", clip_name: "文本编码器", type: "编码器类型", device: "设备", vae_name: "VAE 模型", aspect_ratio: "画幅比例", megapixels: "画面大小（百万像素）", multiple: "尺寸对齐倍数", scheduler: "调度器", steps: "采样步数", denoise: "重绘强度", sampler_name: "采样算法", lora_name: "LoRA 模型", strength_model: "LoRA 强度", strength: "Turbo LoRA 强度", low_vram: "低显存模式", shift_video: "视频 Sigma Shift", shift_audio: "音频 Sigma Shift", scale: "超分倍数", scale_factor: "超分倍数", quality: "超分质量", solver: "求解器", eta: "Eta" };

export function WorkflowSettingsPanel({ controller, language, busy, notify }: { controller: WorkflowSettingsController; language: Language; busy: boolean; notify: (message: string, tone?: "info" | "error") => void }) {
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  const [fields, setFields] = useState(() => controller.read());
  const [changes, setChanges] = useState<Record<string, WorkflowField["value"]>>({});
  const groups = [...new Set(fields.map((field) => field.group))];
  const update = (field: WorkflowField, value: WorkflowField["value"]) => setChanges((previous) => {
    const next = { ...previous }; if (value === field.value) delete next[field.id]; else next[field.id] = value; return next;
  });
  const apply = () => {
    try {
      controller.apply(changes); setFields(controller.read()); setChanges({});
      notify(L("生成参数已写入当前画布；保存 ComfyUI 工作流后，重新加载也会保留。", "Generation settings applied. Save the ComfyUI workflow to retain them after reloading."));
    } catch (error) { notify(error instanceof Error ? error.message : String(error), "error"); }
  };
  return <section class="td-workflow-settings">
    <header><div><h2>{L("生成引擎", "Generation engine")}</h2><p>{L("直接调整当前工作流的模型、画幅、采样和 LoRA。应用后用于下一次生成。", "Edit the current workflow's models, framing, sampling and LoRAs for the next run.")}</p></div><button class="primary" disabled={busy || !Object.keys(changes).length} onClick={apply}>{L("应用生成参数", "Apply engine settings")}{Object.keys(changes).length ? ` (${Object.keys(changes).length})` : ""}</button></header>
    {groups.map((group) => <section key={group} class="td-workflow-group"><h3>{group}</h3><div class="td-workflow-fields">{fields.filter((field) => field.group === group).map((field) => {
      const value = changes[field.id] ?? field.value;
      return <label key={field.id}>{language === "zh" ? LABELS[field.label] ?? field.label : field.label}
        {field.choices ? <select disabled={busy} value={String(value)} onChange={(event) => update(field, event.currentTarget.value)}>{!field.choices.includes(String(value)) && <option value={String(value)}>{String(value)}</option>}{field.choices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}</select>
          : typeof field.value === "boolean" ? <input disabled={busy} type="checkbox" checked={Boolean(value)} onChange={(event) => update(field, event.currentTarget.checked)}/>
          : <input disabled={busy} type={typeof field.value === "number" ? "number" : "text"} min={field.min} max={field.max} step="any" value={String(value)} onInput={(event) => update(field, typeof field.value === "number" ? (event.currentTarget.value === "" ? NaN : Number(event.currentTarget.value)) : event.currentTarget.value)}/>}
      </label>;
    })}</div></section>)}
    {!fields.length && <p class="td-hint">{L("当前画布没有可编辑的生成控件。", "No editable engine controls in the current graph.")}</p>}
  </section>;
}
