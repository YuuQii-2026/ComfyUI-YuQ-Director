import { describe, expect, it } from "vitest";
import { availableReferenceAssets, clearAssetReferences, previewReferences, referenceTokenIsAvailable, referenceTokenIsGloballyAvailable, validatePlan } from "./reference";
import type { DirectorPlan } from "./types";

const plan: DirectorPlan = {
  schemaVersion: 5, project: { id: "p", name: "P", runId: "r" }, defaults: { fps: 24, baseSeed: 1 }, promptPrefix: "", promptSuffix: "",
  continuity: { mode: "h3_av_latent", videoContextFrames: 22, audioContextFrames: 24, durationMode: "final_output" },
  assets: [
    { id: "hero", alias: "hero", kind: "image", path: "hero.png", enabled: true, fixed: false, fixedOrder: 0, shotIds: [], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" },
    { id: "walk", alias: "walk", kind: "video", path: "walk.mp4", enabled: true, fixed: false, fixedOrder: 0, shotIds: [], includeVideoAudio: true, durationSeconds: 3, audioDurationSeconds: 3, fingerprint: "" },
  ],
  shots: [{ id: "s1", title: "S1", prompt: "{{ref:hero}} follows {{ref:walk}} with {{ref:walk.audio}}", negativePrompt: "", durationSeconds: 5, enabled: true, latentRelay: true, secondSamplingMode: "super_resolution_second_pass", seed: null, disabledAssetIds: [] }],
};

describe("H3 reference preview", () => {
  it("uses independent deterministic labels", () => {
    const result = previewReferences(plan, plan.shots[0]);
    expect(result.compiledPrompt).toBe("<Picture 1> follows <Video 1> with <Audio 1>");
    expect(result.errors).toEqual([]);
  });
  it("rejects duplicated aliases before saving", () => {
    const duplicated = structuredClone(plan);
    duplicated.assets[1].alias = "HERO";
    expect(validatePlan(duplicated).some((error) => error.includes("别名"))).toBe(true);
  });

  it("只校验本次要生成的镜头，未被引用的待上传素材不阻止生成", () => {
    const partial = structuredClone(plan);
    partial.assets.push({ id: "voice", alias: "voice", kind: "audio", path: "", enabled: true, fixed: false, fixedOrder: 0, shotIds: [], includeVideoAudio: false, durationSeconds: 6, audioDurationSeconds: null, fingerprint: "" });
    partial.shots.push({ ...partial.shots[0], id: "s2", title: "S2", prompt: "{{ref:hero}} says hello with {{ref:voice}}" });
    expect(validatePlan(partial, ["s1"])).toEqual([]);
    expect(validatePlan(partial, ["s2"])).toEqual(["S2: 素材 voice 尚未上传文件"]);
    expect(validatePlan(partial).some((error) => error.includes("voice"))).toBe(true);
    // 固定素材只在作用于本次镜头时才要求已上传。
    partial.assets.push({ id: "logo", alias: "logo", kind: "image", path: "", enabled: true, fixed: true, fixedOrder: 1, shotIds: ["s2"], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" });
    expect(validatePlan(partial, ["s1"])).toEqual([]);
    expect(validatePlan(partial, ["s2"])).toContain("S2: 素材 logo 尚未上传文件");
  });

  it("classifies references using current-shot availability", () => {
    expect(referenceTokenIsAvailable(plan, plan.shots[0], "hero")).toBe(true);
    expect(referenceTokenIsAvailable(plan, plan.shots[0], "walk.audio")).toBe(true);
    expect(referenceTokenIsAvailable(plan, plan.shots[0], "missing")).toBe(false);
    expect(referenceTokenIsAvailable(plan, plan.shots[0], "hero.audio")).toBe(false);

    const mutedVideo = structuredClone(plan);
    mutedVideo.assets[1].includeVideoAudio = false;
    expect(referenceTokenIsAvailable(mutedVideo, mutedVideo.shots[0], "walk.audio")).toBe(false);

    const unavailable = structuredClone(plan);
    unavailable.assets[0].enabled = false;
    unavailable.assets[1].path = "";
    expect(referenceTokenIsAvailable(unavailable, unavailable.shots[0], "hero")).toBe(false);
    expect(referenceTokenIsAvailable(unavailable, unavailable.shots[0], "walk")).toBe(false);
  });

  it("respects shot restrictions and per-shot disabled media", () => {
    const restricted = structuredClone(plan);
    restricted.shots.push({ ...structuredClone(restricted.shots[0]), id: "s2", title: "S2", disabledAssetIds: ["walk"] });
    restricted.assets[0].shotIds = ["s1"];
    expect(referenceTokenIsAvailable(restricted, restricted.shots[1], "hero")).toBe(false);
    expect(referenceTokenIsAvailable(restricted, restricted.shots[1], "walk")).toBe(false);
    expect(availableReferenceAssets(restricted, restricted.shots[1])).toEqual([]);
  });

  it("keeps legacy plans without per-shot arrays usable in the editor", () => {
    const legacy = structuredClone(plan) as DirectorPlan;
    delete (legacy.shots[0] as Partial<typeof legacy.shots[0]>).disabledAssetIds;
    delete (legacy.assets[0] as Partial<typeof legacy.assets[0]>).shotIds;
    expect(availableReferenceAssets(legacy, legacy.shots[0]).map((item) => item.id)).toEqual(["hero", "walk"]);
  });

  it("requires global references to work in every enabled shot", () => {
    const global = structuredClone(plan);
    global.shots.push({ ...structuredClone(global.shots[0]), id: "s2", title: "S2", disabledAssetIds: ["hero"] });
    expect(referenceTokenIsGloballyAvailable(global, "hero")).toBe(false);
    global.shots[1].enabled = false;
    expect(referenceTokenIsGloballyAvailable(global, "hero")).toBe(true);
  });

  it("clears only media references and per-shot disabled records", () => {
    const source = structuredClone(plan);
    source.shots[0].disabledAssetIds = ["hero"];
    const cleared = clearAssetReferences(source);

    expect(cleared.assets).toEqual([]);
    expect(cleared.shots[0].disabledAssetIds).toEqual([]);
    expect(cleared.shots[0].prompt).toBe(source.shots[0].prompt);
    expect(source.assets).toHaveLength(2);
  });
});
