import { useEffect, useState } from "preact/hooks";
import { normalizeGeneratedResults, type GeneratedVideoItem, type GeneratedVideoResponse } from "./generated-results";
import type { DirectorPlan } from "./types";

export interface ShotResultsState {
  byShot: Record<string, GeneratedVideoItem[]>;
  errors: Record<string, string>;
  loading: boolean;
}

export async function fetchShotResults(plan: Pick<DirectorPlan, "project">, shotId: string): Promise<GeneratedVideoItem[]> {
  // 结果按稳定 shot ID 查询，activeIndex 仅为旧接口保留。
  const query = new URLSearchParams({ projectName: plan.project.name, runId: plan.project.runId, shotId, activeIndex: "-1" });
  const response = await fetch(`/theodore-director/v1/generated-video?${query.toString()}`);
  const result = await response.json() as GeneratedVideoResponse;
  if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
  return normalizeGeneratedResults(result);
}

/** 一次性拉取全部镜头结果；revision 变化（生成完成、手动刷新）时重新拉取。 */
export function useAllShotResults(plan: DirectorPlan, revision: number): ShotResultsState {
  const [state, setState] = useState<ShotResultsState>({ byShot: {}, errors: {}, loading: true });
  const shotKey = plan.shots.map((shot) => shot.id).join("|");
  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true }));
    const ids = plan.shots.map((shot) => shot.id);
    void Promise.all(ids.map(async (id) => {
      try {
        return [id, await fetchShotResults(plan, id), ""] as const;
      } catch (error) {
        return [id, [] as GeneratedVideoItem[], String(error instanceof Error ? error.message : error)] as const;
      }
    })).then((entries) => {
      if (cancelled) return;
      const byShot: Record<string, GeneratedVideoItem[]> = {};
      const errors: Record<string, string> = {};
      for (const [id, items, error] of entries) {
        byShot[id] = items;
        if (error) errors[id] = error;
      }
      setState({ byShot, errors, loading: false });
    });
    return () => { cancelled = true; };
  }, [plan.project.name, plan.project.runId, shotKey, revision]);
  return state;
}
