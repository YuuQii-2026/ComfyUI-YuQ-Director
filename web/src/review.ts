import type { GeneratedVideoItem } from "./generated-results";
import type { DirectorPlan, DirectorShot, PostprocessMode, RelayRecord } from "./types";

/** 浏览器时间与输出文件修改时间之间允许的误差（秒）。 */
const CLOCK_SLACK_SECONDS = 5;

/** 一采结果（含无伴随元数据的旧结果）才可作为审片候选和整体二采源。 */
export function isFirstPassTake(item: GeneratedVideoItem): boolean {
  return !item.stage || item.stage === "first_pass" || item.stage === "legacy_unknown";
}

export function firstPassTakes(results: GeneratedVideoItem[]): GeneratedVideoItem[] {
  return results.filter(isFirstPassTake).sort((left, right) => (right.modifiedAt ?? 0) - (left.modifiedAt ?? 0));
}

/** 用户选定的结果优先；未选择或文件已删除时回退到最新一采。 */
export function chosenTake(shot: DirectorShot, takes: GeneratedVideoItem[]): GeneratedVideoItem | undefined {
  const chosen = shot.review?.take;
  return (chosen && takes.find((item) => item.path === chosen)) || takes[0];
}

const normalizePath = (value: string | undefined) => (value ?? "").replace(/\\/g, "/").replace(/^\.\//, "");

/** 由指定一采结果派生出的二采/超分结果，最新在前。 */
export function processedResultsFor(results: GeneratedVideoItem[], sourcePath: string, mode?: PostprocessMode): GeneratedVideoItem[] {
  const source = normalizePath(sourcePath);
  return results
    .filter((item) => (item.stage === "second_pass" || item.stage === "upscaled") && normalizePath(item.sourcePath) === source)
    .filter((item) => item.relayValid !== false)
    .filter((item) => !mode || !item.processingMode || item.processingMode === mode)
    .sort((left, right) => (right.modifiedAt ?? 0) - (left.modifiedAt ?? 0));
}

/** 合并成片时每段使用的文件：选定一采结果的最新二采，没有二采时用一采本身。 */
export function deliverableFor(shot: DirectorShot, results: GeneratedVideoItem[]): { item: GeneratedVideoItem; processed: boolean } | undefined {
  const take = chosenTake(shot, firstPassTakes(results));
  if (!take) return undefined;
  const processed = processedResultsFor(results, take.path)[0];
  return processed ? { item: processed, processed: true } : { item: take, processed: false };
}

export function previousEnabledShot(plan: DirectorPlan, shotId: string): DirectorShot | undefined {
  const index = plan.shots.findIndex((shot) => shot.id === shotId);
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (plan.shots[cursor].enabled) return plan.shots[cursor];
  }
  return undefined;
}

/** 与 Python select_shot 一致：首个启用镜头即使勾选接力也会被忽略。 */
export function relaysFromPrevious(plan: DirectorPlan, shot: DirectorShot): boolean {
  return shot.enabled && shot.latentRelay && plan.continuity.mode === "h3_av_latent" && Boolean(previousEnabledShot(plan, shot.id));
}

/** 本段及其后连续接力的启用镜头；重生本段后这些镜头的接缝都会失配。 */
export function relayChain(plan: DirectorPlan, shotId: string): string[] {
  const start = plan.shots.findIndex((shot) => shot.id === shotId);
  if (start < 0) return [];
  const chain = [shotId];
  for (let cursor = start + 1; cursor < plan.shots.length; cursor += 1) {
    const shot = plan.shots[cursor];
    if (!shot.enabled) continue;
    if (!relaysFromPrevious(plan, shot)) break;
    chain.push(shot.id);
  }
  return chain;
}

export function activeIndexOf(plan: DirectorPlan, shotId: string): number {
  return plan.shots.filter((shot) => shot.enabled).findIndex((shot) => shot.id === shotId);
}

/**
 * latent 按启用顺序的槽位存取：位于启用序号 i 的镜头写 clip_{i+1}（最后一段写 clip_0），
 * 位于 i 的接力段读 clip_i。与 Python select_shot 的 next_index 一致。
 */
export function latentWriteSlot(plan: DirectorPlan, shotId: string): number {
  const enabled = plan.shots.filter((shot) => shot.enabled);
  const index = enabled.findIndex((shot) => shot.id === shotId);
  return index >= 0 && index + 1 < enabled.length ? index + 1 : 0;
}

/**
 * 接力段要读取的槽位是否真的由当前的上一段写入。插入、删除、禁用、调换镜头后，
 * 槽位里可能是别的镜头或旧布局留下的 latent。没有任何记录（旧项目）时不检查。
 */
export function relaySourceIssue(plan: DirectorPlan, shotId: string): "missing" | "wrong" | null {
  const writers = plan.pipeline?.latentWriters;
  const shot = plan.shots.find((item) => item.id === shotId);
  if (!writers || !shot || !relaysFromPrevious(plan, shot)) return null;
  const writer = writers[String(activeIndexOf(plan, shotId))];
  if (!writer) return "missing";
  return writer.shotId === previousEnabledShot(plan, shotId)?.id ? null : "wrong";
}

/** 为来源有问题、且上一段不在本次生成里的接力段补上上一段（可递归），按分镜顺序返回。 */
export function withRelayPredecessors(plan: DirectorPlan, shotIds: string[]): { shotIds: string[]; added: string[] } {
  const selected = new Set(shotIds);
  const added: string[] = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of [...selected]) {
      const previous = previousEnabledShot(plan, id);
      if (!previous || selected.has(previous.id) || !relaySourceIssue(plan, id)) continue;
      selected.add(previous.id);
      added.push(previous.id);
      changed = true;
    }
  }
  const ordered = plan.shots.filter((shot) => selected.has(shot.id)).map((shot) => shot.id);
  return { shotIds: ordered, added: plan.shots.filter((shot) => added.includes(shot.id)).map((shot) => shot.id) };
}

/** 选定结果对应的那次生成实际读取的 latent 来源记录。 */
export function relayRecordFor(shot: DirectorShot, take: GeneratedVideoItem | undefined): RelayRecord | undefined {
  if (!take) return undefined;
  const time = (take.modifiedAt ?? 0) + CLOCK_SLACK_SECONDS;
  return [...(shot.review?.relayHistory ?? [])].sort((left, right) => right.at - left.at).find((record) => record.at <= time);
}

/**
 * 接力段读取的是上一段“最近一次生成”时保存的 AV latent。
 * 没有来源记录时，本段某个结果衔接的是：生成时间早于它的上一段最新结果。
 */
export function relayParentTake(previousTakes: GeneratedVideoItem[], take: GeneratedVideoItem, sourceAt?: number | null): GeneratedVideoItem | undefined {
  const time = sourceAt != null ? sourceAt + CLOCK_SLACK_SECONDS : take.modifiedAt ?? 0;
  return [...previousTakes]
    .sort((left, right) => (right.modifiedAt ?? 0) - (left.modifiedAt ?? 0))
    .find((item) => (item.modifiedAt ?? 0) <= time);
}

export type SeamState = "ok" | "mismatch" | "wrong_source" | "unknown";

export function seamState(previousChosen: GeneratedVideoItem | undefined, previousTakes: GeneratedVideoItem[], take: GeneratedVideoItem | undefined, previousShotId?: string, record?: RelayRecord): SeamState {
  if (!previousChosen || !take) return "unknown";
  if (record) {
    if (record.source == null) return "unknown";
    if (previousShotId && record.source !== previousShotId) return "wrong_source";
  }
  const parent = relayParentTake(previousTakes, take, record?.sourceAt);
  if (!parent) return "unknown";
  return parent.path === previousChosen.path ? "ok" : "mismatch";
}

function hashText(value: string): string {
  // djb2：只用于检测本地修改，不承担安全用途。
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) hash = ((hash << 5) + hash + value.charCodeAt(index)) | 0;
  return (hash >>> 0).toString(36);
}

/** 只覆盖会影响本段生成的字段；修改中文说明或审片状态不会让签名变化。 */
export function shotSignature(plan: DirectorPlan, shot: DirectorShot): string {
  const assets = plan.assets
    .filter((asset) => !(asset.shotIds ?? []).length || asset.shotIds.includes(shot.id))
    .map((asset) => [asset.alias, asset.kind, asset.path, asset.enabled, asset.includeVideoAudio, asset.durationSeconds, asset.fixed, asset.fixedOrder]);
  return hashText(JSON.stringify([
    shot.prompt, shot.negativePrompt, shot.durationSeconds, shot.latentRelay, shot.seed, [...(shot.disabledAssetIds ?? [])].sort(),
    plan.promptPrefix, plan.promptSuffix, plan.continuity, assets,
    ...(plan.generation ? [plan.generation, plan.defaults.fps, plan.defaults.baseSeed] : []),
  ]));
}

export function shotModifiedSinceGeneration(plan: DirectorPlan, shot: DirectorShot): boolean {
  const generated = shot.review?.generatedSig;
  return Boolean(generated) && generated !== shotSignature(plan, shot);
}

export function randomSeed(): number {
  // 保持在 JS 安全整数和 ComfyUI 种子范围内，同时足够分散。
  return Math.floor(Math.random() * 4_294_967_295);
}
