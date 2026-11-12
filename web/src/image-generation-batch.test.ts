import { afterEach, describe, expect, it, vi } from "vitest";
import { imageBatchCandidates, runImageGenerationBatch } from "./image-generation-batch";
import { DEFAULT_IMAGE_PREFERENCES } from "./image-generation-preferences";
import type { DirectorAsset } from "./types";
import type { QueueImageGenerationRequest } from "./image-generation";

const asset = (id: string, patch: Partial<DirectorAsset> = {}): DirectorAsset => ({ id, alias: id, kind: "image", path: "", genPrompt: `${id} portrait`, enabled: true, fixed: false, fixedOrder: 1, shotIds: [], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null, fingerprint: "", ...patch });
function setup(assets = [asset("a"), asset("b")]) {
  const controller = new AbortController();
  const queue = vi.fn(async (request: QueueImageGenerationRequest) => {
    request.onQueued?.(`id-${request.positivePrompt[0]}`);
    return { promptId: `id-${request.positivePrompt[0]}`, createdAt: 1, settings: request,
      images: [{ filename: `${request.positivePrompt[0]}.png`, subfolder: "TheodoreDirector/ImageGen/test", type: "output" as const, url: "/view" }] };
  });
  return { assets, preferences: { ...DEFAULT_IMAGE_PREFERENCES, width: 1536, height: 1024, steps: 24, seed: 42 }, projectName: "test", negativePrompt: "bad", signal: controller.signal, queue,
    recover: vi.fn(), register: vi.fn(async (_project, image) => `theodore_director/test/${image.filename}`),
    onPending: vi.fn(), onRecord: vi.fn(), onApply: vi.fn(), onResult: vi.fn(), controller };
}
afterEach(() => vi.restoreAllMocks());
describe("image generation batch", () => {
  it("only offers enabled image assets with their own prompts", () => {
    expect(imageBatchCandidates([asset("a"), asset("b", { enabled: false }), asset("c", { kind: "audio" }), asset("d", { genPrompt: "" }), asset("e", { path: "old.png" })]).map((a) => a.id)).toEqual(["a", "e"]);
  });
  it("uses shared settings and each asset's own prompt, registering before the next queue call", async () => {
    const options = setup([asset("a"), asset("b", { genPrompt: "b scene\nNegative prompt: custom" })]);
    await runImageGenerationBatch(options);
    expect(options.queue.mock.calls[0][0]).toMatchObject({ width: 1536, height: 1024, steps: 24, seed: 42 });
    expect(options.queue.mock.calls[1][0].positivePrompt).toContain("b scene");
    expect(options.queue.mock.calls[1][0].negativePrompt).toContain("custom");
    expect(options.onApply.mock.calls[0][0]).toBe("a");
    expect(options.onApply.mock.invocationCallOrder[0]).toBeLessThan(options.queue.mock.invocationCallOrder[1]);
    expect(options.onResult.mock.calls.map((call) => call[0].status)).toEqual(["success", "success"]);
  });
  it("randomizes each asset without changing the remembered fixed seed", async () => {
    const options = setup();
    options.preferences = { ...options.preferences, randomSeed: true };
    vi.spyOn(Math, "random").mockReturnValueOnce(0.1).mockReturnValueOnce(0.2).mockReturnValueOnce(0.3).mockReturnValueOnce(0.4);
    await runImageGenerationBatch(options);
    expect(options.queue.mock.calls[0][0].seed).not.toBe(options.queue.mock.calls[1][0].seed);
    expect(options.preferences.seed).toBe(42);
  });
  it("reports failure and continues to the next selected asset", async () => {
    const options = setup();
    options.queue.mockRejectedValueOnce(new Error("GPU error"));
    await runImageGenerationBatch(options);
    expect(options.onResult.mock.calls.map((call) => call[0].status)).toEqual(["error", "success"]);
    expect(options.onApply).toHaveBeenCalledTimes(1);
  });
  it("stopping saves completed items and prevents subsequent jobs", async () => {
    const options = setup();
    options.onApply.mockImplementationOnce(() => options.controller.abort());
    await expect(runImageGenerationBatch(options)).rejects.toMatchObject({ name: "AbortError" });
    expect(options.queue).toHaveBeenCalledTimes(1);
    expect(options.onApply).toHaveBeenCalledTimes(1);
    expect(options.onResult).toHaveBeenCalledWith(expect.objectContaining({ assetId: "a", status: "success" }));
  });
  it("recovers an existing queued task without submitting another image job", async () => {
    const options = setup([asset("a")]);
    const record = await options.queue({ ...DEFAULT_IMAGE_PREFERENCES, positivePrompt: "recovered", negativePrompt: "", filenamePrefix: "TheodoreDirector/ImageGen/test/a" });
    options.queue.mockClear();
    options.assets[0].imageGenerationPending = { promptId: "old", createdAt: 1, settings: record.settings };
    options.recover.mockResolvedValue(record);
    await runImageGenerationBatch(options);
    expect(options.queue).not.toHaveBeenCalled();
    expect(options.recover).toHaveBeenCalledTimes(1);
    expect(options.onApply).toHaveBeenCalledTimes(1);
  });
  it("rejects invalid batch parameters before any job is submitted", async () => {
    const options = setup();
    options.preferences.width = 777;
    await expect(runImageGenerationBatch(options)).rejects.toThrow("宽度");
    expect(options.queue).not.toHaveBeenCalled();
  });
});
