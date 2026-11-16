import { describe, expect, it } from "vitest";
import { findSecondPassSchedulers, patchCanvasImagePrompt, patchFirstPassPrompt, patchSecondPassDenoise, patchSecondPassPrompt, type ApiPrompt, type SecondPassPatch } from "./comfy-prompt";
import yuqWorkflow from "../../workflows/YuQ导播台.json?raw";

describe("latent 中间阶段诊断", () => {
  it("records both latent boundaries without cycles and retains only the selected branch", () => {
    const graph = workflowPrompt(yuqWorkflow);
    graph["431"].inputs.precision = "fp16";
    Object.assign(graph["402"].inputs, { diagnose_latent: true, latent_full_sequence: true });
    const output = patchSecondPassPrompt(graph, { sourceId: "402", targetId: "414", requestJson: '{"relayVersion":1}', processingMode: "latent_upscale_second_pass" });
    expect(output["431"].inputs.enable_temporal_chunking).toBe(false);
    expect(output["431"].inputs.precision).toBe("fp32");
    expect(output.yuq_probe_before_431.inputs).toEqual({ latent: ["430", 0], request: ["402", 2], stage: "encoded" });
    expect(output["431"].inputs.latent).toEqual(["yuq_probe_before_431", 0]);
    expect(output.yuq_probe_after_431.inputs.latent).toEqual(["431", 0]);
    expect(Object.values(output).filter(n => n.class_type === "TheodoreDirector_LatentProbe")).toHaveLength(2);
    expect(output["404"]).toBeUndefined();
    expect(graph["431"].inputs.precision).toBe("fp16");
    const walk = (id: string, seen = new Set<string>()) => {
      expect(seen.has(id)).toBe(false);
      for (const v of Object.values(output[id].inputs)) if (Array.isArray(v)) walk(String(v[0]), new Set([...seen, id]));
    };
    walk("414");
  });
});

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
    nodes: Array<{ id: number; type: string; widgets_values_named?: Record<string, unknown>; inputs?: Array<{ name: string; link?: number | null }> }>;
    links: Array<[number, number, number, number, number, string]>;
  };
  const links = new Map(graph.links.map((link) => [link[0], link]));
  return Object.fromEntries(graph.nodes.filter((node) => node.type !== "MarkdownNote").map((node) => [String(node.id), {
    class_type: node.type,
    inputs: { ...Object.fromEntries(Object.entries(node.widgets_values_named ?? {}).filter(([, value]) => !Array.isArray(value))), ...Object.fromEntries((node.inputs ?? []).filter((input) => input.link != null).map((input) => {
      const link = links.get(input.link!)!;
      return [input.name, [String(link[1]), link[2]]];
    })) },
  }]));
}

describe.each([["YuQ 导播台", yuqWorkflow]])("%s 二采任务隔离", (_version, json) => {
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

describe("二采接力提交", () => {
  it.each(["super_resolution_second_pass", "latent_upscale_second_pass", "super_resolution_only"] as const)("%s 覆盖所选支路的倍率", (processingMode) => {
    const source = workflowPrompt(yuqWorkflow);
    const output = patchSecondPassPrompt(source, { sourceId: "402", targetId: "414", processingMode, requestJson: "{}", scale: 1.6 });
    if (processingMode === "latent_upscale_second_pass") {
      expect(output["431"].inputs["mode.scale"]).toBe(1.6);
      expect(output["432"].inputs.scale_by).toBe(1.6);
    } else expect(output["404"].inputs["resize_type.scale"]).toBe(1.6);
    expect(source["404"].inputs["resize_type.scale"]).not.toBe(1.6);
    const other = patchSecondPassPrompt(source, { sourceId: "402", targetId: "414", processingMode, requestJson: "{}", scale: 1.8 });
    expect(JSON.stringify(output)).not.toBe(JSON.stringify(other));
  });
  it("不支持倍率的支路明确报错", () => {
    const source = workflowPrompt(yuqWorkflow);
    source["404"].inputs.resize_type = "other";
    expect(() => patchSecondPassPrompt(source, { sourceId: "402", targetId: "414", processingMode: "super_resolution_second_pass", requestJson: "{}", scale: 1.6 })).toThrow("倍率模式");
  });
  it.each(["super_resolution_second_pass", "latent_upscale_second_pass"] as const)("%s 带入对应接力和裁切节点", (processingMode) => {
    const source = workflowPrompt(yuqWorkflow);
    const output = patchSecondPassPrompt(source, { sourceId: "402", targetId: "414", processingMode,
      requestJson: JSON.stringify({ relayVersion: 1 }), denoise: 0.25 });
    const count = (type: string) => Object.values(output).filter((n) => n.class_type === type).length;
    expect(count("TheodoreDirector_SecondPassRelay")).toBe(1);
    expect(count("TheodoreDirector_SecondPassFinalize")).toBe(1);
    expect(output["415"].inputs.length).toEqual(["402", 13]);
    expect(output["413"].inputs.audio).toEqual(["402", 14]);
    expect(count("SamplerCustomAdvanced")).toBe(1);
  });
  it.each(["super_resolution_second_pass", "latent_upscale_second_pass"] as const)("旧画布 %s 在局部任务中接入接力，保留画布对象", (processingMode) => {
    const source = workflowPrompt(yuqWorkflow);
    source["408"].inputs.conditioning = ["415", 0];
    source["438"].inputs.conditioning = ["432", 0];
    source["441"].inputs.tt_value = ["412", 0];
    source["442"].inputs.tt_value = ["440", 0];
    source["415"].inputs.length = ["403", 1];
    source["413"].inputs.audio = ["402", 4];
    source["405"].inputs.pixels = ["404", 0];
    source["411"].inputs.latent_image = ["407", 0];
    source["439"].inputs.latent_image = ["437", 0];
    source["412"].inputs.samples = ["411", 0];
    source["440"].inputs.samples = ["439", 0];
    delete source["624"];
    for (const id of ["620", "621", "622", "623", "653", "654"]) delete source[id];
    const before = JSON.stringify(source);
    const output = patchSecondPassPrompt(source, { sourceId: "402", targetId: "414", processingMode,
      requestJson: JSON.stringify({ relayVersion: 1 }), denoise: 0.25 });
    const latent = processingMode === "latent_upscale_second_pass";
    const sampler = latent ? "439" : "411", relay = `yuq_relay_${sampler}`, finalize = `yuq_finalize_${sampler}`;
    expect(output[relay].inputs.latent).toEqual([latent ? "437" : "407", 0]);
    expect(output[relay].inputs.audio_latent).toEqual(["406", 0]);
    expect(output[sampler].inputs.latent_image).toEqual([relay, 1]);
    expect(output[`yuq_guide_${sampler}`].inputs.conditioning).toEqual([relay, 0]);
    expect(output[finalize].inputs.audio_latent).toEqual(["406", 0]);
    expect(output[finalize].inputs.vae).toEqual(["119", 0]);
    expect(output[latent ? "442" : "441"].inputs.tt_value).toEqual([finalize, 0]);
    expect(output[latent ? "yuq_relay_411" : "yuq_relay_439"]).toBeUndefined();
    if (!latent) {
      expect(output["405"].inputs.pixels).toEqual(["yuq_align_405", 0]);
      expect(output.yuq_align_405.inputs.images).toEqual(["404", 0]);
    }
    for (const node of Object.values(output)) for (const value of Object.values(node.inputs)) {
      if (Array.isArray(value)) expect(output[String(value[0])]).toBeDefined();
    }
    expect(JSON.stringify(source)).toBe(before);
  });
});

describe("二采错误拓扑", () => {
  const patch: SecondPassPatch = { sourceId: "402", targetId: "414", requestJson: "{}", processingMode: "super_resolution_second_pass" };
  it("依赖丢失时中止，不提交残缺任务", () => {
    const source = workflowPrompt(yuqWorkflow);
    delete source["404"];
    expect(() => patchSecondPassPrompt(source, patch)).toThrow("依赖节点 404 不存在");
  });
  it("二采误连主循环时中止", () => {
    const source = workflowPrompt(yuqWorkflow);
    source["414"].inputs.video = ["400", 0];
    expect(() => patchSecondPassPrompt(source, patch)).toThrow("主循环节点");
  });
  it("保存端没有源依赖时中止", () => {
    const source = workflowPrompt(yuqWorkflow);
    source["414"].inputs = {};
    expect(() => patchSecondPassPrompt(source, patch)).toThrow("未连接到所选源节点");
  });
});

describe("画布内置控制与生图任务", () => {
  const imageSettings = { positivePrompt: "portrait", negativePrompt: "text", width: 512, height: 768, batchSize: 2, seed: 88, filenamePrefix: "TheodoreDirector/ImageGen/demo/portrait" };

  it("一采只执行所选项目，直接设置索引，不运行生图和后处理", () => {
    const source = workflowPrompt(yuqWorkflow);
    const before = JSON.stringify(source);
    const output = patchFirstPassPrompt(source, { projectId: "396", planJson: "{}", activeIndex: 4 });
    expect(output["450"].inputs.queue_index).toBe(4);
    expect(output["400"]).toBeDefined();
    expect(Object.values(output).some((n) => ["TheodoreDirector_ImageControls", "TheodoreDirector_SaveSecondPass", "ImpactQueueTrigger"].includes(n.class_type))).toBe(false);
    expect(JSON.stringify(source)).toBe(before);
  });

  it("旧节点使用项目基础种子，忽略手工改名和编号", () => {
    const source = samplePrompt();
    expect(patchFirstPassPrompt(source, { planJson: "{}", activeIndex: 0, baseSeed: 42 })["397"].inputs.base_seed).toBe(42);
    const renamed: ApiPrompt = { p: { class_type: "TheodoreDirector_Project", inputs: {} }, ctrl: { class_type: "TheodoreDirector_ShotControl", inputs: { plan: ["p", 0] } }, result: { class_type: "TheodoreDirector_CommitResult", inputs: { shot: ["ctrl", 0] } } };
    expect(patchFirstPassPrompt(renamed, { projectId: "p", planJson: "{}", activeIndex: 2 }).ctrl.inputs.queue_index).toBe(2);
  });

  it("生图保留自定义 LoRA、采样器和后处理参数，并隔离视频链", () => {
    const source = workflowPrompt(yuqWorkflow);
    const samplerId = Object.keys(source).find((id) => source[id].class_type === "CFGGuider")!;
    const sampler = source[samplerId];
    source.custom = { class_type: "CustomLoraStack", inputs: { model: sampler.inputs.model, strength: 0.73 } };
    sampler.inputs.model = ["custom", 0]; sampler.inputs.cfg = 4.5;
    source.other = { class_type: "TheodoreDirector_Project", inputs: {} };
    source.otherImage = { class_type: "TheodoreDirector_ImageControls", inputs: { plan: ["other", 0] } };
    const before = JSON.stringify(source);
    const { output, targetId } = patchCanvasImagePrompt(source, "396", imageSettings);
    expect(output["480"].inputs).toMatchObject({ positive_prompt: "portrait", width: 512, batch_size: 2, seed: 88 });
    expect(output.custom.inputs.strength).toBe(0.73);
    expect(output[samplerId].inputs).toMatchObject({ cfg: 4.5, model: ["custom", 0] });
    expect(output[targetId].class_type).toBe("SaveImage");
    expect(output.otherImage).toBeUndefined();
    expect(output["450"]).toBeUndefined(); expect(output["400"]).toBeUndefined();
    expect(JSON.stringify(source)).toBe(before);
  });

  it("Qwen enhancement off prunes its model and on preserves the enhancement input", () => {
    const source = workflowPrompt(yuqWorkflow);
    const toggle = Object.values(source).find((node) => node.class_type === "ComfySwitchNode")!;
    toggle.inputs.switch = false;
    const disabled = patchCanvasImagePrompt(source, "396", imageSettings).output;
    expect(Object.values(disabled).some((node) => node.class_type === "TextGenerate")).toBe(false);
    expect(Object.values(disabled).filter((node) => node.class_type === "CLIPLoader")).toHaveLength(1);
    expect(Object.values(disabled).find((node) => node.class_type === "TextEncodeQwenImage21")!.inputs.prompt).toEqual(["480", 0]);
    toggle.inputs.switch = true;
    const enabled = patchCanvasImagePrompt(source, "396", imageSettings).output;
    const enhancer = Object.values(enabled).find((node) => node.class_type === "TextGenerate")!;
    expect(enhancer.inputs.prompt).toEqual(["480", 0]);
    expect(enhancer.inputs["sampling_mode.seed"]).toEqual(["480", 5]);
    expect(Object.values(enabled).filter((node) => node.class_type === "CLIPLoader")).toHaveLength(2);
    expect(Object.values(enabled).find((node) => node.class_type === "ManualSigmas")!.inputs.sigmas).toBe(Object.values(disabled).find((node) => node.class_type === "ManualSigmas")!.inputs.sigmas);
  });

  it("生图出口断线、重复控制、误接输出时给出错误", () => {
    const source = workflowPrompt(yuqWorkflow);
    const saver = Object.values(source).find((n) => n.class_type === "SaveImage")!;
    saver.inputs.filename_prefix = "other";
    expect(() => patchCanvasImagePrompt(source, "396", imageSettings)).toThrow("SaveImage");
    source.duplicate = { class_type: "TheodoreDirector_ImageControls", inputs: { plan: ["396", 0] } };
    expect(() => patchCanvasImagePrompt(source, "396", imageSettings)).toThrow("找到 2 个");
  });
});
