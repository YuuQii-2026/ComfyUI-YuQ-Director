import { describe, expect, it } from "vitest";
import { aliasFromFileName, batchAssetConflict, createBatchDrafts, detectAssetKind, filledAssetFromDraft, importedAssetFromDraft, resolveAllBatchConflicts, resolveBatchConflict, uniqueAlias, validateBatchAlias } from "./batch-assets";
import type { DirectorAsset } from "./types";

function fakeFile(name: string, type = ""): File {
  return { name, type } as File;
}

describe("批量素材导入", () => {
  it("识别混合媒体并拒绝未知扩展名", () => {
    expect(detectAssetKind(fakeFile("a.PNG"))).toBe("image");
    expect(detectAssetKind(fakeFile("clip", "video/mp4"))).toBe("video");
    expect(detectAssetKind(fakeFile("clip.bin", "video/mp4"))).toBeNull();
    expect(detectAssetKind(fakeFile("payload.exe"))).toBeNull();
  });

  it("从文件名生成适合引用的中英文别名", () => {
    expect(aliasFromFileName("01-maintenance-robot.png")).toBe("maintenance_robot");
    expect(aliasFromFileName("02 ruined city.jpg")).toBe("ruined_city");
    expect(aliasFromFileName("角色 参考图.png")).toBe("角色_参考图");
    expect(aliasFromFileName("walk.audio.mp4")).toBe("walk.audio_asset");
  });

  it("保留重名别名等待用户选择，仅保留两份时分配后缀", () => {
    expect(uniqueAlias("robot", ["Robot", "robot_2"])).toBe("robot_3");
    let ordinal = 0;
    const result = createBatchDrafts([fakeFile("robot.png"), fakeFile("robot.jpg"), fakeFile("x.exe")], ["Robot"], () => `id_${++ordinal}`);
    expect(result.drafts.map((item) => item.alias)).toEqual(["robot", "robot"]);
    expect(result.rejected).toEqual(["x.exe"]);
  });

  it("按文件夹来源路径排序并在列表中保留该路径", () => {
    let ordinal = 0;
    const result = createBatchDrafts([
      { file: fakeFile("same.png"), relativePath: "root/z/same.png" },
      { file: fakeFile("same.png"), relativePath: "root/a/same.png" },
    ], [], () => `id_${++ordinal}`);
    expect(result.drafts.map((item) => [item.sourcePath, item.alias])).toEqual([
      ["root/a/same.png", "same"],
      ["root/z/same.png", "same"],
    ]);
  });

  it("校验非法和重复别名", () => {
    expect(validateBatchAlias("bad alias", [], ["bad alias"])).toBe("invalid");
    expect(validateBatchAlias("hero", ["Hero"], ["hero"])).toBe("duplicate");
    expect(validateBatchAlias("hero", [], ["hero", "HERO"])).toBe("duplicate");
    expect(validateBatchAlias("hero", [], ["hero"])).toBeNull();
  });

  it("文件名与空缺素材别名一致时直接填充，不新建重名素材", () => {
    let ordinal = 0;
    const targets: DirectorAsset[] = [
      { id: "a_sheet", alias: "hero_sheet", kind: "image", path: "", enabled: true, fixed: false, fixedOrder: 1, shotIds: [], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" },
      { id: "a_voice", alias: "voice_hero", kind: "audio", path: "", enabled: true, fixed: false, fixedOrder: 2, shotIds: [], includeVideoAudio: false, durationSeconds: 6, audioDurationSeconds: null, fingerprint: "" },
      { id: "a_done", alias: "scene_hall", kind: "image", path: "theodore_director/x/scene_hall.png", enabled: true, fixed: false, fixedOrder: 3, shotIds: [], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" },
    ];
    const result = createBatchDrafts([fakeFile("Hero_Sheet.PNG"), fakeFile("voice_hero.wav"), fakeFile("scene_hall.png")], targets.map((item) => item.alias), () => `id_${++ordinal}`, targets);
    expect(result.drafts.map((item) => [item.alias, item.fillAssetId ?? ""])).toEqual([
      ["hero_sheet", "a_sheet"],
      ["scene_hall", ""],
      ["voice_hero", "a_voice"],
    ]);
  });

  it("创建素材时使用安全默认值且不自动开启视频伴音", () => {
    const [draft] = createBatchDrafts([fakeFile("clip.mp4")], [], () => "asset_1").drafts;
    const asset = importedAssetFromDraft(draft, "theodore_director/demo/clip.mp4", 8);
    expect(asset).toMatchObject({ id: "asset_1", alias: "clip", kind: "video", enabled: true, fixed: false, fixedOrder: 8, shotIds: [], includeVideoAudio: false });
  });
});

function existingAsset(overrides: Partial<DirectorAsset> = {}): DirectorAsset {
  return { id: "original", alias: "hero", kind: "image", path: "input/hero.png", enabled: false, fixed: true, fixedOrder: 7, shotIds: ["shot_1"], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: 3, fingerprint: "old-hash", note: "keep note", group: "角色", ...overrides };
}

function stagedFiles(names: string[], assets: DirectorAsset[] = []) {
  let ordinal = 0;
  return createBatchDrafts(names.map((name) => fakeFile(name)), assets.map((item) => item.alias), () => `new_${++ordinal}`, assets).drafts;
}

describe("素材重名选择与替换", () => {
  it("已有文件的重名素材先询问，不提前修改库或自动增加后缀", () => {
    const assets = [existingAsset()];
    const drafts = stagedFiles(["Hero.PNG"], assets);
    expect(drafts[0]).toMatchObject({ alias: "Hero", status: "pending" });
    expect(drafts[0].fillAssetId).toBeUndefined();
    expect(batchAssetConflict(drafts[0], assets, drafts)).toMatchObject({ target: assets[0], canReplace: true });
    expect(assets[0].path).toBe("input/hero.png");
  });

  it("确认替换后指向原 ID，并恢复原别名大小写", () => {
    const assets = [existingAsset()];
    const drafts = stagedFiles(["HERO.png"], assets);
    const resolved = resolveBatchConflict(drafts, drafts[0].id, "replace", assets);
    expect(resolved[0]).toMatchObject({ alias: "hero", fillAssetId: "original", replaceExisting: true });
    expect(batchAssetConflict(resolved[0], assets, resolved)).toBeNull();
  });

  it("手动删除数字后缀后也可选择替换", () => {
    const assets = [existingAsset()];
    const drafts = stagedFiles(["hero_2.png"], assets);
    drafts[0].alias = "hero";
    expect(batchAssetConflict(drafts[0], assets, drafts)?.canReplace).toBe(true);
    expect(resolveBatchConflict(drafts, drafts[0].id, "replace", assets)[0].fillAssetId).toBe("original");
  });

  it("保留两份时同时检查库内及本批次已占用的后缀", () => {
    const assets = [existingAsset(), existingAsset({ id: "second", alias: "hero_2" })];
    const drafts = stagedFiles(["hero.png", "hero_3.png"], assets);
    const chosen = drafts.find((item) => item.alias === "hero")!;
    const result = resolveBatchConflict(drafts, chosen.id, "keep", assets);
    const kept = result.find((item) => item.id === chosen.id)!;
    expect(kept.alias).toBe("hero_4");
    expect(kept.fillAssetId).toBeUndefined();
    expect(batchAssetConflict(kept, assets, result)).toBeNull();
  });

  it("跳过只移除本项，原素材保持原样", () => {
    const assets = [existingAsset()];
    const snapshot = JSON.stringify(assets);
    const drafts = stagedFiles(["hero.png", "scene.png"], assets);
    expect(resolveBatchConflict(drafts, drafts[0].id, "skip", assets).map((item) => item.alias)).toEqual(["scene"]);
    expect(JSON.stringify(assets)).toBe(snapshot);
  });

  it("类型不同的重名素材不允许直接替换", () => {
    const assets = [existingAsset()];
    const drafts = stagedFiles(["hero.mp4"], assets);
    expect(batchAssetConflict(drafts[0], assets, drafts)?.canReplace).toBe(false);
    expect(resolveBatchConflict(drafts, drafts[0].id, "replace", assets)).toEqual(drafts);
    expect(resolveBatchConflict(drafts, drafts[0].id, "keep", assets)[0].alias).toBe("hero_2");
  });

  it("批次内重名选择替换时只保留选定文件，避免并发更新同一素材", () => {
    const assets = [existingAsset()];
    const drafts = stagedFiles(["hero.jpg", "hero.png"], assets);
    const resolved = resolveBatchConflict(drafts, drafts[1].id, "replace", assets);
    expect(resolved).toHaveLength(1);
    expect(resolved[0]).toMatchObject({ id: drafts[1].id, fillAssetId: "original" });
    expect(batchAssetConflict(resolved[0], assets, resolved)).toBeNull();
  });

  it("同批次重名但库中没有素材时也可保留选定文件或两份", () => {
    const drafts = stagedFiles(["hero.jpg", "hero.png"]);
    expect(batchAssetConflict(drafts[0], [], drafts)?.canReplace).toBe(true);
    expect(resolveBatchConflict(drafts, drafts[1].id, "replace", [])).toHaveLength(1);
    const kept = resolveAllBatchConflicts(drafts, "keep", []);
    expect(new Set(kept.map((item) => item.alias)).size).toBe(2);
    expect(kept.every((item) => !batchAssetConflict(item, [], kept))).toBe(true);
  });

  it("整批替换与保留两份都能消除冲突，跳过只清理冲突项", () => {
    const assets = [existingAsset()];
    const drafts = stagedFiles(["hero.jpg", "hero.png", "scene.png"], assets);
    const replaced = resolveAllBatchConflicts(drafts, "replace", assets);
    expect(replaced).toHaveLength(2);
    expect(replaced.filter((item) => item.fillAssetId === "original")).toHaveLength(1);
    const kept = resolveAllBatchConflicts(drafts, "keep", assets);
    expect(kept).toHaveLength(3);
    expect(kept.every((item) => !batchAssetConflict(item, assets, kept))).toBe(true);
    expect(resolveAllBatchConflicts(drafts, "skip", assets).map((item) => item.alias)).toEqual(["scene"]);
  });

  it("重复选择空缺素材的文件也会询问，解决后只填充一次", () => {
    const assets = [existingAsset({ path: "" })];
    const drafts = stagedFiles(["hero.jpg", "hero.png"], assets);
    expect(drafts[0].fillAssetId).toBe("original");
    expect(batchAssetConflict(drafts[0], assets, drafts)).not.toBeNull();
    const resolved = resolveBatchConflict(drafts, drafts[1].id, "replace", assets);
    expect(resolved).toHaveLength(1);
    expect(resolved[0]).toMatchObject({ fillAssetId: "original", replaceExisting: false });
  });

  it("替换保留 ID、分组、固定引用与镜头关联，并刷新文件签名和时长", () => {
    const original = existingAsset({ kind: "video", durationSeconds: 5, includeVideoAudio: true });
    const updated = filledAssetFromDraft(original, "input/new.mp4", 9.5);
    expect(updated).toEqual({ ...original, path: "input/new.mp4", durationSeconds: 9.5, audioDurationSeconds: null, fingerprint: "" });
    expect(original.path).toBe("input/hero.png");
    expect(filledAssetFromDraft(original, "input/new.mp4", null).durationSeconds).toBe(5);
  });

  it("已导入项不重新询问或被后续的跳过操作移除，失败项可重试", () => {
    const assets = [existingAsset()];
    const drafts = stagedFiles(["hero.png"], assets);
    const [confirmed] = resolveBatchConflict(drafts, drafts[0].id, "replace", assets);
    confirmed.status = "error";
    expect(batchAssetConflict(confirmed, assets, [confirmed])).toBeNull();
    confirmed.status = "imported";
    expect(resolveBatchConflict([confirmed], confirmed.id, "skip", assets)).toEqual([confirmed]);
    expect(batchAssetConflict(confirmed, assets, [confirmed])).toBeNull();
  });
});
