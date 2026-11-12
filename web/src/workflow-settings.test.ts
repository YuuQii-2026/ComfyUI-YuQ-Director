import { describe, expect, it, vi } from "vitest";
import { createWorkflowSettings, type SettingsNode } from "./workflow-settings";

function fixture() {
  const dirty = vi.fn(), callback = vi.fn();
  const nodes: SettingsNode[] = [
    { id: 124, type: "BasicScheduler", title: "一采采样参数", setDirtyCanvas: dirty, widgets: [
      { name: "steps", value: 12, options: { min: 1, max: 100 }, callback },
      { name: "scheduler", value: "simple", options: { values: ["simple", "normal"] } },
      { name: "denoise", value: 1, options: { min: 0, max: 1 } },
    ], inputs: [{ name: "denoise", link: 13 }] },
    { id: 396, type: "TheodoreDirector_Project", setDirtyCanvas: dirty, widgets: [{ name: "plan_json", value: "{}" }] },
    { id: 449, type: "LoraLoaderModelOnly", setDirtyCanvas: dirty, widgets: [{ name: "strength_model", value: 0.1, options: { min: -10, max: 10 } }] },
  ];
  const graphDirty = vi.fn();
  return { nodes, dirty, callback, graphDirty, controller: createWorkflowSettings(() => nodes, graphDirty) };
}

describe("网页生成参数与当前工作流", () => {
  it("只开放真实的生成控件，排除连线输入与原始项目 JSON", () => {
    expect(fixture().controller.read().map((field) => field.id)).toEqual(["124:steps", "124:scheduler", "449:strength_model"]);
  });
  it("应用采样与 LoRA 参数并保留回调，重新读取使用保存的值", () => {
    const f = fixture();
    f.controller.apply({ "124:steps": 8, "124:scheduler": "normal", "449:strength_model": 0.4 });
    expect(f.controller.read().map((field) => field.value)).toEqual([8, "normal", 0.4]);
    expect(f.callback).toHaveBeenCalledWith(8);
    expect(f.graphDirty).toHaveBeenCalledOnce();
    expect(f.nodes[0].widgets![2].value).toBe(1);
  });
  it.each([NaN, Infinity, 0, 101, 1.5])("错误数值 %s 使整批参数保持原状", (value) => {
    const f = fixture();
    expect(() => f.controller.apply({ "449:strength_model": 0.4, "124:steps": value })).toThrow();
    expect(f.controller.read().map((field) => field.value)).toEqual([12, "simple", 0.1]);
    expect(f.graphDirty).not.toHaveBeenCalled();
  });
  it("拒绝过期节点、错误类型和已经移除的模型选项", () => {
    const f = fixture();
    expect(() => f.controller.apply({ "124:scheduler": "removed" })).toThrow("不可用");
    expect(() => f.controller.apply({ "124:steps": "8" })).toThrow("类型");
    f.nodes.splice(0, 1);
    expect(() => f.controller.apply({ "124:steps": 8 })).toThrow("控件已变化");
  });
  it("控件回调失败时恢复全部待应用控件", () => {
    const f = fixture(); f.callback.mockImplementation(() => { throw new Error("callback failed"); });
    expect(() => f.controller.apply({ "449:strength_model": 0.4, "124:steps": 8 })).toThrow("callback failed");
    expect(f.controller.read().map((field) => field.value)).toEqual([12, "simple", 0.1]);
  });
});
