import type { ComposerState } from "../state";

export async function cropImage(state: ComposerState): Promise<Blob> {
  const { image, frame, imageTransform } = state;
  if (!image.src) throw new Error("No image to crop");

  const img = await loadImage(image.src);

  const outputScale = image.is2x ? 2 : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(frame.w * outputScale);
  canvas.height = Math.round(frame.h * outputScale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Editor draws image at (offsetX, offsetY) scaled by `scale`.
  // For a pixel at frame coords (fx, fy), the source pixel is:
  //   sx = (fx - offsetX) / scale
  //   sy = (fy - offsetY) / scale
  const { offsetX, offsetY, scale } = imageTransform;
  const sx = -offsetX / scale;
  const sy = -offsetY / scale;
  const sw = frame.w / scale;
  const sh = frame.h / scale;

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("toBlob failed"));
    }, "image/png");
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
