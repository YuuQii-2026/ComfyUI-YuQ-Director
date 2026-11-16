import type { AssetLibraryDocument, DirectorAsset, DirectorPlan, DirectorShot, EpisodeDocument } from "./types";

const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const DEFAULT_SECOND_PASS_DENOISE = 0.3;

/** 补齐旧计划和 skill 生成计划中缺省的字段，保证编辑器可以直接使用。 */
export function normalizePlan(value: DirectorPlan): DirectorPlan {
  const plan = clone(value);
  plan.schemaVersion = 5;
  plan.project = { ...plan.project, name: plan.project?.name ?? "YuQ Project", runId: plan.project?.runId ?? "run_001", id: plan.project?.id ?? "" };
  // 内部 ID 只用于兼容协议，不展示给用户，也不参与生成 hash。
  if (!plan.project.id?.trim()) plan.project.id = uid("project");
  plan.defaults = { fps: plan.defaults?.fps ?? 24, baseSeed: plan.defaults?.baseSeed ?? 123456790, durationSeconds: plan.defaults?.durationSeconds ?? 6, secondSamplingMode: plan.defaults?.secondSamplingMode ?? "off" };
  plan.promptPrefix = plan.promptPrefix ?? "";
  plan.promptSuffix = plan.promptSuffix ?? "";
  plan.continuity = {
    mode: plan.continuity?.mode ?? "h3_av_latent",
    videoContextFrames: plan.continuity?.videoContextFrames ?? 22,
    audioContextFrames: plan.continuity?.audioContextFrames ?? 24,
    durationMode: plan.continuity?.durationMode ?? "final_output",
  };
  // v1/v2 工作流没有逐镜头开关，默认保持原有接力流程。
  plan.shots = (plan.shots ?? []).map((shot, index) => {
    const legacy = shot as DirectorShot & { secondSampling?: boolean };
    const id = shot.id || `shot_${String(index + 1).padStart(3, "0")}`;
    return {
      ...shot,
      id,
      title: shot.title || id,
      prompt: shot.prompt ?? "",
      negativePrompt: shot.negativePrompt ?? "",
      durationSeconds: Number(shot.durationSeconds) || 5,
      enabled: shot.enabled ?? true,
      latentRelay: shot.latentRelay ?? true,
      // 旧 BOOL 开关无损迁移到 V7.2 原有的超分二采模式。
      secondSamplingMode: shot.secondSamplingMode ?? (legacy.secondSampling === false ? "off" : (plan.defaults.secondSamplingMode ?? "super_resolution_second_pass")),
      seed: shot.seed ?? null,
      disabledAssetIds: shot.disabledAssetIds ?? [],
    };
  });
  plan.assets = (plan.assets ?? []).map((asset, index) => ({
    ...asset,
    id: asset.id || `asset_${String(index + 1).padStart(3, "0")}`,
    path: asset.path ?? "",
    enabled: asset.enabled ?? true,
    fixed: asset.fixed ?? false,
    fixedOrder: asset.fixedOrder ?? index + 1,
    shotIds: asset.shotIds ?? [],
    includeVideoAudio: asset.includeVideoAudio ?? false,
    durationSeconds: asset.durationSeconds ?? null,
    audioDurationSeconds: asset.audioDurationSeconds ?? null,
    fingerprint: asset.fingerprint ?? "",
  }));
  plan.pipeline = {
    ...plan.pipeline,
    phase: plan.pipeline?.phase ?? "first_pass",
    firstPassConfirmed: Boolean(plan.pipeline?.firstPassConfirmed),
    secondPassMode: plan.pipeline?.secondPassMode ?? "super_resolution_second_pass",
    secondPassDenoise: plan.pipeline?.secondPassDenoise ?? DEFAULT_SECOND_PASS_DENOISE,
  };
  plan.uiPreferences = { autoSave: plan.uiPreferences?.autoSave ?? false, compactMode: plan.uiPreferences?.compactMode ?? false };
  return plan;
}

export function assertPlanShape(value: unknown): asserts value is DirectorPlan {
  const candidate = value as Partial<DirectorPlan> | null;
  if (!candidate || typeof candidate !== "object" || !candidate.project || !Array.isArray(candidate.shots) || !Array.isArray(candidate.assets)) {
    throw new Error("不是有效的 Theodore Director 计划：需要 project、assets 和 shots 字段");
  }
}

export interface ImportMergeReport {
  plan: DirectorPlan;
  keptPaths: string[];
  keptReviews: number;
  keptSeeds: number;
}

/**
 * 把新导入的计划与当前计划合并：skill 重新导出的 JSON 通常素材路径为空，
 * 同名同类素材沿用已上传文件；同 ID 镜头沿用审片选择和已重生的 seed。
 */
export function mergeImportedPlan(current: DirectorPlan, imported: DirectorPlan): ImportMergeReport {
  const plan = normalizePlan(imported);
  if (!imported.generation && current.generation) plan.generation = { ...current.generation };
  const currentAssets = new Map(current.assets.map((asset) => [`${asset.kind}:${asset.alias.toLocaleLowerCase()}`, asset]));
  const keptPaths: string[] = [];
  plan.assets = plan.assets.map((asset): DirectorAsset => {
    const existing = currentAssets.get(`${asset.kind}:${asset.alias.toLocaleLowerCase()}`);
    if (!existing) return asset;
    const generationState = {
      imageGeneration: asset.imageGeneration ?? existing.imageGeneration,
      imageGenerationPending: asset.imageGenerationPending ?? existing.imageGenerationPending,
    };
    if (asset.path.trim() || !existing.path.trim()) return { ...asset, ...generationState };
    keptPaths.push(asset.alias);
    return {
      ...asset,
      ...generationState,
      path: existing.path,
      // 已上传文件的真实时长比 skill 中的计划时长更可靠。
      durationSeconds: existing.durationSeconds ?? asset.durationSeconds,
      audioDurationSeconds: existing.audioDurationSeconds ?? asset.audioDurationSeconds,
      fingerprint: existing.fingerprint || asset.fingerprint,
    };
  });
  // 每集可能复用 shot_001；只在同一集和同一次运行中继承审片与种子。
  const sameEpisode = current.project.name === plan.project.name && current.project.runId === plan.project.runId;
  const currentShots = new Map((sameEpisode ? current.shots : []).map((shot) => [shot.id, shot]));
  let keptReviews = 0;
  let keptSeeds = 0;
  plan.shots = plan.shots.map((shot) => {
    const existing = currentShots.get(shot.id);
    if (!existing) return shot;
    const next = { ...shot };
    if (!next.review && existing.review) { next.review = existing.review; keptReviews += 1; }
    if (next.seed == null && existing.seed != null) { next.seed = existing.seed; keptSeeds += 1; }
    return next;
  });
  if (current.pipeline && plan.pipeline) {
    plan.pipeline.secondPassDenoise = imported.pipeline?.secondPassDenoise ?? current.pipeline.secondPassDenoise ?? DEFAULT_SECOND_PASS_DENOISE;
    plan.pipeline.secondPassScale = imported.pipeline?.secondPassScale ?? current.pipeline.secondPassScale;
  }
  return { plan, keptPaths, keptReviews, keptSeeds };
}

export function exportFileStem(value: string): string {
  // 保留中文项目名，只替换 Windows/macOS/Linux 文件名共同不安全的字符。
  return value.trim().replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "_").replace(/[. ]+$/g, "").slice(0, 96) || "theodore_project";
}

const assetKey = (alias: string) => alias.trim().toLocaleLowerCase();
const validKinds = new Set(["image", "video", "audio"]);

function assertAssetEntries(value: unknown): asserts value is DirectorAsset[] {
  if (!Array.isArray(value)) throw new Error("素材清单必须为数组 / Expected an asset list");
  const aliases = new Set<string>();
  for (const asset of value) {
    if (!asset || typeof asset.alias !== "string" || !asset.alias.trim() || /[\s{}]/.test(asset.alias) || assetKey(asset.alias).endsWith(".audio") || !validKinds.has(asset.kind)) throw new Error("素材别名或类型无效 / Invalid asset alias or kind");
    if (aliases.has(assetKey(asset.alias))) throw new Error(`素材别名重复 / Duplicate alias: ${asset.alias}`);
    aliases.add(assetKey(asset.alias));
    if (asset.path != null && typeof asset.path !== "string") throw new Error("素材路径必须为字符串 / Expected a string path");
  }
}

export function assertAssetLibrary(value: unknown): asserts value is AssetLibraryDocument {
  const doc = value as AssetLibraryDocument | null;
  if (!doc || doc.format !== "theodore-assets" || doc.version !== 1 || typeof doc.library?.id !== "string" || !doc.library.id.trim() || typeof doc.library?.name !== "string") throw new Error("不是有效的素材库 JSON / Invalid asset library JSON");
  assertAssetEntries(doc.assets);
}

export function assertEpisode(value: unknown): asserts value is EpisodeDocument {
  const doc = value as EpisodeDocument | null;
  if (!doc || doc.format !== "theodore-episode" || doc.version !== 1 || typeof doc.project?.name !== "string" || !doc.project.name.trim() || !Array.isArray(doc.shots) || !Array.isArray(doc.requiredAssets)) throw new Error("不是有效的分镜 JSON / Invalid episode JSON");
  assertAssetEntries(doc.requiredAssets);
  const aliases = new Set(doc.requiredAssets.map((asset) => assetKey(asset.alias)));
  for (const alias of referencedAliases(doc)) if (!aliases.has(alias)) throw new Error(`分镜未声明素材 / Undeclared asset: ${alias}`);
}

function referencedAliases(plan: Pick<DirectorPlan, "promptPrefix" | "promptSuffix" | "shots">): Set<string> {
  const aliases = new Set<string>();
  for (const text of [plan.promptPrefix, plan.promptSuffix, ...plan.shots.flatMap((shot) => [shot.prompt, shot.negativePrompt])]) {
    for (const match of (text ?? "").matchAll(/\{\{ref:([^}]+)\}\}/g)) aliases.add(assetKey(match[1].replace(/\.audio$/i, "")));
  }
  return aliases;
}

export function assetLibraryFromPlan(plan: DirectorPlan): AssetLibraryDocument {
  return {
    format: "theodore-assets", version: 1,
    library: clone(plan.assetLibrary ?? { id: `library_${plan.project.id}`, name: plan.project.name }),
    // 镜头适用范围属于当集，系列清单不携带其他集的镜头 ID。
    assets: plan.assets.map((asset) => ({ ...clone(asset), enabled: true, fixed: false, shotIds: [] })),
  };
}

export function episodeFromPlan(plan: DirectorPlan): EpisodeDocument {
  const { assets, ...episode } = clone(plan);
  const used = referencedAliases(plan);
  const disabled = new Set(plan.shots.flatMap((shot) => shot.disabledAssetIds));
  const requiredAssets = assets.filter((asset) => used.has(assetKey(asset.alias)) || asset.fixed || disabled.has(asset.id)).map(({ id, alias, kind, enabled, fixed, shotIds, includeVideoAudio }) => ({ id, alias, kind, enabled, fixed, shotIds, includeVideoAudio }));
  const doc: EpisodeDocument = { ...episode, format: "theodore-episode", version: 1, requiredAssets };
  assertEpisode(doc);
  return doc;
}

export function mergeAssetLibrary(current: DirectorPlan, doc: AssetLibraryDocument): { plan: DirectorPlan; added: number; updated: number; keptPaths: string[] } {
  assertAssetLibrary(doc);
  const incoming = normalizePlan({ ...current, assets: doc.assets }).assets;
  const plan = clone(current);
  const byAlias = new Map(plan.assets.map((asset) => [assetKey(asset.alias), asset]));
  const ids = new Set(plan.assets.map((asset) => asset.id));
  let added = 0;
  let updated = 0;
  const keptPaths: string[] = [];
  for (const asset of incoming) {
    const existing = byAlias.get(assetKey(asset.alias));
    if (existing) {
      if (existing.kind !== asset.kind) throw new Error(`同名素材类型不同 / Asset kind mismatch: ${asset.alias}`);
      const keepFile = !asset.path.trim() && Boolean(existing.path.trim());
      const next = {
        ...existing, ...asset, id: existing.id, alias: existing.alias, enabled: existing.enabled,
        fixed: existing.fixed, fixedOrder: existing.fixedOrder, shotIds: existing.shotIds,
        imageGeneration: asset.imageGeneration ?? existing.imageGeneration,
        imageGenerationPending: asset.imageGenerationPending ?? existing.imageGenerationPending,
      };
      if (keepFile) {
        next.path = existing.path;
        next.durationSeconds = existing.durationSeconds;
        next.audioDurationSeconds = existing.audioDurationSeconds;
        next.fingerprint = existing.fingerprint;
        keptPaths.push(existing.alias);
      }
      Object.assign(existing, next);
      updated += 1;
    } else {
      const next = { ...asset, id: ids.has(asset.id) ? uid("asset") : asset.id, shotIds: [] };
      ids.add(next.id);
      byAlias.set(assetKey(asset.alias), next);
      plan.assets.push(next);
      added += 1;
    }
  }
  plan.assetLibrary = clone(doc.library);
  return { plan, added, updated, keptPaths };
}

export function mergeImportedEpisode(current: DirectorPlan, doc: EpisodeDocument): ImportMergeReport & { missingAssets: string[] } {
  assertEpisode(doc);
  const assets = clone(current.assets).map((asset) => ({ ...asset, fixed: false, shotIds: [] as string[] }));
  const byAlias = new Map(assets.map((asset) => [assetKey(asset.alias), asset]));
  const ids = new Set(assets.map((asset) => asset.id));
  const remap = new Map<string, string>();
  const missingAssets: string[] = [];
  for (const ref of doc.requiredAssets) {
    let asset = byAlias.get(assetKey(ref.alias));
    if (asset && asset.kind !== ref.kind) throw new Error(`同名素材类型不同 / Asset kind mismatch: ${ref.alias}`);
    if (!asset) {
      const id = ref.id && !ids.has(ref.id) ? ref.id : uid("asset");
      asset = { id, alias: ref.alias, kind: ref.kind, path: "", enabled: true, fixed: false, fixedOrder: assets.length + 1, shotIds: [], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" };
      assets.push(asset);
      byAlias.set(assetKey(ref.alias), asset);
      ids.add(id);
    }
    asset.enabled = ref.enabled ?? true;
    asset.fixed = ref.fixed ?? false;
    asset.shotIds = [...(ref.shotIds ?? [])];
    asset.includeVideoAudio = ref.includeVideoAudio ?? asset.includeVideoAudio;
    if (ref.id) remap.set(ref.id, asset.id);
    if (!asset.path.trim()) missingAssets.push(ref.alias);
  }
  const { format: _format, version: _version, requiredAssets: _required, ...episode } = doc;
  const report = mergeImportedPlan(current, { ...episode, assetLibrary: doc.assetLibrary ?? current.assetLibrary, assets });
  report.plan.assets = assets;
  report.plan.shots = report.plan.shots.map((shot) => ({ ...shot, disabledAssetIds: shot.disabledAssetIds.map((id) => remap.get(id) ?? id) }));
  return { ...report, keptPaths: assets.filter((asset) => asset.path.trim()).map((asset) => asset.alias), missingAssets };
}
