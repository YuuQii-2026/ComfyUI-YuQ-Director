import { useState } from "preact/hooks";
import { writeClipboardText } from "./clipboard";
import type { Language } from "./i18n";
import { assetFileName, MediaPreview } from "./media";
import { readMediaDuration } from "./media-metadata";
import type { AssetKind, DirectorAsset, DirectorPlan } from "./types";

interface AssetsPanelProps {
  plan: DirectorPlan;
  language: Language;
  mutate: (fn: (draft: DirectorPlan) => void) => void;
  uploadAsset: (projectName: string, kind: AssetKind, file: File) => Promise<string>;
  importingDisabled: boolean;
  onImportLibrary: (file: File) => void;
  onExportLibrary: () => void;
  onOpenBatch: () => void;
  onGenerateImage?: (asset: DirectorAsset) => void;
  onBatchGenerateImages?: () => void;
  notify: (message: string, tone?: "info" | "error") => void;
}

const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const KIND_ZH: Record<AssetKind, string> = { image: "图片", video: "视频", audio: "音频" };
const GROUP_ORDER = ["角色", "场景", "道具", "声音"];

function newAsset(kind: AssetKind, fixedOrder: number): DirectorAsset {
  const id = uid(kind);
  return { id, alias: id, kind, path: "", enabled: true, fixed: false, fixedOrder, shotIds: [], includeVideoAudio: false, durationSeconds: kind === "image" ? null : 6, audioDurationSeconds: null, fingerprint: "" };
}

function groupOf(asset: DirectorAsset, language: Language): string {
  if (asset.group?.trim()) return asset.group.trim();
  return language === "zh" ? `${KIND_ZH[asset.kind]}素材` : `${asset.kind} assets`;
}

export function AssetsPanel({ plan, language, mutate, uploadAsset, importingDisabled, onImportLibrary, onExportLibrary, onOpenBatch, onGenerateImage, onBatchGenerateImages, notify }: AssetsPanelProps) {
  const L = (zh: string, en: string) => language === "zh" ? zh : en;
  // Keep an open editor in its original group while fields are edited.
  // Moving it between group parents would recreate inputs and lose focus/IME state.
  const [expanded, setExpanded] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, string>>({});
  const [dragTarget, setDragTarget] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(false);
  const missing = plan.assets.filter((asset) => asset.enabled && !asset.path.trim());
  const visible = onlyMissing ? plan.assets.filter((asset) => missing.includes(asset) || expanded[asset.id] !== undefined) : plan.assets;
  const groups = new Map<string, DirectorAsset[]>();
  for (const asset of visible) {
    const name = expanded[asset.id] ?? groupOf(asset, language);
    groups.set(name, [...(groups.get(name) ?? []), asset]);
  }
  const orderedGroups = [...groups.entries()].sort(([left], [right]) => {
    const rank = (name: string) => { const index = GROUP_ORDER.indexOf(name); return index < 0 ? GROUP_ORDER.length : index; };
    return rank(left) - rank(right) || left.localeCompare(right, "zh");
  });

  const update = (assetId: string, fn: (asset: DirectorAsset) => void) => mutate((draft) => {
    const target = draft.assets.find((item) => item.id === assetId);
    if (target) fn(target);
  });

  const uploadFile = async (asset: DirectorAsset, file: File) => {
    setUploading((current) => ({ ...current, [asset.id]: file.name }));
    try {
      const [path, duration] = await Promise.all([uploadAsset(plan.project.name, asset.kind, file), readMediaDuration(file, asset.kind)]);
      update(asset.id, (target) => {
        target.path = path;
        // 上传后用真实时长覆盖计划时长，H3 预检和后端校验都依赖该值。
        if (asset.kind !== "image" && duration != null) target.durationSeconds = duration;
      });
      notify(L(`已上传 ${asset.alias}`, `Uploaded ${asset.alias}`));
    } catch (error) {
      notify(`${L("上传失败", "Upload failed")}：${error instanceof Error ? error.message : String(error)}`, "error");
    } finally {
      setUploading((current) => { const next = { ...current }; delete next[asset.id]; return next; });
    }
  };

  const copy = async (text: string, message: string) => {
    try { await writeClipboardText(text); notify(message); } catch (error) { notify(`${L("复制失败", "Copy failed")}：${String(error)}`, "error"); }
  };

  return <div class="td-assets-panel">
    <div class="td-assets-toolbar">
      <div class="td-assets-summary">
        <strong>{L(`共 ${plan.assets.length} 项素材`, `${plan.assets.length} assets`)}</strong>
        {missing.length ? <span class="td-chip warn">{L(`${missing.length} 项待上传`, `${missing.length} missing`)}</span> : <span class="td-chip ok">{L("全部就绪", "All ready")}</span>}
        <label class="td-inline-check"><input type="checkbox" checked={onlyMissing} onChange={(event) => setOnlyMissing(event.currentTarget.checked)}/>{L("只看待上传", "Missing only")}</label>
      </div>
      <div class="td-assets-actions">
        <label class="td-button" title={L("载入共用素材清单与远程文件路径，保留当前分镜", "Load a shared library and remote media paths; preserve current shots")}>{L("导入素材库", "Import library")}<input type="file" accept="application/json,.json" disabled={importingDisabled} onChange={(event) => { const input = event.currentTarget; const file = input.files?.[0]; input.value = ""; if (file) onImportLibrary(file); }}/></label>
        <button onClick={onExportLibrary}>{L("导出素材库", "Export library")}</button>
        {(["image", "video", "audio"] as AssetKind[]).map((kind) => <button onClick={() => mutate((draft) => { draft.assets.push(newAsset(kind, draft.assets.length + 1)); })}>＋ {L(KIND_ZH[kind], kind)}</button>)}
        <button class="accent" onClick={onOpenBatch}>⇪ {L("批量导入 / 按文件名填充", "Batch import / fill by name")}</button>
        <button class="primary" disabled={importingDisabled || !onBatchGenerateImages} onClick={onBatchGenerateImages}>{L("批量生图", "Batch generate images")}</button>
      </div>
    </div>
    {!plan.assets.length && <div class="td-empty-state"><strong>{L("素材库为空", "No assets yet")}</strong><p>{L("导入 skill 生成的 .assets.json 共用素材库，或已上传后导出的素材库，即可载入角色、场景和声音参考。每集用顶部“导入分镜”切换。", "Import a shared .assets.json library with character, scene and voice references. Use Import shots to switch episodes.")}</p></div>}
    {orderedGroups.map(([group, assets]) => <section class="td-asset-group" key={group}>
      <h3>{group}<span>{assets.length}</span></h3>
      <div class="td-asset-grid">
        {assets.map((asset) => {
          const ready = Boolean(asset.path.trim());
          const isOpen = expanded[asset.id] !== undefined;
          const reference = `{{ref:${asset.alias}}}`;
          return <article key={asset.id} class={`td-asset-card ${isOpen ? "expanded" : ""} ${ready ? "" : "missing"} ${asset.enabled ? "" : "disabled"} ${dragTarget === asset.id ? "dragging" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setDragTarget(asset.id); }}
            onDragLeave={() => setDragTarget((current) => current === asset.id ? "" : current)}
            onDrop={(event) => { event.preventDefault(); setDragTarget(""); const file = event.dataTransfer?.files?.[0]; if (file) void uploadFile(asset, file); }}>
            <div class="td-asset-card-media">
              {ready ? <MediaPreview asset={asset} compact/> : <label class="td-asset-drop"><span>{uploading[asset.id] ? L("上传中…", "Uploading…") : L("拖入文件或点击上传", "Drop or click to upload")}</span><small>{L("建议文件名", "Suggested name")}：{asset.alias}.{asset.kind === "image" ? "png" : asset.kind === "video" ? "mp4" : "wav"}</small><input type="file" accept={`${asset.kind}/*`} onChange={(event) => { const input = event.currentTarget; const file = input.files?.[0]; input.value = ""; if (file) void uploadFile(asset, file); }}/></label>}
              <span class="td-asset-kind">{L(KIND_ZH[asset.kind], asset.kind)}{asset.kind !== "image" && asset.durationSeconds ? ` · ${asset.durationSeconds}s` : ""}</span>
              <span class={`td-asset-status ${ready ? "ok" : "warn"}`}>{uploading[asset.id] ? L("上传中", "Uploading") : ready ? L("已就绪", "Ready") : L("待上传", "Missing")}</span>
            </div>
            <div class="td-asset-card-body">
              <div class="td-asset-card-title">
                <input aria-label={L("别名", "Alias")} value={asset.alias} onInput={(event) => update(asset.id, (target) => { target.alias = event.currentTarget.value; })}/>
                <button title={L(`复制引用 ${reference}`, `Copy ${reference}`)} onClick={() => void copy(reference, L(`已复制 ${reference}`, `Copied ${reference}`))}>{"{ }"}</button>
              </div>
              {asset.note && <p class="td-asset-note" title={asset.note}>{asset.note}</p>}
              <div class="td-asset-card-actions">
                {asset.kind === "image" && <button class="accent" disabled={importingDisabled || !onGenerateImage} onClick={() => onGenerateImage?.(asset)}>{L("自动生图", "Generate image")}</button>}
                {ready && <label class="td-file-label">{uploading[asset.id] ? L("上传中…", "Uploading…") : L("替换文件", "Replace")}<input type="file" accept={`${asset.kind}/*`} onChange={(event) => { const input = event.currentTarget; const file = input.files?.[0]; input.value = ""; if (file) void uploadFile(asset, file); }}/></label>}
                {asset.genPrompt && <button class="accent" onClick={() => void copy(asset.genPrompt ?? "", L("已复制生成提示词", "Generation prompt copied"))}>{L("复制生成提示词", "Copy gen prompt")}</button>}
                <button aria-expanded={isOpen} aria-controls={`td-asset-details-${asset.id}`} onClick={() => setExpanded((current) => {
                  const next = { ...current };
                  if (isOpen) delete next[asset.id]; else next[asset.id] = groupOf(asset, language);
                  return next;
                })}>{isOpen ? L("收起", "Less") : L("详情", "More")}</button>
              </div>
              {isOpen && <div class="td-asset-details" id={`td-asset-details-${asset.id}`}>
                {asset.genPrompt && <details class="td-gen-prompt"><summary>{L("生成提示词", "Generation prompt")}</summary><pre>{asset.genPrompt}</pre></details>}
                <label>{L("输入目录相对路径", "Input-relative path")}<input value={asset.path} placeholder="theodore_director/项目名/文件名" onInput={(event) => update(asset.id, (target) => { target.path = event.currentTarget.value; })}/><small>{assetFileName(asset.path)}</small></label>
                <div class="td-asset-detail-grid">
                  <label>{L("类型", "Kind")}<select value={asset.kind} onChange={(event) => update(asset.id, (target) => { target.kind = event.currentTarget.value as AssetKind; })}><option value="image">{L("图片", "image")}</option><option value="video">{L("视频", "video")}</option><option value="audio">{L("音频", "audio")}</option></select></label>
                  <label>{L("分组", "Group")}<input aria-label={L("分组", "Group")} value={asset.group ?? ""} placeholder={L("角色 / 场景 / 道具 / 声音", "Group")} onInput={(event) => update(asset.id, (target) => { target.group = event.currentTarget.value; })}/><small>{L("收起详情后按新分组归类", "Regroup after closing details")}</small></label>
                  {asset.kind !== "image" && <label>{L("时长（秒）", "Duration (s)")}<input type="number" min="0" step="0.1" value={asset.durationSeconds ?? ""} onInput={(event) => update(asset.id, (target) => { target.durationSeconds = event.currentTarget.value ? Number(event.currentTarget.value) : null; })}/></label>}
                  <label>{L("固定顺序", "Fixed order")}<input type="number" value={asset.fixedOrder} onInput={(event) => update(asset.id, (target) => { target.fixedOrder = Number(event.currentTarget.value); })}/></label>
                  <label class="wide">{L("仅用于这些镜头 ID（逗号分隔，留空=全部）", "Limit to shot IDs (comma separated)")}<input value={asset.shotIds.join(", ")} onInput={(event) => update(asset.id, (target) => { target.shotIds = event.currentTarget.value.split(",").map((value) => value.trim()).filter(Boolean); })}/></label>
                  <label class="wide">{L("说明", "Note")}<textarea rows={2} value={asset.note ?? ""} onInput={(event) => update(asset.id, (target) => { target.note = event.currentTarget.value; })}/></label>
                </div>
                <div class="td-asset-flags">
                  <label class="td-inline-check"><input type="checkbox" checked={asset.enabled} onChange={(event) => update(asset.id, (target) => { target.enabled = event.currentTarget.checked; })}/>{L("启用", "Enabled")}</label>
                  <label class="td-inline-check" title={L("固定引用会被每个镜头自动加载，即使提示词没有写 {{ref}}", "Fixed assets load in every shot even without {{ref}}")}><input type="checkbox" checked={asset.fixed} onChange={(event) => update(asset.id, (target) => { target.fixed = event.currentTarget.checked; })}/>{L("固定引用", "Always load")}</label>
                  {asset.kind === "video" && <label class="td-inline-check"><input type="checkbox" checked={asset.includeVideoAudio} onChange={(event) => update(asset.id, (target) => { target.includeVideoAudio = event.currentTarget.checked; })}/>{L("启用视频伴音", "Use video audio")}</label>}
                  <button class="danger" onClick={() => { if (window.confirm(L(`删除素材 ${asset.alias}？本地文件不会被删除。`, `Remove ${asset.alias}? Local files are kept.`))) mutate((draft) => { draft.assets = draft.assets.filter((item) => item.id !== asset.id); }); }}>{L("删除素材", "Remove")}</button>
                </div>
              </div>}
            </div>
          </article>;
        })}
      </div>
    </section>)}
  </div>;
}
