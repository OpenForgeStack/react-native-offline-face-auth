import { resizeFrame } from './resizeFrame';
import { normalizeFrame } from './normalizeFrame';

export function preprocessFrame(
  pixels: Float32Array,
  srcWidth: number,
  srcHeight: number,
  targetShape: [number, number, number],
): Float32Array {
  const [targetH, targetW, _channels] = targetShape;
  const resized = resizeFrame(pixels, srcWidth, srcHeight, targetW, targetH);
  return normalizeFrame(resized, [0, 1]);
}
