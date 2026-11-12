export const CAMERA_MOVEMENTS = [
  { value: "pushes in", label: ["推近", "Push in"] },
  { value: "pulls back", label: ["拉远", "Pull back"] },
  { value: "zooms in", label: ["变焦推近", "Zoom in"] },
  { value: "zooms out", label: ["变焦拉远", "Zoom out"] },
  { value: "pans left", label: ["左摇", "Pan left"] },
  { value: "pans right", label: ["右摇", "Pan right"] },
  { value: "trucks left", label: ["左移", "Truck left"] },
  { value: "trucks right", label: ["右移", "Truck right"] },
  { value: "tilts up", label: ["上摇", "Tilt up"] },
  { value: "tilts down", label: ["下摇", "Tilt down"] },
  { value: "pedestals up", label: ["升高", "Pedestal up"] },
  { value: "pedestals down", label: ["降低", "Pedestal down"] },
  { value: "tracks with the subject", label: ["跟拍", "Track subject"] },
  { value: "arcs around the subject", label: ["弧线移动", "Arc around subject"] },
  { value: "shakes slightly", label: ["轻微晃动", "Shake slightly"] },
  { value: "shakes strongly", label: ["强烈晃动", "Shake strongly"] },
  { value: "uses a POV shot", label: ["主观视角", "POV"] },
  { value: "rolls clockwise", label: ["顺时针旋转", "Roll clockwise"] },
  { value: "rolls counterclockwise", label: ["逆时针旋转", "Roll counterclockwise"] },
  { value: "remains static", label: ["静机", "Static"] },
  { value: "holds position and racks focus", label: ["静机移焦", "Rack focus"] },
] as const;

export const CAMERA_AMPLITUDES = [
  { value: "", label: ["默认", "Default"] },
  { value: "small amplitude", label: ["小幅度", "Small"] },
  { value: "large amplitude", label: ["大幅度", "Large"] },
] as const;

export const CAMERA_SPEEDS = [
  { value: "", label: ["默认", "Default"] },
  { value: "slow", label: ["缓慢", "Slow"] },
  { value: "fast", label: ["快速", "Fast"] },
] as const;

export function buildCameraMovementSentence(
  movement: string,
  trigger: string,
  target: string,
  ending: string,
  amplitude = "",
  speed = "",
  path = "",
): string {
  if (movement === "remains static") {
    return ending.trim() ? `The camera remains static on ${ending.trim()}.` : "The camera remains static.";
  }
  if (movement === "holds position and racks focus") {
    const focus = target.trim() ? `from ${target.trim()}` : "from the foreground";
    const destination = ending.trim() ? ` to ${ending.trim()}` : " to the background";
    return `The camera holds position and racks focus ${focus}${destination}.`;
  }
  if (movement === "uses a POV shot") {
    const perspective = target.trim() ? `from ${target.trim()}` : "from the subject's viewpoint";
    return `The camera adopts a POV perspective ${perspective}${ending.trim() ? `, settling on ${ending.trim()}` : ""}.`;
  }

  const clauses = [`As ${trigger.trim() || "the action unfolds"}, the camera ${movement}`];
  const directionalMove = !movement.startsWith("shakes") && !movement.startsWith("rolls");
  if (directionalMove && target.trim()) clauses.push(`toward ${target.trim()}`);
  if (directionalMove && path.trim()) clauses.push(`along ${path.trim()}`);
  if (amplitude.trim()) clauses.push(`with ${amplitude.trim()}`);
  if (speed.trim()) clauses.push(`at ${speed.trim()} speed`);
  let sentence = clauses.join(" ");
  if (ending.trim()) sentence += `, settling on ${ending.trim()}`;
  return `${sentence}.`;
}
