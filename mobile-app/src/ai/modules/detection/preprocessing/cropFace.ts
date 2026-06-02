import type { BoundingBox } from '../types/detection.types';

export function cropFace(
  pixels: Float32Array,
  frameWidth: number,
  frameHeight: number,
  box: BoundingBox,
  paddingPercent: number = 0.2,
): { pixels: Float32Array; width: number; height: number } {
  const padW = box.width * paddingPercent;
  const padH = box.height * paddingPercent;

  let x1 = Math.max(0, Math.floor(box.x - padW));
  let y1 = Math.max(0, Math.floor(box.y - padH));
  let x2 = Math.min(frameWidth - 1, Math.ceil(box.x + box.width + padW));
  let y2 = Math.min(frameHeight - 1, Math.ceil(box.y + box.height + padH));

  const cropW = x2 - x1;
  const cropH = y2 - y1;
  const channels = 3;
  const cropped = new Float32Array(cropW * cropH * channels);

  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      const srcIdx = (y * frameWidth + x) * channels;
      const dstIdx = ((y - y1) * cropW + (x - x1)) * channels;
      for (let c = 0; c < channels; c++) {
        cropped[dstIdx + c] = pixels[srcIdx + c]!;
      }
    }
  }

  return { pixels: cropped, width: cropW, height: cropH };
}
