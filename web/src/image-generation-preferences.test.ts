import { beforeEach, describe, expect, it, vi } from "vitest";

const memoryStorage = () => {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
};
beforeEach(() => vi.resetModules());

describe("shared image generation preferences", () => {
  it("remembers model files and encoder type across reloads, preserving unavailable selections for correction", async () => {
    let prefs = await import("./image-generation-preferences");
    const storage = memoryStorage();
    const selected = { unetName: "folder/alternate.safetensors", clipName: "qwen.safetensors", vaeName: "ae.safetensors", clipType: "lumina2" };
    prefs.saveImagePreferences(selected, storage);
    vi.resetModules();
    prefs = await import("./image-generation-preferences");
    expect(prefs.resolveImagePreferences({ unetName: "default.safetensors" }, prefs.readImagePreferences(storage))).toMatchObject(selected);
    expect(prefs.validImagePreferences({ unetName: "", clipName: 1, vaeName: "bad\nfile" })).toEqual({});
  });
  it("defaults to 1080×720 and preserves width, steps, randomization and fixed seed across a reload", async () => {
    let prefs = await import("./image-generation-preferences");
    const storage = memoryStorage();
    expect(prefs.resolveImagePreferences(undefined, {})).toMatchObject({ width: 1080, height: 720, steps: 12, randomSeed: false });
    prefs.saveImagePreferences({ width: 1536, height: 1024, steps: 24, cfg: 2.5, batchSize: 3, seed: 42, randomSeed: true }, storage);
    vi.resetModules();
    prefs = await import("./image-generation-preferences");
    expect(prefs.resolveImagePreferences({ width: 1080, height: 720, steps: 12 }, prefs.readImagePreferences(storage))).toEqual({ width: 1536, height: 1024, steps: 24, cfg: 2.5, batchSize: 3, seed: 42, randomSeed: true });
    prefs.saveImagePreferences({ randomSeed: false }, storage);
    expect(prefs.resolveImagePreferences(undefined, prefs.readImagePreferences(storage))).toMatchObject({ seed: 42, randomSeed: false, steps: 24 });
  });
  it("edits made before async defaults arrive take priority over the workflow", async () => {
    const prefs = await import("./image-generation-preferences");
    const storage = memoryStorage();
    prefs.saveImagePreferences({ width: 1440, steps: 28, randomSeed: true }, storage);
    expect(prefs.resolveImagePreferences({ width: 1080, steps: 12, seed: 123 }, prefs.readImagePreferences(storage))).toMatchObject({ width: 1440, steps: 28, randomSeed: true, seed: 123 });
  });
  it("partial numeric input cannot overwrite valid saved settings", async () => {
    const prefs = await import("./image-generation-preferences");
    const storage = memoryStorage();
    prefs.saveImagePreferences({ width: 1536, steps: 20 }, storage);
    prefs.saveImagePreferences({ width: NaN, steps: 0, batchSize: 100 }, storage);
    expect(prefs.readImagePreferences(storage)).toMatchObject({ width: 1536, steps: 20 });
    expect(prefs.validImagePreferences({ width: 1081, height: 1024, randomSeed: "true" })).toEqual({ height: 1024 });
  });
  it("corrupt or blocked browser storage keeps the session usable", async () => {
    const prefs = await import("./image-generation-preferences");
    const blocked = { getItem() { throw new Error("denied"); }, setItem() { throw new Error("quota"); } };
    prefs.saveImagePreferences({ width: 1280, randomSeed: true }, blocked);
    expect(prefs.readImagePreferences(blocked)).toMatchObject({ width: 1280, randomSeed: true });
    expect(prefs.readImagePreferences({ ...blocked, getItem: () => "{" })).toMatchObject({ width: 1280 });
  });
  it("keeps new session settings when storage reads succeed but writes fail", async () => {
    const prefs = await import("./image-generation-preferences");
    const stale = { getItem: () => JSON.stringify({ width: 1080, steps: 12, randomSeed: false }), setItem() { throw new Error("quota"); } };
    prefs.saveImagePreferences({ width: 1536, steps: 24, randomSeed: true }, stale);
    expect(prefs.readImagePreferences(stale)).toMatchObject({ width: 1536, steps: 24, randomSeed: true });
    prefs.saveImagePreferences({ height: 1024 }, stale);
    expect(prefs.readImagePreferences(stale)).toMatchObject({ width: 1536, height: 1024, steps: 24, randomSeed: true });
  });
});
