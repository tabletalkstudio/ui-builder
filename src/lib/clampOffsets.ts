/**
 * Compute clamped pan offsets so a scaled image always covers its frame.
 * Shared by the SPA editor (ImageFrame.tsx) and the bookmarklet's
 * in-place editor (HostImageEditor.tsx).
 */
export function clampOffsets(
  offsetX: number,
  offsetY: number,
  scale: number,
  imageW: number,
  imageH: number,
  frameW: number,
  frameH: number,
): { x: number; y: number } {
  const scaledW = imageW * scale;
  const scaledH = imageH * scale;
  const minX = frameW - scaledW;
  const minY = frameH - scaledH;
  return {
    x: Math.min(0, Math.max(minX, offsetX)),
    y: Math.min(0, Math.max(minY, offsetY)),
  };
}

export function minScaleForCover(
  imgW: number,
  imgH: number,
  frameW: number,
  frameH: number,
): number {
  if (imgW === 0 || imgH === 0) return 1;
  return Math.max(frameW / imgW, frameH / imgH);
}
