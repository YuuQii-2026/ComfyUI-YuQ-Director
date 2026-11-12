import { describe, expect, it } from "vitest";
import { findSecondPassSchedulers, patchFirstPassPrompt, patchSecondPassDenoise, patchSecondPassPrompt, type ApiPrompt, type SecondPassPatch } from "./comfy-prompt";
import v73 from "../../workflows/YuQ导播台.json?raw";

function samplePrompt(): ApiPrompt {
  return {
    "396": { class_type: "TheodoreDirector_Project", inputs: { plan_json: "{\"old\":true}" } },
    "314": { class_type: "PrimitiveInt", inputs: { value: 4 } },
    "329": { class_type: "ImpactExecutionOrderController", inputs: { signal: ["396", 3], value: ["314", 0] } },
    "397": { class_type: "TheodoreDirector_SelectShot", inputs: { plan: ["396", 0], queue_index: ["329", 1], base_seed: ["202", 0], resume_mode: "resume" } },
    "326": { class_type: "ImpactQueueTrigger", inputs: { signal: ["325", 0], mode: ["400", 2] } },
    "129": { class_type: "RandomNoise", inputs: { noise_seed: ["397", 4] } },
    "382": { class_type: "BasicScheduler", inputs: { scheduler: "simple", steps: 3, denoise: 0.3 } },
    "383": { class_type: "SamplerCustomAdvanced", inputs: { noise: ["129", 0], sigmas: ["382", 0] } },
    "402": { class_type: "TheodoreDirector_PostprocessSecondPassSource", inputs: { request_json: "{}" } },
    "416": { class_type: "RandomNoise", inputs: { noise_seed: ["402", 6] } },
    "409": { class_type: "BasicScheduler", inputs: { scheduler: "simple", steps: 3, denoise: 0.3 } },
    "411": { class_type: "SamplerCustomAdvanced", inputs: { noise: ["416", 0], sigmas: ["409", 0] } },
  };
}

describe("一采单段 API prompt 改写", () => {
  it("写入计划与段索引，关闭续跑跳过和自动排队，且不修改原对象", () => {
    const source = samplePrompt();
    const patched = patchFirstPassPrompt(source, { planJson: "{\"new\":true}", activeIndex: 2 });
    expect(patched["396"].inputs.plan_json).toBe("{\"new\":true}");
    expect(patched["314"].inputs.value).toBe(2);
    expect(patched["397"].inputs.resume_mode).toBe("fresh");
    expect(patched["326"].inputs.mode).toBe(false);
    expect(source["314"].inputs.value).toBe(4);
    expect(source["326"].inputs.mode).toEqual(["400", 2]);
  });

  it("queue_index 为字面量时直接写入", () => {
    const source = samplePrompt();
    source["397"].inputs.queue_index = 7;
    expect(patchFirstPassPrompt(source, { planJson: "{}", activeIndex: 1 })["397"].inputs.queue_index).toBe(1);
  });

  it("缺少项目节点时给出明确错误", () => {
    const source = samplePrompt();
    delete source["396"];
    expect(() => patchFirstPassPrompt(source, { planJson: "{}", activeIndex: 0 })).toThrow("Theodore 项目");
  });
});

describe("后处理二采 denoise 覆盖", () => {
  it("只修改后处理支流的调度器", () => {
    const prompt = samplePrompt();
    expect(findSecondPassSchedulers(prompt)).toEqual(["409"]);
    expect(patchSecondPassDenoise(prompt, 0.22)).toBe(1);
    expect(prompt["409"].inputs.denoise).toBe(0.22);
    expect(prompt["382"].inputs.denoise).toBe(0.3);
  });

  it("没有后处理支流时返回 0", () => {
    const prompt = samplePrompt();
    delete prompt["402"];
    expect(patchSecondPassDenoise(prompt, 0.2)).toBe(0);
  });
});

function workflowPrompt(json: string): ApiPrompt {
  const graph = JSON.parse(json) as {
    nodes: Array<{ id: number; type: string; inputs?: Array<{ name: string; link?: number | null }> }>;
    links: Array<[number, number, number, number, number, string]>;
  };
  const links = new Map(graph.links.map((link) => [link[0], link]));
  return Object.fromEntries(graph.nodes.filter((node) => node.type !== "MarkdownNote").map((node) => [String(node.id), {
    class_type: node.type,
    inputs: Object.fromEntries((node.inputs ?? []).filter((input) => input.link != null).map((input) => {
      const link = links.get(input.link!)!;
      return [input.name, [String(link[1]), link[2]]];
    })),
  }]));
}

describe.each([["V7.3", v73]])("%s 二采任务隔离", (_version, json) => {
  it.each(["super_resolution_second_pass", "latent_upscale_second_pass", "super_resolution_only"] as const)("%s 只保留所选处理支流和唯一保存出口", (processingMode) => {
    const source = workflowPrompt(json);
    const before = JSON.stringify(source);
    const requestJson = JSON.stringify({ processingMode, requestId: "test", sourcePath: "selected.mp4" });
    const output = patchSecondPassPrompt(source, { sourceId: "402", targetId: "414", requestJson, processingMode, denoise: 0.22 });
    const ids = (type: string) => Object.keys(output).filter((id) => output[id].class_type === type);
    // 即使服务端忽略局部执行选项，也没有额外输出节点和自动续排链可执行。
    expect(ids("TheodoreDirector_SaveSecondPass")).toEqual(["414"]);
    for (const type of ["SaveVideo", "SaveImageKJ", "PreviewImage", "ImpactQueueTrigger", "ImpactSetWidgetValue", "TheodoreDirector_CommitResult", "TheodoreDirector_Project", "TheodoreDirector_SelectShot"]) {
      expect(ids(type)).toEqual([]);
    }
    expect(ids("SamplerCustomAdvanced")).toEqual(processingMode === "super_resolution_only" ? [] : processingMode === "super_resolution_second_pass" ? ["411"] : ["439"]);
    expect(ids("RTXVideoSuperResolution")).toEqual(processingMode === "latent_upscale_second_pass" ? [] : ["404"]);
    expect(ids("MinimaxH3LatentUpscaler3D")).toEqual(processingMode === "latent_upscale_second_pass" ? ["431"] : []);
    expect(output["402"].inputs.request_json).toBe(requestJson);
    if (processingMode === "super_resolution_only") {
      expect(ids("BasicScheduler")).toEqual([]);
      expect(ids("MiniMaxH3ReferenceToVideo")).toEqual([]);
    } else {
      expect(output["409"].inputs.denoise).toBe(0.22);
    }
    for (const node of Object.values(output)) {
      for (const input of Object.values(node.inputs)) {
        if (Array.isArray(input)) expect(output[String(input[0])]).toBeDefined();
      }
    }
    expect(JSON.stringify(source)).toBe(before);
  });
});

describe("二采错误拓扑", () => {
  const patch: SecondPassPatch = { sourceId: "402", targetId: "414", requestJson: "{}", processingMode: "super_resolution_second_pass" };
  it("依赖丢失时中止，不提交残缺任务", () => {
    const source = workflowPrompt(v73);
    delete source["404"];
    expect(() => patchSecondPassPrompt(source, patch)).toThrow("依赖节点 404 不存在");
  });
  it("二采误连主循环时中止", () => {
    const source = workflowPrompt(v73);
    source["414"].inputs.video = ["400", 0];
    expect(() => patchSecondPassPrompt(source, patch)).toThrow("主循环节点");
  });
  it("保存端没有源依赖时中止", () => {
    const source = workflowPrompt(v73);
    source["414"].inputs = {};
    expect(() => patchSecondPassPrompt(source, patch)).toThrow("未连接到所选源节点");
  });
});
