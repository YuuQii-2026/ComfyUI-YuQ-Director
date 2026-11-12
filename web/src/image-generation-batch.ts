import { abortError } from "./comfy-queue";
import { combineImagePrompt, effectiveImageSettings, imageFilenamePrefix, randomImageSeed, splitImagePrompt, type ImageGenerationRecord, type GeneratedImage, type QueueImageGeneration } from "./image-generation";
import type { ImageGenerationPreferences } from "./image-generation-preferences";
import type { DirectorAsset, QueueProgress } from "./types";

export function imageBatchCandidates(assets: DirectorAsset[]): DirectorAsset[] {
  return assets.filter((asset) => asset.enabled && asset.kind === "image" && Boolean(splitImagePrompt(asset.genPrompt ?? "").positive));
}
export interface ImageBatchOutcome { assetId: string; alias: string; status: "success" | "error"; error?: string }
export async function runImageGenerationBatch(options: {
  assets: DirectorAsset[];
  projectName: string;
  preferences: ImageGenerationPreferences;
  negativePrompt: string;
  signal: AbortSignal;
  queue: QueueImageGeneration;
  recover: (pending: NonNullable<DirectorAsset["imageGenerationPending"]>) => Promise<ImageGenerationRecord>;
  register: (projectName: string, image: GeneratedImage) => Promise<string>;
  onPending: (assetId: string, pending: NonNullable<DirectorAsset["imageGenerationPending"]> | null) => void;
  onRecord: (assetId: string, record: ImageGenerationRecord) => void | Promise<void>;
  onApply: (assetId: string, path: string, prompt: string, record: ImageGenerationRecord) => void | Promise<void>;
  onProgress?: (progress: QueueProgress) => void;
  onItem?: (asset: DirectorAsset, index: number, total: number) => void;
  onResult: (outcome: ImageBatchOutcome) => void;
}): Promise<void> {
  const { signal } = options;
  const checkAbort = () => { if (signal.aborted) throw abortError(); };
  const items = imageBatchCandidates(options.assets);
  // Validate the whole selection before queueing the first job.
  const jobs = items.map((asset) => {
    const prompt = splitImagePrompt(asset.genPrompt ?? "");
    const { randomSeed, ...preferences } = options.preferences;
    return { asset, settings: effectiveImageSettings({ ...preferences,
      positivePrompt: prompt.positive, negativePrompt: prompt.negative || options.negativePrompt,
      seed: randomSeed ? randomImageSeed() : preferences.seed,
      filenamePrefix: imageFilenamePrefix(options.projectName, asset.alias) }) };
  });
  for (const [index, { asset, settings }] of jobs.entries()) {
    checkAbort();
    options.onItem?.(asset, index, jobs.length);
    try {
      const createdAt = Date.now();
      const record = asset.imageGenerationPending
        ? await options.recover(asset.imageGenerationPending)
        : await options.queue({ ...settings, signal, onProgress: options.onProgress,
          onQueued: (promptId) => options.onPending(asset.id, { promptId, createdAt, settings }) });
      await options.onRecord(asset.id, record);
      options.onPending(asset.id, null);
      checkAbort();
      const first = record.images[0];
      if (!first) throw new Error("任务完成，但没有可用图片结果");
      const key = `${first.subfolder}/${first.filename}`;
      const path = record.registeredPaths?.[key] ?? await options.register(options.projectName, first);
      const registered = { ...record, registeredPaths: { ...record.registeredPaths, [key]: path } };
      // Registration may already have copied a file; persist it even if a stop arrives during registration.
      await options.onApply(asset.id, path, combineImagePrompt(record.settings.positivePrompt, record.settings.negativePrompt), registered);
      options.onResult({ assetId: asset.id, alias: asset.alias, status: "success" });
    } catch (error) {
      if (signal.aborted || (error instanceof Error && error.name === "AbortError")) throw abortError();
      options.onResult({ assetId: asset.id, alias: asset.alias, status: "error", error: error instanceof Error ? error.message : String(error) });
    }
  }
}
