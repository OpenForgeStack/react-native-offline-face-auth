import type { BoundingBox, AlignedFace } from '../types/detection.types';
import { cropFace } from '../preprocessing/cropFace';
import { resizeFrame } from '../preprocessing/resizeFrame';
import { normalizeFrame } from '../preprocessing/normalizeFrame';
import { correctRotation } from './rotationCorrection';

export function alignFace(
  pixels: Float32Array,
  frameWidth: number,
  frameHeight: number,
  box: BoundingBox,
  rollAngle: number = 0,
): AlignedFace {
  const cropped = cropFace(pixels, frameWidth, frameHeight, box);
  const corrected = correctRotation(cropped.pixels, cropped.width, cropped.height, rollAngle);
  const resized = resizeFrame(corrected, cropped.width, cropped.height, 112, 112);
  const normalized = normalizeFrame(resized, [-1, 1]);

  return {
    pixels: normalized,
    shape: [1, 112, 112, 3],
    rollAngle,
  };
}
