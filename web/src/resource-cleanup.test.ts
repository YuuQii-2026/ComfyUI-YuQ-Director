import { describe, expect, it } from "vitest";
import { collectAssetResources } from "./resource-cleanup";

const asset = (id: string, path: string) => ({ id, path, alias: id, kind: "image" as const, enabled: true, fixed: false, fixedOrder: 1, shotIds: [], includeVideoAudio: false, durationSeconds: null, audioDurationSeconds: null, fingerprint: "" });
describe("asset resource collection", () => {
  it("keeps paths still referenced by another asset", () => {
    const first = asset("a", "theodore_director/p/a.png");
    const second = asset("b", "theodore_director/p/a.png");
    expect(collectAssetResources({ assets: [first, second] } as never, [first])).toEqual({ candidates: [{ type: "input", path: first.path }], keep: [{ type: "input", path: second.path }] });
  });
  it("collects generated output and registered copies when replacing", () => {
    const result = collectAssetResources({ assets: [] } as never, [], { oldPath: "theodore_director/p/old.png", oldGeneration: { registeredPaths: { x: "theodore_director/p/old.png" }, images: [{ subfolder: "TheodoreDirector/ImageGen/p", filename: "old.png", type: "output" }] } });
    expect(result.candidates).toHaveLength(3);
  });
});
