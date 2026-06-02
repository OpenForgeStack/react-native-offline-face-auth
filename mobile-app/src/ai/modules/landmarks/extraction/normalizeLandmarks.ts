import type { Landmark } from '../types/landmarks.types';

export function normalizeLandmarks(
  landmarks: Landmark[],
  frameWidth: number,
  frameHeight: number,
): Landmark[] {
  return landmarks.map((lm) => ({
    x: lm.x * frameWidth,
    y: lm.y * frameHeight,
    z: lm.z,
  }));
}
