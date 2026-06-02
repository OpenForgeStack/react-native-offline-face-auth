import { computeLBP } from './lbpFeatures';

export function analyzeTexture(
  pixels: Float32Array,
  width: number,
  height: number,
): { livenessScore: number; isLive: boolean } {
  const lbpHistogram = computeLBP(pixels, width, height);
  const uniformCount = lbpHistogram.reduce((sum, val) => sum + (val > 0 ? 1 : 0), 0);
  const score = Math.min(1, uniformCount / 59);
  return {
    livenessScore: score,
    isLive: score > 0.3,
  };
}
