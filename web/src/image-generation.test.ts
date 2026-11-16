import { describe, expect, it } from "vitest";
import imageWorkflowText from "../../workflows/image-generation.json?raw";
import {
  effectiveImageSettings, generatedAsset, historyJobStatus, imagesFromHistory,
  fetchImageModelOptions, imageWorkflowDefaults, missingImageAssets, patchImageGenerationPrompt, patchImageWorkflow, splitImagePrompt, uiWorkflowToApiPrompt, validateImageGenerationSettings,
  type ImageGenerationSettings, type ImageWorkflowGraph,
} from "./image-generation";

function fixture(): ImageWorkflowGraph {
  const node = (id: number, type: string, inputs: Array<{ name: string; link?: number | null }> = [], outputs: Array<{ type?: string }> = [], widgets_values: unknown[] = [], widgets_values_named: Record<string, unknown> = {}) => ({ id, type, inputs, outputs, widgets_values, widgets_values_named });
  const nodes = [
    node(16, "UNETLoader", [], [{ type: "MODEL" }], ["unet.safetensors", "default"], { unet_name: "unet.safetensors", weight_dtype: "default" }),
    { ...node(11, "ModelSamplingAuraFlow", [{ name: "model", link: 42 }], [{ type: "MODEL" }], [3], { shift: 3 }), mode: 4 },
    node(18, "CLIPLoader", [], [{ type: "CLIP" }], ["clip.safetensors", "lumina2", "default"], { clip_name: "clip.safetensors", type: "lumina2", device: "default" }),
    node(6, "CLIPTextEncode", [{ name: "clip", link: 43 }], [{ type: "CONDITIONING" }], ["example prompt", ["front-end-only"]], { text: "example prompt", speak_and_recognation: ["front-end-only"] }),
    node(7, "CLIPTextEncode", [{ name: "clip", link: 44 }], [{ type: "CONDITIONING" }], ["blurry"], { text: "blurry" }),
    node(13, "EmptySD3LatentImage", [], [{ type: "LATENT" }], [1024, 1024, 1], { width: 1024, height: 1024, batch_size: 1 }),
    node(3, "KSampler", [{ name: "model", link: 47 }, { name: "positive", link: 4 }, { name: "negative", link: 6 }, { name: "latent_image", link: 17 }], [{ type: "LATENT" }], [123, "randomize", 12, 1, "euler", "simple", 1], { seed: 123, control_after_generate: "randomize", steps: 12, cfg: 1, sampler_name: "euler", scheduler: "simple", denoise: 1 }),
    node(17, "VAELoader", [], [{ type: "VAE" }], ["ae.safetensors"], { vae_name: "ae.safetensors" }),
    node(8, "VAEDecode", [{ name: "samples", link: 51 }, { name: "vae", link: 45 }], [{ type: "IMAGE" }]),
    node(9, "SaveImage", [{ name: "images", link: 16 }], [{ type: "IMAGE" }], ["ComfyUI"], { filename_prefix: "ComfyUI" }),
    node(15, "Note", [], [], ["ignored"]),
  ];
  return { nodes, links: [
    [42, 16, 0, 11, 0, "MODEL"], [47, 11, 0, 3, 0, "MODEL"],
    [43, 18, 0, 6, 0, "CLIP"], [44, 18, 0, 7, 0, "CLIP"],
    [4, 6, 0, 3, 1, "CONDITIONING"], [6, 7, 0, 3, 2, "CONDITIONING"],
    [17, 13, 0, 3, 3, "LATENT"], [45, 17, 0, 8, 1, "VAE"],
    [51, 3, 0, 8, 0, "LATENT"], [16, 8, 0, 9, 0, "IMAGE"],
  ] };
}

const settings = (positivePrompt = "清晨的山间小屋") => ({
  positivePrompt, negativePrompt: "模糊", width: 1024, height: 1024, steps: 12,
  cfg: 1, batchSize: 1, seed: 123, filenamePrefix: "TheodoreDirector/ImageGen/test/asset_1",
}) satisfies ImageGenerationSettings;

describe("image generation workflow", () => {
  it("loads model choices from the connected server without losing subfolder names", async () => {
    const fetcher = async (url: string | URL | Request) => {
      const type = String(url).split("/").at(-1)!;
      const required = type === "UNETLoader" ? { unet_name: [["folder/new.safetensors", "folder/new.safetensors"]] }
        : type === "CLIPLoader" ? { clip_name: [["clip/new.safetensors"]], type: [["lumina2", "flux"]] }
        : { vae_name: [["vae/new.safetensors"]] };
      return new Response(JSON.stringify({ [type]: { input: { required } } }));
    };
    expect(await fetchImageModelOptions(fetcher)).toEqual({ unetName: ["folder/new.safetensors"], clipName: ["clip/new.safetensors"], vaeName: ["vae/new.safetensors"], clipType: ["lumina2", "flux"] });
    await expect(fetchImageModelOptions(async () => new Response("{}", { status: 503 }))).rejects.toThrow("HTTP 503");
    await expect(fetchImageModelOptions(async () => new Response("{}"))).rejects.toThrow("没有可用选项");
  });
  it("patches model files in both the actual API job and saved workflow without mutating the source", () => {
    const graph = fixture();
    const before = JSON.stringify(graph);
    const source = uiWorkflowToApiPrompt(graph);
    const selected = { ...settings(), unetName: "folder/new.safetensors", clipName: "clip/new.safetensors", vaeName: "vae/new.safetensors", clipType: "flux" };
    const patched = patchImageGenerationPrompt(source, graph, selected);
    const workflow = patchImageWorkflow(graph, patched);
    expect(patched["16"].inputs.unet_name).toBe(selected.unetName);
    expect(patched["18"].inputs).toMatchObject({ clip_name: selected.clipName, type: "flux" });
    expect(patched["17"].inputs.vae_name).toBe(selected.vaeName);
    expect(imageWorkflowDefaults(workflow)).toMatchObject({ unetName: selected.unetName, clipName: selected.clipName, vaeName: selected.vaeName, clipType: selected.clipType, width: selected.width, steps: selected.steps });
    expect(JSON.stringify(graph)).toBe(before);
    expect(source["16"].inputs.unet_name).toBe("unet.safetensors");
  });
  it("把 UI 工作流转换为只含有效依赖的 API prompt 并替换示例提示词", () => {
    const graph = fixture();
    const api = uiWorkflowToApiPrompt(graph);
    const patched = patchImageGenerationPrompt(api, graph, settings());
    expect(Object.keys(api)).not.toContain("15");
    expect(Object.keys(api)).not.toContain("11");
    expect(patched["6"].inputs.text).toContain("清晨的山间小屋");
    expect(patched["6"].inputs.text).not.toContain("example prompt");
    expect(JSON.stringify(patched)).not.toContain("speak_and_recognation");
    expect(patched["3"].inputs).not.toHaveProperty("control_after_generate");
    expect(patched["3"].inputs.model).toEqual(["16", 0]);
  });

  it("Qwen Turbo uses the source eight-step schedule without requiring the optional enhancer", () => {
    const graph = JSON.parse(imageWorkflowText) as ImageWorkflowGraph;
    const before = JSON.stringify(graph);
    const defaults = imageWorkflowDefaults(graph);
    expect(defaults).toMatchObject({ width: 1024, height: 1024, steps: 8, cfg: 1, clipType: "qwen_image", fixedSteps: true });
    expect(defaults.unetName).toBe("qwen_image_2.1_turbo_int8_convrot.safetensors");
    expect(defaults.clipName).toBe("qwen3vl/qwen3vl_8b_fp8_scaled.safetensors");
    const api = uiWorkflowToApiPrompt(graph);
    expect(Object.values(api).some((node) => node.class_type === "TextGenerate")).toBe(false);
    expect(Object.values(api).filter((node) => node.class_type === "CLIPLoader")).toHaveLength(1);
    expect(Object.values(api).find((node) => node.class_type === "ManualSigmas")?.inputs.sigmas).toBe("1.0, 0.978453, 0.95418, 0.926626, 0.89508, 0.845148, 0.704534, 0.414568, 0");
    const patched = patchImageGenerationPrompt(api, graph, { ...settings(), width: 1536, height: 1024, batchSize: 3, seed: 42 });
    const byType = (type: string) => Object.values(patched).find((node) => node.class_type === type)!;
    expect(byType("TextEncodeQwenImage21").inputs.prompt).toContain("清晨的山间小屋");
    expect(byType("TextEncodeQwenImage21").inputs.negative_prompt).toContain("模糊");
    expect(byType("EmptyLatentImage").inputs).toMatchObject({ width: 1536, height: 1024, batch_size: 3 });
    expect(byType("RandomNoise").inputs.noise_seed).toBe(42);
    expect(byType("ManualSigmas").inputs).toEqual(Object.values(api).find((node) => node.class_type === "ManualSigmas")!.inputs);
    expect(byType("SaveImage").inputs.filename_prefix).toBe(settings().filenamePrefix);
    expect(JSON.stringify(patched)).not.toContain("speak_and_recognation");
    expect(JSON.stringify(graph)).toBe(before);
  });

  it("Qwen's optional enhancer preserves its system prompt and receives the same prompt and seed", () => {
    const graph = JSON.parse(imageWorkflowText) as ImageWorkflowGraph;
    const toggle = graph.nodes.find((node) => node.type === "ComfySwitchNode")!;
    toggle.widgets_values_named!.switch = true;
    toggle.widgets_values![0] = true;
    const api = patchImageGenerationPrompt(uiWorkflowToApiPrompt(graph), graph, { ...settings(), seed: 77 });
    const enhancer = Object.values(api).find((node) => node.class_type === "TextGenerate")!;
    expect(enhancer.inputs.prompt).toContain("清晨的山间小屋");
    expect(enhancer.inputs["sampling_mode.seed"]).toBe(77);
    expect(enhancer.inputs.thinking).toBe(false);
    expect(Object.values(api).filter((node) => node.class_type === "CLIPLoader")).toHaveLength(2);
    const restored = patchImageWorkflow(graph, api);
    expect(restored.nodes.find((node) => node.type === "TextGenerate")!.widgets_values_named!.prompt).toContain("清晨的山间小屋");
    expect(Object.values(api).find((node) => node.class_type === "TextEncodeQwenImage21")!.inputs.prompt).toEqual([String(graph.nodes.find((node) => node.type === "TextGenerate")!.id), 0]);
  });

  it("无文字约束固定追加且提示词能分开保存", () => {
    const value = effectiveImageSettings(settings());
    expect(value.positivePrompt).toContain("无文字、字幕");
    expect(value.negativePrompt).toContain("subtitles");
    expect(effectiveImageSettings(value).positivePrompt).toBe(value.positivePrompt);
    expect(splitImagePrompt("雾中松林\nNegative prompt: text, logo")).toEqual({ positive: "雾中松林", negative: "text, logo" });
  });

  it("支持单张到四张的批量生成并拒绝超出上限", () => {
    expect(() => validateImageGenerationSettings({ ...settings(), positivePrompt: "forest", batchSize: 2 })).not.toThrow();
    expect(() => validateImageGenerationSettings({ ...settings(), positivePrompt: "forest", batchSize: 1 })).not.toThrow();
    expect(() => validateImageGenerationSettings({ ...settings(), positivePrompt: "forest", batchSize: 5 })).toThrow("生成数量");
  });

  it("仅把启用、缺路径且含正向提示词的图片列入补齐队列", () => {
    const assets = [
      { id: "a", alias: "a", kind: "image" as const, path: "", enabled: true, genPrompt: "forest" },
      { id: "b", alias: "b", kind: "image" as const, path: "ready.png", enabled: true, genPrompt: "forest" },
      { id: "c", alias: "c", kind: "image" as const, path: "", enabled: false, genPrompt: "forest" },
      { id: "d", alias: "d", kind: "video" as const, path: "", enabled: true, genPrompt: "forest" },
    ].map((asset) => ({ ...asset, fixed: false, fixedOrder: 1, shotIds: [], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" }));
    expect(missingImageAssets(assets).map((asset) => asset.id)).toEqual(["a"]);
  });

  it("解析历史结果并报告执行失败", () => {
    expect(imagesFromHistory({ p1: { outputs: { 9: { images: [{ filename: "out.png", subfolder: "TheodoreDirector/ImageGen", type: "output" }] } } } }, "p1")).toHaveLength(1);
    expect(() => historyJobStatus({ p1: { status: { status_str: "error", messages: [["execution_error", { exception_message: "missing model" }]] } } }, "p1")).toThrow("missing model");
  });

  it("生成的新素材有唯一别名且不会自动绑定镜头", () => {
    const source = { id: "source", alias: "hero", kind: "image" as const, path: "", enabled: true, fixed: true, fixedOrder: 1, shotIds: ["shot_1"], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" };
    const created = generatedAsset(source, "input/hero.png", "portrait", [source, { ...source, id: "other", alias: "hero_1" }]);
    expect(created.alias).toBe("hero_2");
    expect(created.shotIds).toEqual([]);
    expect(created.fixed).toBe(false);
    expect(created.fingerprint).toBe("");
  });
});
