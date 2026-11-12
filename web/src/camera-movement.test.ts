import { describe, expect, it } from "vitest";
import { buildCameraMovementSentence } from "./camera-movement";

describe("buildCameraMovementSentence", () => {
  it("builds an action-triggered move with optional amplitude, speed, path and end frame", () => {
    expect(buildCameraMovementSentence("pushes in", "she raises the key", "the key in her hand", "a tight close-up of the key", "small amplitude", "slow", "the clear side of the table"))
      .toBe("As she raises the key, the camera pushes in toward the key in her hand along the clear side of the table with small amplitude at slow speed, settling on a tight close-up of the key.");
  });

  it("uses a neutral trigger when none is supplied", () => {
    expect(buildCameraMovementSentence("pans left", "", "", ""))
      .toBe("As the action unfolds, the camera pans left.");
  });

  it("keeps static shots free of action-move phrasing", () => {
    expect(buildCameraMovementSentence("remains static", "she raises the key", "the key", "a close-up of the hand"))
      .toBe("The camera remains static on a close-up of the hand.");
  });

  it("describes a focus change without implying camera translation", () => {
    expect(buildCameraMovementSentence("holds position and racks focus", "ignored", "the foreground key", "the face behind it"))
      .toBe("The camera holds position and racks focus from the foreground key to the face behind it.");
  });

  it("keeps POV and framed shake choices distinct from a tracked camera path", () => {
    expect(buildCameraMovementSentence("uses a POV shot", "ignored", "the detective", "the open doorway"))
      .toBe("The camera adopts a POV perspective from the detective, settling on the open doorway.");
    expect(buildCameraMovementSentence("shakes slightly", "the impact lands", "ignored", "a close view", "small amplitude", "slow", "ignored"))
      .toBe("As the impact lands, the camera shakes slightly with small amplitude at slow speed, settling on a close view.");
  });
});
