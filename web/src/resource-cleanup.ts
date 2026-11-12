import type { DirectorPlan } from "./types";

export interface ResourceRef { type: "input" | "output"; path: string }
export interface CleanupResult { deleted: ResourceRef[]; skipped: ResourceRef[]; failures: Array<ResourceRef & { error: string }>; bytes: number }

export function collectAssetResources(plan: DirectorPlan, removed: DirectorPlan["assets"][number][], replaced?: { assetId?: string; oldPath?: string; oldGeneration?: { registeredPaths?: Record<string, string>; images?: Array<{ subfolder: string; filename: string; type: "output" }> }; oldGenerations?: Array<{ registeredPaths?: Record<string, string>; images?: Array<{ subfolder: string; filename: string; type: "output" }> }> }): { candidates: ResourceRef[]; keep: ResourceRef[] } {
  const live = plan.assets.filter((asset) => !removed.some((item) => item.id === asset.id));
  const keep = live.flatMap((asset) => {
    const refs: ResourceRef[] = asset.path ? [{ type: "input" as const, path: asset.path }] : [];
    for (const path of Object.values(asset.imageGeneration?.registeredPaths ?? {})) refs.push({ type: "input", path });
    const oldHistory = asset.id === replaced?.assetId ? [] : asset.imageGenerationHistory ?? [];
    for (const generation of [asset.imageGeneration, ...oldHistory]) {
      for (const image of generation?.images ?? []) refs.push({ type: "output", path: `${image.subfolder}/${image.filename}` });
      for (const path of Object.values(generation?.registeredPaths ?? {})) refs.push({ type: "input", path });
    }
    return refs;
  });
  const candidates: ResourceRef[] = removed.flatMap((asset) => asset.path ? [{ type: "input" as const, path: asset.path }] : []);
  if (replaced?.oldPath) candidates.push({ type: "input", path: replaced.oldPath });
  for (const generation of [replaced?.oldGeneration, ...(replaced?.oldGenerations ?? [])]) {
    for (const path of Object.values(generation?.registeredPaths ?? {})) candidates.push({ type: "input", path });
    for (const image of generation?.images ?? []) candidates.push({ type: "output", path: `${image.subfolder}/${image.filename}` });
  }
  return { candidates, keep };
}

export async function clearStoryboardResources(projectName: string, runId: string): Promise<{ deleted: string[]; bytes: number }> {
  const response = await fetch("/theodore-director/v1/storyboard/resources/clear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectName, runId }) });
  const result = await response.json() as { ok?: boolean; deleted?: string[]; bytes?: number; error?: string };
  if (!response.ok || !result.ok) throw new Error(result.error || `HTTP ${response.status}`);
  return { deleted: result.deleted ?? [], bytes: result.bytes ?? 0 };
}

export async function cleanupAssetResources(projectName: string, resources: ReturnType<typeof collectAssetResources>): Promise<CleanupResult> {
  const response = await fetch("/theodore-director/v1/assets/cleanup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectName, ...resources }) });
  const result = await response.json() as CleanupResult & { ok?: boolean; error?: string };
  if (!response.ok && response.status !== 409) throw new Error(result.error || `HTTP ${response.status}`);
  if (result.failures?.length) throw new Error(`资源清理失败：${result.failures.map((item) => item.path).join(", ")}`);
  return result;
}
