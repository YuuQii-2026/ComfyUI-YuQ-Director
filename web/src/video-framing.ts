export const FRAME_RATIOS = [
  { id: "16:9", width: 1024, height: 576 },
  { id: "9:16", width: 576, height: 1024 },
  { id: "1:1", width: 768, height: 768 },
  { id: "4:3", width: 1024, height: 768 },
  { id: "3:4", width: 768, height: 1024 },
] as const;

type Size = { width: number; height: number };
const ratioBase = (id: string) => {
  const base = FRAME_RATIOS.find((item) => item.id === id);
  if (!base) throw new Error(`Unknown frame ratio: ${id}`);
  return base;
};
const align = (value: number) => Math.max(32, Math.round(value / 32) * 32);

export function frameSize(ratio: string, scale: number): Size {
  const base = ratioBase(ratio);
  return { width: align(base.width * scale), height: align(base.height * scale) };
}

export function identifyFrameSize(size: Size): { ratio: string; scale: number } | null {
  for (const base of FRAME_RATIOS) {
    for (let step = 3; step <= 20; step++) {
      const scale = step / 10;
      const candidate = frameSize(base.id, scale);
      if (candidate.width === size.width && candidate.height === size.height) return { ratio: base.id, scale };
    }
  }
  return null;
}

export function closestFrameScale(size: Size, ratio: string): number {
  const base = ratioBase(ratio);
  return Math.min(20, Math.max(3, Math.round(Math.sqrt(size.width * size.height / (base.width * base.height)) * 10))) / 10;
}

export function nearestFrameRatio(size: Size): string {
  return [...FRAME_RATIOS].sort((a, b) =>
    Math.abs(Math.log(size.width / size.height / (a.width / a.height))) -
    Math.abs(Math.log(size.width / size.height / (b.width / b.height)))
  )[0].id;
}
