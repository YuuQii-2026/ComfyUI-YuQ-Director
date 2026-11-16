import { describe, expect, it } from "vitest";
import { FRAME_RATIOS, closestFrameScale, frameSize, identifyFrameSize, nearestFrameRatio } from "./video-framing";

describe("first-pass framing", () => {
  it("recognizes the new default", () => {
    expect(frameSize("16:9", 0.4)).toEqual({ width: 416, height: 224 });
    expect(identifyFrameSize({ width: 416, height: 224 })).toEqual({ ratio: "16:9", scale: 0.4 });
  });
  it("preserves the old size and recognizes its scale", () => {
    expect(frameSize("16:9", 0.6)).toEqual({ width: 608, height: 352 });
    expect(identifyFrameSize({ width: 608, height: 352 })).toEqual({ ratio: "16:9", scale: 0.6 });
  });
  it("round-trips every selectable ratio and scale with valid 32-pixel dimensions", () => {
    for (const { id } of FRAME_RATIOS) for (let n = 3; n <= 20; n++) {
      const size = frameSize(id, n / 10);
      expect(size.width % 32).toBe(0);
      expect(size.height % 32).toBe(0);
      expect(identifyFrameSize(size)).toEqual({ ratio: id, scale: n / 10 });
    }
  });
  it("leaves other old sizes identifiable as custom and chooses a nearby scale", () => {
    expect(identifyFrameSize({ width: 640, height: 480 })).toBeNull();
    expect(nearestFrameRatio({ width: 640, height: 480 })).toBe("4:3");
    expect(closestFrameScale({ width: 640, height: 480 }, "4:3")).toBe(0.6);
  });
});
