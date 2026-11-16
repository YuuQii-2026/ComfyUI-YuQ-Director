import { describe, expect, it } from "vitest";
import { materializeVideoContext, repairVideoContextTypes, VIDEO_CONTEXT_OPTIONS, type ContextGraph } from "./context-link";
import { patchFirstPassPrompt, type ApiPrompt } from "./comfy-prompt";
import workflowText from "../../workflows/YuQ导播台.json?raw";

function prompt(frames = 22): ApiPrompt {
  return {
    project: { class_type: "TheodoreDirector_Project", inputs: { plan_json: JSON.stringify({ continuity: { videoContextFrames: frames } }) } },
    control: { class_type: "TheodoreDirector_ShotControl", inputs: { plan: ["project", 0], queue_index: 0 } },
    relay: { class_type: "MiniMaxH3MotionContext", inputs: { context_length: ["control", 13], audio_context_length: ["control", 14] } },
    result: { class_type: "TheodoreDirector_CommitResult", inputs: { shot: ["control", 0], signal: ["relay", 0] } },
  };
}

describe("接力最终提交兼容", () => {
  it.each([5, 22, 39, 56])("%s 帧作为合法选项值提交，音频接力保持连接", (frames) => {
    const source = prompt(frames);
    const snapshot = JSON.stringify(source);
    const queued = materializeVideoContext(source);
    expect(queued.relay.inputs.context_length).toBe(String(frames));
    expect(queued.relay.inputs.audio_context_length).toEqual(["control", 14]);
    expect(JSON.stringify(source)).toBe(snapshot);
  });

  it("导播台使用本次提交的计划，连续修改配置后不会沿用上一轮值", () => {
    const source = prompt();
    for (const frames of [39, 5, 56]) {
      const patched = patchFirstPassPrompt(source, { projectId: "project", activeIndex: 1, planJson: JSON.stringify({ continuity: { videoContextFrames: frames } }) });
      expect(materializeVideoContext(patched).relay.inputs.context_length).toBe(String(frames));
    }
    expect(source.relay.inputs.context_length).toEqual(["control", 13]);
  });

  it("逐一读取多个项目自己的配置", () => {
    const source = prompt(5);
    source.otherProject = { class_type: "TheodoreDirector_Project", inputs: { plan_json: '{"continuity":{"videoContextFrames":56}}' } };
    source.otherControl = { class_type: "TheodoreDirector_ShotControl", inputs: { plan: ["otherProject", 0] } };
    source.otherRelay = { class_type: "MiniMaxH3MotionContext", inputs: { context_length: ["otherControl", 13] } };
    const queued = materializeVideoContext(source);
    expect(queued.relay.inputs.context_length).toBe("5");
    expect(queued.otherRelay.inputs.context_length).toBe("56");
  });

  it("手工字面值、其他输出和自定义来源保持原值", () => {
    for (const value of ["39", ["control", 2], ["custom", 13]]) {
      const source = prompt(); source.relay.inputs.context_length = value;
      expect(materializeVideoContext(source)).toBe(source);
    }
  });

  it("旧计划使用默认22帧，无效配置中止提交", () => {
    const source = prompt(); source.project.inputs.plan_json = "{}";
    expect(materializeVideoContext(source).relay.inputs.context_length).toBe("22");
    source.project.inputs.plan_json = "broken";
    expect(() => materializeVideoContext(source)).toThrow("保存导播台项目");
    for (const frames of [0, 18, 23, 22.5, "22"]) {
      source.project.inputs.plan_json = JSON.stringify({ continuity: { videoContextFrames: frames } });
      expect(() => materializeVideoContext(source)).toThrow("只能为");
    }
  });
});

describe("工作流加载恢复端口类型", () => {
  it("发布工作流的来源、目标和连线都保存正确类型", () => {
    const graph = JSON.parse(workflowText);
    const nodes = new Map<number, any>(graph.nodes.map((node: any) => [node.id, node]));
    const link = graph.links.find((link: any) => nodes.get(link[1])?.outputs?.[link[2]]?.name === "video_context");
    expect(nodes.get(link[1]).outputs[link[2]].type).toEqual(VIDEO_CONTEXT_OPTIONS);
    expect(nodes.get(link[3]).inputs[link[4]].type).toEqual(VIDEO_CONTEXT_OPTIONS);
    expect(link[5]).toEqual(VIDEO_CONTEXT_OPTIONS);
  });

  it("旧工作流保存再加载仍可恢复，配置和连接编号保持原值", () => {
    const graph = JSON.parse(workflowText);
    const source = graph.nodes.find((node: any) => node.type === "TheodoreDirector_ShotControl");
    source.outputs[13].type = "COMBO";
    const link = graph.links.find((link: any) => link[1] === source.id && link[2] === 13);
    const target = graph.nodes.find((node: any) => node.id === link[3]);
    target.inputs[link[4]].type = "COMBO"; link[5] = "COMBO";
    const plan = graph.nodes.find((node: any) => node.type === "TheodoreDirector_Project").widgets_values[0];
    repairVideoContextTypes(graph);
    expect(source.outputs[13].type).toEqual(VIDEO_CONTEXT_OPTIONS);
    expect(target.inputs[link[4]].type).toEqual(VIDEO_CONTEXT_OPTIONS);
    expect(link.slice(0, 5)).toEqual([464, 450, 13, 389, 7]);
    const saved = JSON.parse(JSON.stringify(graph));
    repairVideoContextTypes(saved);
    expect(saved).toEqual(graph);
    expect(saved.nodes.find((node: any) => node.type === "TheodoreDirector_Project").widgets_values[0]).toBe(plan);
  });

  it("实际画布以对象保存连线时也会修正", () => {
    const graph = JSON.parse(workflowText);
    const live: ContextGraph = { _nodes: graph.nodes, links: Object.fromEntries(graph.links.map((link: any) => [link[0], { origin_id: link[1], origin_slot: link[2], target_id: link[3], target_slot: link[4], type: "COMBO" }])) };
    repairVideoContextTypes(live);
    expect((live.links as Record<number, any>)[464].type).toEqual(VIDEO_CONTEXT_OPTIONS);
    expect((live.links as Record<number, any>)[465].type).toBe("COMBO");
  });
});
