import type { ImageGenerationDefaults, ImageModelSettings } from "./image-generation";

export interface ImageGenerationPreferences extends ImageModelSettings {
  width: number;
  height: number;
  steps: number;
  cfg: number;
  batchSize: number;
  seed: number;
  randomSeed: boolean;
}
export const IMAGE_PREFERENCES_KEY = "theodore-director-image-settings-v2-qwen21";
export const DEFAULT_IMAGE_PREFERENCES: ImageGenerationPreferences = {
  width: 1080, height: 720, steps: 12, cfg: 1, batchSize: 1, seed: 0, randomSeed: false,
};
type StorageLike = Pick<Storage, "getItem" | "setItem">;
let session: Partial<ImageGenerationPreferences> = {};
function browserStorage(): StorageLike | undefined {
  try { return globalThis.localStorage; } catch { return undefined; }
}
// Read fields independently: an invalid number must not discard other saved settings.
export function validImagePreferences(raw: unknown): Partial<ImageGenerationPreferences> {
  if (!raw || typeof raw !== "object") return {};
  const value = raw as Record<string, unknown>;
  const result: Partial<ImageGenerationPreferences> = {};
  for (const key of ["width", "height", "steps", "cfg", "batchSize", "seed"] as const) {
    const n = value[key];
    if (typeof n !== "number" || !Number.isFinite(n)) continue;
    const valid = key === "width" || key === "height" ? Number.isSafeInteger(n) && n >= 256 && n <= 2048 && n % 8 === 0
      : key === "steps" ? Number.isSafeInteger(n) && n >= 1 && n <= 100
      : key === "batchSize" ? Number.isSafeInteger(n) && n >= 1 && n <= 4
      : key === "seed" ? Number.isSafeInteger(n) && n >= 0
      : n >= 0 && n <= 30;
    if (valid) result[key] = n;
  }
  if (typeof value.randomSeed === "boolean") result.randomSeed = value.randomSeed;
  for (const key of ["unetName", "clipName", "vaeName", "clipType"] as const) {
    if (typeof value[key] === "string" && value[key].trim() && !/[\u0000-\u001f]/.test(value[key])) result[key] = value[key];
  }
  return result;
}
export function readImagePreferences(storage = browserStorage()): Partial<ImageGenerationPreferences> {
  try {
    const raw = storage?.getItem(IMAGE_PREFERENCES_KEY);
    return { ...validImagePreferences(raw ? JSON.parse(raw) : null), ...session };
  } catch { return { ...session }; }
}
export function resolveImagePreferences(defaults?: Partial<ImageGenerationDefaults>, saved = readImagePreferences()): ImageGenerationPreferences {
  return { ...DEFAULT_IMAGE_PREFERENCES, ...validImagePreferences(defaults), ...validImagePreferences(saved) };
}
export function saveImagePreferences(patch: Partial<ImageGenerationPreferences>, storage = browserStorage()): void {
  session = { ...readImagePreferences(storage), ...validImagePreferences(patch) };
  try { storage?.setItem(IMAGE_PREFERENCES_KEY, JSON.stringify(session)); } catch { /* Keep preferences for this session when storage is unavailable. */ }
}
