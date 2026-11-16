export type AssetKind = "image" | "video" | "audio";
export type SecondSamplingMode = "off" | "super_resolution_second_pass" | "latent_upscale_second_pass" | "super_resolution_only";
export type PostprocessMode = Exclude<SecondSamplingMode, "off">;
export type ReviewStatus = "pending" | "approved" | "redo";

export interface DirectorAsset {
  id: string;
  alias: string;
  kind: AssetKind;
  path: string;
  enabled: boolean;
  fixed: boolean;
  fixedOrder: number;
  shotIds: string[];
  includeVideoAudio: boolean;
  durationSeconds: number | null;
  audioDurationSeconds: number | null;
  fingerprint: string;
  /** 以下字段只供导播台界面使用，Python 计划加载器会忽略，不参与生成 hash。 */
  group?: string;
  note?: string;
  genPrompt?: string;
  imageGeneration?: import("./image-generation").ImageGenerationRecord;
  imageGenerationHistory?: import("./image-generation").ImageGenerationRecord[];
  imageGenerationPending?: import("./image-generation").PendingImageGeneration;
}

/** 一次接力段生成实际读取的 latent 来源（秒级时间戳，与结果文件修改时间可比）。 */
export interface RelayRecord {
  /** 本次生成开始的时间。 */
  at: number;
  /** 写入被读取 latent 槽位的镜头 ID；null 表示该槽位还没有导播台记录。 */
  source: string | null;
  /** 该镜头写入 latent 的时间。 */
  sourceAt: number | null;
}

/** 审片状态只保存在计划里供界面使用；take 为选定的一采结果路径。 */
export interface ShotReview {
  status: ReviewStatus;
  take?: string;
  /** 最近一次生成完成时的提示词签名，用于提示“已修改但未重生”。 */
  generatedSig?: string;
  updatedAt?: number;
  /** 接力段最近若干次生成的 latent 来源，用于判断选定结果的接缝。 */
  relayHistory?: RelayRecord[];
}

/** latent 槽位（clip 序号）→ 最近写入它的镜头。槽位按启用顺序编号，插删镜头后会错位。 */
export type LatentWriters = Record<string, { shotId: string; at: number }>;

export interface DirectorShot {
  id: string;
  title: string;
  prompt: string;
  negativePrompt: string;
  durationSeconds: number;
  enabled: boolean;
  latentRelay: boolean;
  secondSamplingMode: SecondSamplingMode;
  seed: number | null;
  disabledAssetIds: string[];
  /** 中文分镜说明（画面、站位、对白摘要），只供审片时对照。 */
  note?: string;
  review?: ShotReview;
}

export interface DirectorPlan {
  schemaVersion: 5;
  /** 共用素材库信息；路径始终由当前 ComfyUI 服务器解释。 */
  assetLibrary?: { id: string; name: string };
  project: { id: string; name: string; runId: string; notes?: string };
  defaults: { fps: number; baseSeed: number; durationSeconds?: number; secondSamplingMode?: SecondSamplingMode };
  /** 仅供内置分镜控制使用；模型与采样连接由当前画布决定。 */
  generation?: { width: number; height: number };
  promptPrefix: string;
  promptSuffix: string;
  continuity: {
    mode: string;
    videoContextFrames: number;
    audioContextFrames: number;
    durationMode: string;
  };
  /** UI-only phase state; the Python plan loader ignores this metadata safely. */
  pipeline?: {
    phase: "first_pass" | "review" | "second_pass";
    firstPassConfirmed: boolean;
    secondPassMode: Exclude<SecondSamplingMode, "off">;
    /** 整体二采重绘强度；越低接缝越稳，越高细节越多。 */
    secondPassDenoise?: number;
    /** 未设置时使用工作流画布中的倍率。 */
    secondPassScale?: number;
    /** 导播台一采时记录的 latent 槽位写入者；缺失表示没有记录（旧项目），不做来源检查。 */
    latentWriters?: LatentWriters;
  };
  /** 网页偏好只由编辑器使用，不参与 Python 生成协议。 */
  uiPreferences?: { autoSave?: boolean; compactMode?: boolean };
  assets: DirectorAsset[];
  shots: DirectorShot[];
}

export interface ResolvedPreview {
  compiledPrompt: string;
  errors: string[];
  slots: Array<{ label: string; alias: string; kind: string }>;
  mixedFiles: number;
  audioCount: number;
}

export interface SecondPassQueueRequest {
  plan: DirectorPlan;
  shotId: string;
  sourcePath: string;
  requestId: string;
  processingMode: PostprocessMode;
  batchId?: string;
  sequenceIndex?: number;
  latentRelay?: boolean;
  relayVersion?: number;
  sourceSelections?: Record<string, string>;
  workflowSignature?: string;
  continuityMode?: "h3_native_prefix_right_context_v1";
  skipIfValid?: boolean;
  phase?: "second_pass";
  /** 仅修改本次提交的二采调度器 denoise，不改动用户工作流。 */
  denoise?: number;
  signal?: AbortSignal;
  onProgress?: (progress: QueueProgress) => void;
}

export interface QueueProgress {
  value: number;
  max: number;
  node?: string;
}

export interface FirstPassQueueRequest {
  plan: DirectorPlan;
  /** 需要生成的镜头 ID，按分镜顺序逐段提交；缺省时生成全部启用镜头。 */
  shotIds?: string[];
  signal?: AbortSignal;
  onProgress?: (progress: QueueProgress) => void;
  onShotStart?: (shotId: string, index: number, total: number) => void;
  onShotDone?: (shotId: string, index: number, total: number) => void;
}

export type QueueFirstPass = (request: FirstPassQueueRequest) => Promise<void>;
export type QueueSecondPass = (request: SecondPassQueueRequest) => Promise<void>;

/** JSON 素材清单；媒体文件保留在 ComfyUI 的 input 目录。 */
export interface AssetLibraryDocument {
  format: "theodore-assets";
  version: 1;
  library: { id: string; name: string };
  assets: DirectorAsset[];
}

export interface EpisodeAssetReference {
  id: string;
  alias: string;
  kind: AssetKind;
  enabled?: boolean;
  fixed?: boolean;
  shotIds?: string[];
  includeVideoAudio?: boolean;
}

/** 分镜文件通过别名引用素材，不携带素材路径和生成提示词。 */
export interface EpisodeDocument extends Omit<DirectorPlan, "assets"> {
  format: "theodore-episode";
  version: 1;
  requiredAssets: EpisodeAssetReference[];
}
