import type { DirectorShot } from "./types";

function nextShotOrdinal(shots: DirectorShot[]): number {
  // 优先沿用 shot_XXX 的最大编号，避免删除中间镜头后批量新增产生重复 ID。
  const maxOrdinal = shots.reduce((maximum, shot) => {
    const match = /^shot_(\d+)(?:_[a-z0-9]+)?$/i.exec(shot.id.trim());
    return match ? Math.max(maximum, Number(match[1])) : maximum;
  }, 0);
  return Math.max(maxOrdinal, shots.length) + 1;
}

/**
 * 界面新建镜头使用的 ID 后缀。生成结果按镜头 ID 存放且删除镜头不删文件，
 * 不带后缀时，删掉末尾镜头再新增会复用同一 ID 并“继承”旧视频。
 */
export function randomShotSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

export function createShot(ordinal: number, durationSeconds = 5, idSuffix?: () => string, secondSamplingMode: DirectorShot["secondSamplingMode"] = "super_resolution_second_pass"): DirectorShot {
  const base = `shot_${String(ordinal).padStart(3, "0")}`;
  return {
    id: idSuffix ? `${base}_${idSuffix()}` : base,
    title: `Shot ${ordinal}`,
    prompt: "",
    negativePrompt: "",
    durationSeconds,
    enabled: true,
    latentRelay: true,
    secondSamplingMode,
    seed: null,
    disabledAssetIds: [],
  };
}

export function appendShots(shots: DirectorShot[], count: number, durationSeconds: number, idSuffix?: () => string, secondSamplingMode: DirectorShot["secondSamplingMode"] = "super_resolution_second_pass"): DirectorShot[] {
  const firstOrdinal = nextShotOrdinal(shots);
  // 返回新数组和全新的镜头对象，确保批量面板的临时数据不会修改原计划。
  const additions = Array.from({ length: count }, (_, index) => createShot(firstOrdinal + index, durationSeconds, idSuffix, secondSamplingMode));
  return [...shots, ...additions];
}

export function resetStoryboard(durationSeconds = 5, idSuffix?: () => string, secondSamplingMode: DirectorShot["secondSamplingMode"] = "super_resolution_second_pass"): DirectorShot[] {
  // 计划协议要求至少保留一个启用镜头；重置时以一个无提示词的空白镜头代替零长度列表。
  return [createShot(1, durationSeconds, idSuffix, secondSamplingMode)];
}
