import type { AssetKind, DirectorAsset } from "./types";

const EXTENSION_KINDS: Record<string, AssetKind> = {
  png: "image", jpg: "image", jpeg: "image", webp: "image", bmp: "image",
  mp4: "video", webm: "video", mov: "video", mkv: "video",
  wav: "audio", mp3: "audio", flac: "audio", ogg: "audio", m4a: "audio", aac: "audio",
};

export interface BatchAssetDraft {
  id: string;
  file: File;
  sourcePath: string;
  alias: string;
  kind: AssetKind;
  durationSeconds: number | null;
  includeVideoAudio: boolean;
  status: "pending" | "uploading" | "imported" | "error";
  error: string;
  /** 自动填充空缺素材，或由用户确认后替换同类素材，保留原素材 ID。 */
  fillAssetId?: string;
  /** 已确认替换有文件的素材。 */
  replaceExisting?: boolean;
  /** 用户手动改过时长后，迟到的元数据探测结果不再覆盖。 */
  durationEdited?: boolean;
}

export interface BatchAssetSource {
  file: File;
  relativePath: string;
}

export function detectAssetKind(file: Pick<File, "name" | "type">): AssetKind | null {
  const extension = file.name.split(".").pop()?.toLocaleLowerCase() ?? "";
  if (file.name.includes(".")) return EXTENSION_KINDS[extension] ?? null;
  const mimeKind = file.type.split("/", 1)[0];
  return mimeKind === "image" || mimeKind === "video" || mimeKind === "audio" ? mimeKind : null;
}

export function aliasFromFileName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const withoutOrdinal = withoutExtension.replace(/^\s*\d+\s*[-_. ]+/, "");
  const cleaned = withoutOrdinal
    .normalize("NFKC")
    .replace(/[\s-]+/g, "_")
    .replace(/[{}]/g, "")
    .replace(/_+/g, "_")
    .replace(/^[_\.]+|[_\.]+$/g, "")
    .slice(0, 96);
  const alias = cleaned || "asset";
  // `.audio` 是视频伴音引用的保留后缀，普通素材别名不能占用。
  return alias.toLocaleLowerCase().endsWith(".audio") ? `${alias}_asset` : alias;
}

export function uniqueAlias(preferred: string, occupiedAliases: Iterable<string>): string {
  const occupied = new Set(Array.from(occupiedAliases, (value) => value.toLocaleLowerCase()));
  if (!occupied.has(preferred.toLocaleLowerCase())) return preferred;
  let suffix = 2;
  while (occupied.has(`${preferred}_${suffix}`.toLocaleLowerCase())) suffix += 1;
  return `${preferred}_${suffix}`;
}

export function validateBatchAlias(alias: string, occupiedAliases: Iterable<string>, ownAliases: Iterable<string>): string | null {
  const normalized = alias.trim().toLocaleLowerCase();
  if (!alias.trim() || /[\s{}]/.test(alias) || normalized.endsWith(".audio")) return "invalid";
  if (Array.from(occupiedAliases, (value) => value.toLocaleLowerCase()).includes(normalized)) return "duplicate";
  const matches = Array.from(ownAliases, (value) => value.trim().toLocaleLowerCase()).filter((value) => value === normalized);
  return matches.length > 1 ? "duplicate" : null;
}

export function createBatchDrafts(files: Array<File | BatchAssetSource>, occupiedAliases: Iterable<string>, idFactory: () => string, fillTargets: DirectorAsset[] = []): { drafts: BatchAssetDraft[]; rejected: string[] } {
  // 保留原别名，重名由导入界面询问处理；仅用户选择保留两份时才分配后缀。
  void occupiedAliases;
  const drafts: BatchAssetDraft[] = [];
  const rejected: string[] = [];
  // 只填充还没有文件的素材，已上传的素材不会被批量导入意外替换。
  const openTargets = new Map(fillTargets.filter((asset) => !asset.path.trim()).map((asset) => [`${asset.kind}:${asset.alias.toLocaleLowerCase()}`, asset]));
  const sources = files.map((value) => "file" in value ? value : ({ file: value, relativePath: value.webkitRelativePath || value.name }));
  sources.sort((left, right) => left.relativePath.localeCompare(right.relativePath, "en", { numeric: true, sensitivity: "base" }));
  for (const source of sources) {
    const { file } = source;
    const kind = detectAssetKind(file);
    if (!kind) {
      rejected.push(source.relativePath);
      continue;
    }
    const preferred = aliasFromFileName(file.name);
    const targetKey = `${kind}:${preferred.toLocaleLowerCase()}`;
    const target = openTargets.get(targetKey);
    if (target) {
      openTargets.delete(targetKey);
      drafts.push({ id: idFactory(), file, sourcePath: source.relativePath, alias: target.alias, kind, durationSeconds: kind === "image" ? null : (target.durationSeconds ?? 2), includeVideoAudio: target.includeVideoAudio, status: "pending", error: "", fillAssetId: target.id });
      continue;
    }
    const alias = preferred;
    drafts.push({ id: idFactory(), file, sourcePath: source.relativePath, alias, kind, durationSeconds: kind === "image" ? null : 2, includeVideoAudio: false, status: "pending", error: "" });
  }
  return { drafts, rejected };
}

export interface BatchAssetConflict {
  target?: DirectorAsset;
  canReplace: boolean;
}

const aliasKey = (alias: string) => alias.trim().toLocaleLowerCase();

export function batchAssetConflict(draft: BatchAssetDraft, assets: DirectorAsset[], drafts: BatchAssetDraft[]): BatchAssetConflict | null {
  if (draft.status === "imported") return null;
  const key = aliasKey(draft.alias);
  const target = assets.find((asset) => aliasKey(asset.alias) === key);
  const peers = drafts.filter((item) => item.id !== draft.id && item.status !== "imported" && aliasKey(item.alias) === key);
  if (!peers.length && (!target || target.id === draft.fillAssetId)) return null;
  return { target, canReplace: !target || target.kind === draft.kind };
}

export function resolveBatchConflict(drafts: BatchAssetDraft[], id: string, action: "replace" | "keep" | "skip", assets: DirectorAsset[]): BatchAssetDraft[] {
  const draft = drafts.find((item) => item.id === id);
  if (!draft || draft.status === "imported" || draft.status === "uploading") return drafts;
  if (action === "skip") return drafts.filter((item) => item.id !== id);
  if (action === "keep") {
    const alias = uniqueAlias(draft.alias.trim(), [...assets.map((item) => item.alias), ...drafts.filter((item) => item.id !== id).map((item) => item.alias)]);
    return drafts.map((item) => item.id === id ? { ...item, alias, fillAssetId: undefined, replaceExisting: false, status: "pending", error: "" } : item);
  }
  const conflict = batchAssetConflict(draft, assets, drafts);
  if (!conflict?.canReplace) return drafts;
  // 同一别名只保留用户选定的文件，避免并发上传先后覆盖同一素材。
  return drafts.filter((item) => item.id === id || item.status === "imported" || aliasKey(item.alias) !== aliasKey(draft.alias)).map((item) => item.id === id ? {
    ...item,
    alias: conflict.target?.alias ?? draft.alias.trim(),
    fillAssetId: conflict.target?.id,
    replaceExisting: Boolean(conflict.target?.path.trim()),
    includeVideoAudio: conflict.target?.includeVideoAudio ?? item.includeVideoAudio,
    status: "pending",
    error: "",
  } : item);
}

export function resolveAllBatchConflicts(drafts: BatchAssetDraft[], action: "replace" | "keep" | "skip", assets: DirectorAsset[]): BatchAssetDraft[] {
  const ids = drafts.filter((item) => batchAssetConflict(item, assets, drafts)).map((item) => item.id);
  return ids.reduce((items, id) => {
    const draft = items.find((item) => item.id === id);
    return draft && (action === "skip" || batchAssetConflict(draft, assets, items)) ? resolveBatchConflict(items, id, action, assets) : items;
  }, drafts);
}

export function filledAssetFromDraft(asset: DirectorAsset, path: string, durationSeconds: number | null): DirectorAsset {
  return {
    ...asset,
    path,
    durationSeconds: asset.kind === "image" ? null : durationSeconds ?? asset.durationSeconds,
    audioDurationSeconds: null,
    fingerprint: "",
  };
}

export function importedAssetFromDraft(draft: BatchAssetDraft, path: string, fixedOrder: number): DirectorAsset {
  return {
    id: draft.id,
    alias: draft.alias.trim(),
    kind: draft.kind,
    path,
    enabled: true,
    fixed: false,
    fixedOrder,
    shotIds: [],
    includeVideoAudio: draft.kind === "video" && draft.includeVideoAudio,
    durationSeconds: draft.kind === "image" ? null : draft.durationSeconds,
    audioDurationSeconds: null,
    fingerprint: "",
  };
}
