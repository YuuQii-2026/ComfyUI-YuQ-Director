import { describe, expect, it } from "vitest";
import type { GeneratedVideoItem } from "./generated-results";
import { activeIndexOf, chosenTake, deliverableFor, firstPassTakes, latentWriteSlot, relayChain, relayRecordFor, relaySourceIssue, relaysFromPrevious, seamState, shotModifiedSinceGeneration, shotSignature, withRelayPredecessors } from "./review";
import type { DirectorPlan, DirectorShot } from "./types";

function shot(id: string, extra: Partial<DirectorShot> = {}): DirectorShot {
  return { id, title: id, prompt: `prompt ${id}`, negativePrompt: "", durationSeconds: 6, enabled: true, latentRelay: false, secondSamplingMode: "off", seed: null, disabledAssetIds: [], ...extra };
}

function plan(shots: DirectorShot[]): DirectorPlan {
  return {
    schemaVersion: 5,
    project: { id: "p", name: "demo", runId: "run_001" },
    defaults: { fps: 24, baseSeed: 1 },
    promptPrefix: "",
    promptSuffix: "",
    continuity: { mode: "h3_av_latent", videoContextFrames: 22, audioContextFrames: 24, durationMode: "final_output" },
    assets: [],
    shots,
  };
}

const take = (path: string, modifiedAt: number, extra: Partial<GeneratedVideoItem> = {}): GeneratedVideoItem => ({ path, modifiedAt, stage: "first_pass", ...extra });

describe("审片结果选择", () => {
  it("修改画幅、FPS 和基础种子会标记已生成镜头变化", () => {
    const storyboard = plan([shot("s1")]); storyboard.generation = { width: 608, height: 352 };
    const original = shotSignature(storyboard, storyboard.shots[0]);
    storyboard.generation.width = 352;
    expect(shotSignature(storyboard, storyboard.shots[0])).not.toBe(original);
    storyboard.generation.width = 608; storyboard.defaults.fps = 30;
    expect(shotSignature(storyboard, storyboard.shots[0])).not.toBe(original);
    storyboard.defaults.fps = 24; storyboard.defaults.baseSeed++;
    expect(shotSignature(storyboard, storyboard.shots[0])).not.toBe(original);
  });
  it("只把一采与旧结果作为候选，并优先使用用户选择", () => {
    const results = [take("a1", 10), take("a2", 20), take("a2_2nd", 30, { stage: "second_pass", sourcePath: "a2" }), take("legacy", 5, { stage: "legacy_unknown" })];
    const takes = firstPassTakes(results);
    expect(takes.map((item) => item.path)).toEqual(["a2", "a1", "legacy"]);
    expect(chosenTake(shot("s1"), takes)?.path).toBe("a2");
    expect(chosenTake(shot("s1", { review: { status: "approved", take: "a1" } }), takes)?.path).toBe("a1");
    expect(chosenTake(shot("s1", { review: { status: "approved", take: "deleted" } }), takes)?.path).toBe("a2");
  });

  it("合并时优先使用选定结果派生的二采", () => {
    const results = [take("a1", 10), take("a2", 20), take("a1_2nd", 30, { stage: "second_pass", sourcePath: "a1" })];
    expect(deliverableFor(shot("s1", { review: { status: "approved", take: "a1" } }), results)).toEqual({ item: results[2], processed: true });
    expect(deliverableFor(shot("s1"), results)).toEqual({ item: results[1], processed: false });
  });
});

describe("latent 接力链", () => {
  const storyboard = plan([shot("s1", { latentRelay: true }), shot("s2", { latentRelay: true }), shot("s3", { enabled: false }), shot("s4", { latentRelay: true }), shot("s5")]);

  it("首个启用镜头忽略接力，禁用镜头不打断链条", () => {
    expect(relaysFromPrevious(storyboard, storyboard.shots[0])).toBe(false);
    expect(relaysFromPrevious(storyboard, storyboard.shots[1])).toBe(true);
    expect(relayChain(storyboard, "s1")).toEqual(["s1", "s2", "s4"]);
    expect(relayChain(storyboard, "s4")).toEqual(["s4"]);
    expect(activeIndexOf(storyboard, "s4")).toBe(2);
  });

  it("按生成时间判断接缝是否与选定的上一段一致", () => {
    const previous = [take("p_new", 50), take("p_old", 10)];
    expect(seamState(previous[1], previous, take("c", 20))).toBe("ok");
    expect(seamState(previous[0], previous, take("c", 20))).toBe("mismatch");
    expect(seamState(previous[0], previous, take("c", 5))).toBe("unknown");
  });
});

describe("latent 槽位来源", () => {
  it("写入槽位与 Python next_index 一致，最后一段写 0", () => {
    const storyboard = plan([shot("a"), shot("b", { enabled: false }), shot("c")]);
    expect(latentWriteSlot(storyboard, "a")).toBe(1);
    expect(latentWriteSlot(storyboard, "c")).toBe(0);
  });

  it("禁用前序镜头后，槽位写入者不是当前上一段时会被识别并补上上一段", () => {
    const storyboard = plan([shot("a"), shot("b"), shot("c", { latentRelay: true })]);
    storyboard.pipeline = { phase: "first_pass", firstPassConfirmed: false, secondPassMode: "super_resolution_second_pass", latentWriters: { "1": { shotId: "a", at: 10 }, "2": { shotId: "b", at: 20 } } };
    expect(relaySourceIssue(storyboard, "c")).toBeNull();
    storyboard.shots[0].enabled = false;
    // 现在 c 位于槽位 1，读到的是 a 写入的 latent，而上一段是 b。
    expect(relaySourceIssue(storyboard, "c")).toBe("wrong");
    expect(withRelayPredecessors(storyboard, ["c"])).toEqual({ shotIds: ["b", "c"], added: ["b"] });
  });

  it("末尾新增的接力段读取的槽位没有记录时视为缺失；没有任何记录的旧项目不检查", () => {
    const storyboard = plan([shot("p"), shot("c", { latentRelay: true })]);
    expect(relaySourceIssue(storyboard, "c")).toBeNull();
    storyboard.pipeline = { phase: "first_pass", firstPassConfirmed: false, secondPassMode: "super_resolution_second_pass", latentWriters: { "0": { shotId: "p", at: 10 } } };
    expect(relaySourceIssue(storyboard, "c")).toBe("missing");
  });

  it("有来源记录时按记录判断接缝", () => {
    const previous = [take("p_new", 50), take("p_old", 10)];
    const current = take("c", 60);
    expect(seamState(previous[0], previous, current, "p", { at: 55, source: "p", sourceAt: 50 })).toBe("ok");
    expect(seamState(previous[0], previous, current, "p", { at: 55, source: "p", sourceAt: 12 })).toBe("mismatch");
    expect(seamState(previous[0], previous, current, "p", { at: 55, source: "x", sourceAt: 50 })).toBe("wrong_source");
    const reviewed = shot("c", { review: { status: "pending", relayHistory: [{ at: 5, source: "p", sourceAt: 1 }, { at: 55, source: "p", sourceAt: 50 }] } });
    expect(relayRecordFor(reviewed, current)?.at).toBe(55);
    expect(relayRecordFor(reviewed, take("old", 8))?.at).toBe(5);
  });
});

describe("修改检测", () => {
  it("提示词变化会改变签名，中文说明和审片状态不会", () => {
    const storyboard = plan([shot("s1")]);
    const signature = shotSignature(storyboard, storyboard.shots[0]);
    storyboard.shots[0].review = { status: "approved", generatedSig: signature };
    storyboard.shots[0].note = "中文说明";
    expect(shotModifiedSinceGeneration(storyboard, storyboard.shots[0])).toBe(false);
    storyboard.shots[0].prompt = "changed";
    expect(shotModifiedSinceGeneration(storyboard, storyboard.shots[0])).toBe(true);
  });
});
