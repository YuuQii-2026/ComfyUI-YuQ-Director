import { describe, expect, it } from "vitest";
import { prepareSecondPassSubmission, secondPassJobs, secondPassWorkflowSignature } from "./second-pass-jobs";
import type { ApiPrompt } from "./comfy-prompt";
import { normalizePlan } from "./plan-io";
import type { DirectorPlan } from "./types";

const plan = () => normalizePlan({ schemaVersion: 5, defaults: { fps: 24, baseSeed: 10 }, promptPrefix: "", promptSuffix: "",
  continuity: { mode: "h3_av_latent", videoContextFrames: 22, audioContextFrames: 24, durationMode: "final_output" },
  project: { name: "Test", runId: "run", id: "test" }, assets: [],
  shots: [1, 2, 3].map((i) => ({ id: `s${i}`, title: `S${i}`, prompt: "test", enabled: true,
    negativePrompt: "", durationSeconds: 5, secondSamplingMode: "off", seed: null, disabledAssetIds: [],
    latentRelay: i > 1, review: { status: "approved" } })),
} as DirectorPlan);
const results = { s1: [{ path: "one.mp4", stage: "first_pass" as const }], s2: [{ path: "two.mp4", stage: "first_pass" as const }], s3: [{ path: "three.mp4", stage: "first_pass" as const }] };

describe("second-pass relay jobs", () => {
  const request = () => ({ plan: plan(), shotId: "s1", sourcePath: "one.mp4", requestId: "first",
    processingMode: "super_resolution_second_pass" as const, sourceSelections: { s1: "one.mp4", s2: "two.mp4" } });
  const graph = (native?: boolean): ApiPrompt => ({
    source: { class_type: "TheodoreDirector_PostprocessSecondPassSource", inputs: native === undefined ? {} : { native_continuity: native } },
    save: { class_type: "TheodoreDirector_SaveSecondPass", inputs: { request: ["source", 2] } },
  });
  it.each([true, false, undefined])("uses the same continuity mode for prepare and execution (native=%s)", (native) => {
    const source = graph(native), original = structuredClone(source);
    const input = request();
    const result = prepareSecondPassSubmission(source, "source", "save", input);
    const execution = JSON.parse(String(result.output.source.inputs.request_json));
    expect(execution).toEqual(result.payload);
    expect(execution.continuityMode).toBe(native ? "h3_native_prefix_right_context_v1" : undefined);
    expect(execution.relayVersion).toBe(1);
    expect(source).toEqual(original);
    expect(input).not.toHaveProperty("workflowSignature");
  });
  it("keeps a stable graph signature across shots and retries, and distinguishes native mode", () => {
    const source = graph(true), input = request();
    const first = prepareSecondPassSubmission(source, "source", "save", input);
    const next = prepareSecondPassSubmission(source, "source", "save", { ...input, shotId: "s2", sourcePath: "two.mp4", requestId: "next", skipIfValid: true });
    expect(next.payload.workflowSignature).toBe(first.payload.workflowSignature);
    expect(next.payload.workflowSignature).not.toBe(prepareSecondPassSubmission(graph(false), "source", "save", input).payload.workflowSignature);
    expect(prepareSecondPassSubmission(graph(false), "source", "save", first.payload).payload.continuityMode).toBeUndefined();
  });
  it("excludes local callbacks and cancellation from the submitted request", () => {
    const result = prepareSecondPassSubmission(graph(true), "source", "save", { ...request(), signal: new AbortController().signal, onProgress: () => {} });
    expect(result.payload).not.toHaveProperty("signal");
    expect(result.payload).not.toHaveProperty("onProgress");
  });
  it("requires the native switch to be known before preflight", () => {
    const source = graph(); source.source.inputs.native_continuity = ["switch", 0];
    expect(() => prepareSecondPassSubmission(source, "source", "save", request())).toThrow("native_continuity");
  });
  it("includes approved ancestors in order and reuses valid ancestors", () => {
    const run = secondPassJobs(plan(), ["s3"], results, "super_resolution_second_pass", false);
    expect(run.jobs.map((job) => [job.shot.id, job.skipIfValid])).toEqual([["s1", true], ["s2", true], ["s3", false]]);
    expect(run.selections.s2).toBe("two.mp4");
  });
  it("deduplicates requested chains and stops at a cut", () => {
    const p = plan(); p.shots[1].latentRelay = false;
    expect(secondPassJobs(p, ["s3", "s2"], results, "latent_upscale_second_pass", true).jobs.map((j) => j.shot.id)).toEqual(["s2", "s3"]);
  });
  it("never generates an unapproved predecessor", () => {
    const p = plan(); p.shots[0].review = { status: "pending" };
    expect(() => secondPassJobs(p, ["s3"], results, "super_resolution_second_pass", true)).toThrow("尚未通过审片");
  });
  it("does not expand pure upscaling into a relay chain", () => {
    expect(secondPassJobs(plan(), ["s3"], results, "super_resolution_only", false).jobs.map((j) => j.shot.id)).toEqual(["s3"]);
  });
  it("lets the server validate pure-upscale cache against current neighboring sources", () => {
    const cached = { ...results, s1: [...results.s1, { path: "old.mp4", stage: "upscaled" as const, sourcePath: "one.mp4", processingMode: "super_resolution_only" as const }] };
    const jobs = secondPassJobs(plan(), ["s1"], cached, "super_resolution_only", true).jobs;
    expect(jobs.map(j => [j.shot.id, j.skipIfValid])).toEqual([["s1", true]]);
  });
  it("ignores request IDs in the workflow signature but detects changed parameters", () => {
    const a = { source: { class_type: "TheodoreDirector_PostprocessSecondPassSource", inputs: { request_json: "A" } }, model: { class_type: "UNETLoader", inputs: { name: "A" } } };
    const b = structuredClone(a); b.source.inputs.request_json = "B";
    expect(secondPassWorkflowSignature(a)).toBe(secondPassWorkflowSignature(b));
    b.model.inputs.name = "B";
    expect(secondPassWorkflowSignature(a)).not.toBe(secondPassWorkflowSignature(b));
  });
});
