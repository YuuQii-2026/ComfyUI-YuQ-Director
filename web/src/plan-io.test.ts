import { describe, expect, it } from "vitest";
import { assertAssetLibrary, assertEpisode, assertPlanShape, assetLibraryFromPlan, episodeFromPlan, mergeAssetLibrary, mergeImportedEpisode, mergeImportedPlan, normalizePlan } from "./plan-io";
import type { DirectorPlan } from "./types";

function basePlan(): DirectorPlan {
  return normalizePlan({
    schemaVersion: 5,
    project: { id: "p", name: "雨夜逆袭", runId: "run_001" },
    defaults: { fps: 24, baseSeed: 1 },
    promptPrefix: "",
    promptSuffix: "",
    continuity: { mode: "h3_av_latent", videoContextFrames: 22, audioContextFrames: 24, durationMode: "final_output" },
    assets: [
      { id: "a1", alias: "hero_sheet", kind: "image", path: "theodore_director/demo/hero_sheet.png", enabled: true, fixed: false, fixedOrder: 1, shotIds: [], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" },
      { id: "a2", alias: "voice_hero", kind: "audio", path: "theodore_director/demo/voice_hero.wav", enabled: true, fixed: false, fixedOrder: 2, shotIds: [], includeVideoAudio: false, durationSeconds: 6.4, audioDurationSeconds: null, fingerprint: "" },
    ],
    shots: [{ id: "shot_001", title: "开场", prompt: "old", negativePrompt: "", durationSeconds: 6, enabled: true, latentRelay: false, secondSamplingMode: "off", seed: 99, disabledAssetIds: [], review: { status: "approved", take: "x.mp4" } }],
  });
}

describe("计划导入", () => {
  it("缺省字段被补齐，skill 生成的精简计划也能直接打开", () => {
    const plan = normalizePlan({ project: { name: "x" }, assets: [{ alias: "hero", kind: "image" }], shots: [{ prompt: "p" }] } as unknown as DirectorPlan);
    expect(plan.shots[0]).toMatchObject({ id: "shot_001", title: "shot_001", durationSeconds: 5, enabled: true, disabledAssetIds: [] });
    expect(plan.assets[0]).toMatchObject({ id: "asset_001", path: "", enabled: true, shotIds: [] });
    expect(plan.pipeline?.secondPassDenoise).toBe(0.3);
  });

  it("重新导入时保留同名素材文件、审片选择和 seed", () => {
    const imported = basePlan();
    imported.assets = imported.assets.map((asset) => ({ ...asset, id: `new_${asset.alias}`, path: "", durationSeconds: asset.kind === "audio" ? 6 : null }));
    imported.shots = [{ ...imported.shots[0], prompt: "new", seed: null, review: undefined }];
    const report = mergeImportedPlan(basePlan(), imported);
    expect(report.keptPaths).toEqual(["hero_sheet", "voice_hero"]);
    expect(report.plan.assets[1]).toMatchObject({ id: "new_voice_hero", path: "theodore_director/demo/voice_hero.wav", durationSeconds: 6.4 });
    expect(report.plan.shots[0]).toMatchObject({ prompt: "new", seed: 99, review: { status: "approved", take: "x.mp4" } });
    expect(report.keptReviews).toBe(1);
  });

  it("拒绝缺少核心字段的 JSON", () => {
    expect(() => assertPlanShape({ shots: [] })).toThrow("project");
  });
});

describe("系列素材库与每集分镜独立导入", () => {
  it("素材库导出只携带素材信息与远程路径", () => {
    const plan = basePlan();
    plan.assets[0].shotIds = ["shot_001"];
    plan.assets[0].fixed = true;
    const doc = assetLibraryFromPlan(plan);
    expect(doc.format).toBe("theodore-assets");
    expect(doc.assets[0]).toMatchObject({ path: "theodore_director/demo/hero_sheet.png", fixed: false, shotIds: [] });
    expect(doc).not.toHaveProperty("shots");
    assertAssetLibrary(doc);
  });

  it("分镜导出保留提示词，文件不携带素材路径与生成提示词", () => {
    const plan = basePlan();
    plan.shots[0].prompt = "Use {{ref:hero_sheet}} and {{ref:voice_hero}}";
    plan.assets[0].genPrompt = "image generation text";
    const doc = episodeFromPlan(plan);
    expect(doc.requiredAssets.map((asset) => asset.alias)).toEqual(["hero_sheet", "voice_hero"]);
    expect(doc.shots[0].prompt).toBe(plan.shots[0].prompt);
    expect(doc).not.toHaveProperty("assets");
    expect(JSON.stringify(doc)).not.toContain("theodore_director/demo");
    expect(JSON.stringify(doc)).not.toContain("image generation text");
    assertEpisode(doc);
  });

  it("导入下一集保留整个素材库和全部远程文件，不继承上一集审片与种子", () => {
    const current = basePlan();
    const next = basePlan();
    next.project.name = "雨夜逆袭_EP002";
    next.project.runId = "EP002";
    next.assets = [{ ...next.assets[0], path: "", id: "skill_hero" }];
    next.shots = [{ ...next.shots[0], prompt: "New episode {{ref:hero_sheet}}", seed: null, review: undefined }];
    const report = mergeImportedEpisode(current, episodeFromPlan(next));
    expect(report.plan.assets).toEqual(current.assets);
    expect(report.plan.assets).toHaveLength(2);
    expect(report.plan.shots[0]).toMatchObject({ prompt: next.shots[0].prompt, seed: null });
    expect(report.plan.shots[0].review).toBeUndefined();
    expect(report.keptReviews).toBe(0);
    expect(report.missingAssets).toEqual([]);
  });

  it("同一集的提示词修订保留审片和重生种子", () => {
    const plan = basePlan();
    const update = basePlan();
    update.shots[0] = { ...update.shots[0], prompt: "revised {{ref:hero_sheet}}", review: undefined, seed: null };
    const report = mergeImportedEpisode(plan, episodeFromPlan(update));
    expect(report.plan.shots[0]).toMatchObject({ seed: 99, review: { status: "approved" } });
    expect(report.keptReviews).toBe(1);
  });

  it("旧完整计划跨集导入也不复用同名 shot_001 的审片", () => {
    const current = basePlan();
    const next = basePlan();
    next.project.runId = "EP002";
    next.shots[0].review = undefined;
    next.shots[0].seed = null;
    expect(mergeImportedPlan(current, next).plan.shots[0].review).toBeUndefined();
    expect(mergeImportedPlan(current, next).plan.shots[0].seed).toBeNull();
  });

  it("已上传的素材库导入新工作流，只恢复素材，不覆盖分镜或项目", () => {
    const remote = assetLibraryFromPlan(basePlan());
    const empty = basePlan();
    empty.assets = [];
    empty.project.name = "下一集";
    const report = mergeAssetLibrary(empty, remote);
    expect(report.plan.assets[1].path).toBe("theodore_director/demo/voice_hero.wav");
    expect(report.plan.shots).toEqual(empty.shots);
    expect(report.plan.project).toEqual(empty.project);
    expect(report.added).toBe(2);
  });

  it("skill 追加清单的空路径不会清空上传结果或实测时长", () => {
    const current = basePlan();
    const doc = assetLibraryFromPlan(current);
    doc.assets = doc.assets.map((asset) => ({ ...asset, path: "", durationSeconds: 2, genPrompt: "updated prompt" }));
    const report = mergeAssetLibrary(current, doc);
    expect(report.plan.assets[1]).toMatchObject({ path: current.assets[1].path, durationSeconds: 6.4, genPrompt: "updated prompt" });
    expect(report.keptPaths).toHaveLength(2);
  });

  it("重新导入计划或素材库时保留自动生图记录与未完成任务", () => {
    const current = basePlan();
    current.assets[0].imageGeneration = {
      promptId: "p1", createdAt: 1,
      settings: { positivePrompt: "forest", negativePrompt: "", width: 1024, height: 1024, steps: 12, cfg: 1, batchSize: 1, seed: 7, filenamePrefix: "TheodoreDirector/ImageGen/p/hero" },
      images: [{ filename: "hero.png", subfolder: "TheodoreDirector/ImageGen/p", type: "output", url: "/view?filename=hero.png" }],
    };
    current.assets[0].imageGenerationPending = { promptId: "pending", createdAt: 2, settings: current.assets[0].imageGeneration.settings };
    const imported = basePlan();
    imported.assets[0] = { ...imported.assets[0], path: "" };
    const merged = mergeImportedPlan(current, imported).plan.assets[0];
    expect(merged.imageGeneration?.promptId).toBe("p1");
    expect(merged.imageGenerationPending?.promptId).toBe("pending");
    const library = assetLibraryFromPlan(imported);
    const libraryMerged = mergeAssetLibrary(current, library).plan.assets[0];
    expect(libraryMerged.imageGeneration?.promptId).toBe("p1");
    expect(libraryMerged.imageGenerationPending?.promptId).toBe("pending");
    const populated = basePlan();
    populated.assets[0] = { ...populated.assets[0], path: "new/generated.png" };
    const populatedMerge = mergeImportedPlan(current, populated).plan.assets[0];
    expect(populatedMerge.path).toBe("new/generated.png");
    expect(populatedMerge.imageGeneration?.promptId).toBe("p1");
    expect(populatedMerge.imageGenerationPending?.promptId).toBe("pending");
  });

  it("导入库的新素材 ID 碰撞时重新分配 ID，已有素材 ID 保持不变", () => {
    const current = basePlan();
    const doc = assetLibraryFromPlan(current);
    doc.assets = [{ ...current.assets[0], alias: "new_scene", id: "a1", path: "" }];
    const report = mergeAssetLibrary(current, doc);
    expect(report.plan.assets[0].id).toBe("a1");
    expect(report.plan.assets[2].id).not.toBe("a1");
  });

  it("分镜优先导入时建立空缺项，随后导入素材库即可恢复路径", () => {
    const episodePlan = basePlan();
    episodePlan.shots[0].prompt = "{{ref:hero_sheet}} {{ref:voice_hero}}";
    const empty = basePlan(); empty.assets = [];
    const staged = mergeImportedEpisode(empty, episodeFromPlan(episodePlan));
    expect(staged.missingAssets).toEqual(["hero_sheet", "voice_hero"]);
    const ready = mergeAssetLibrary(staged.plan, assetLibraryFromPlan(episodePlan));
    expect(ready.plan.assets.map((asset) => asset.path)).toEqual(episodePlan.assets.map((asset) => asset.path));
    expect(ready.plan.shots).toEqual(staged.plan.shots);
  });

  it("按别名映射禁用素材 ID，并按当集设置恢复镜头适用范围", () => {
    const current = basePlan();
    current.assets[1].shotIds = ["old_shot"];
    current.assets[1].fixed = true;
    const next = basePlan();
    next.assets[0].id = "new_hero";
    next.assets[0].shotIds = ["shot_001"];
    next.shots[0].prompt = "{{ref:hero_sheet}}";
    next.shots[0].disabledAssetIds = ["new_hero"];
    const report = mergeImportedEpisode(current, episodeFromPlan(next));
    expect(report.plan.shots[0].disabledAssetIds).toEqual(["a1"]);
    expect(report.plan.assets[0].shotIds).toEqual(["shot_001"]);
    expect(report.plan.assets[1].shotIds).toEqual([]);
    expect(report.plan.assets[1].fixed).toBe(false);
  });

  it("同名不同类型在独立导入时整体拒绝，当前计划保持原样", () => {
    const current = basePlan(); const snapshot = JSON.stringify(current);
    const library = assetLibraryFromPlan(current); library.assets[0].kind = "video";
    expect(() => mergeAssetLibrary(current, library)).toThrow("类型不同");
    const next = basePlan(); next.assets[0].kind = "video"; next.shots[0].prompt = "{{ref:hero_sheet}}";
    expect(() => mergeImportedEpisode(current, episodeFromPlan(next))).toThrow("类型不同");
    expect(JSON.stringify(current)).toBe(snapshot);
  });

  it("分镜 JSON 未声明引用、素材库重复别名、格式版本错误均拒绝", () => {
    const plan = basePlan(); plan.shots[0].prompt = "{{ref:hero_sheet}}";
    const doc = episodeFromPlan(plan); doc.requiredAssets = [];
    expect(() => assertEpisode(doc)).toThrow("未声明素材");
    const library = assetLibraryFromPlan(plan); library.assets.push({ ...library.assets[0], alias: "HERO_SHEET" });
    expect(() => assertAssetLibrary(library)).toThrow("别名重复");
    expect(() => assertAssetLibrary({ ...library, version: 2 })).toThrow("素材库 JSON");
  });

  it("前后缀与视频伴音引用也会写入所需素材清单", () => {
    const plan = basePlan(); plan.promptPrefix = "{{ref:hero_sheet}}";
    plan.assets[1] = { ...plan.assets[1], kind: "video", alias: "motion", includeVideoAudio: true };
    plan.promptSuffix = "{{ref:motion.audio}}";
    expect(episodeFromPlan(plan).requiredAssets.map((asset) => asset.alias)).toEqual(["hero_sheet", "motion"]);
  });
});
