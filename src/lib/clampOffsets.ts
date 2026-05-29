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

/**
 * Compute the cover-fit transform that makes a `naturalW × naturalH` image
 * appear at `frameW × frameH` size, centered. This is the closest uniform-
 * scale approximation of the browser's default `<img>` rendering ("fill"
 * stretch), and exactly matches `object-fit: cover` when aspect ratios match.
 *
 * Use this as the initial transform when wrapping a host-page image so the
 * visual on click matches the visual before click.
 */
export function coverFitTransform(
  naturalW: number,
  naturalH: number,
  frameW: number,
  frameH: number,
): { offsetX: number; offsetY: number; scale: number } {
  if (naturalW === 0 || naturalH === 0) {
    return { offsetX: 0, offsetY: 0, scale: 1 };
  }
  const scale = Math.max(frameW / naturalW, frameH / naturalH);
  return {
    offsetX: (frameW - naturalW * scale) / 2,
    offsetY: (frameH - naturalH * scale) / 2,
    scale,
  };
}
