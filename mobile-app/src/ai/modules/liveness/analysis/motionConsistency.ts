import type { Landmark } from '../../landmarks/types/landmarks.types';

export interface ConsistencyResult {
  isConsistent: boolean;
  confidence: number;
}

export function checkMotionConsistency(
  landmarksSequence: Landmark[][],
): ConsistencyResult {
  if (landmarksSequence.length < 2) {
    return { isConsistent: false, confidence: 0 };
  }

  const thresholds = [0.01, 0.03, 0.05, 0.1];
  let consistentFrames = 0;

  for (let i = 1; i < landmarksSequence.length; i++) {
    const prev = landmarksSequence[i - 1]!;
    const curr = landmarksSequence[i]!;
    const movements: number[] = [];

    for (let j = 0; j < Math.min(10, prev.length); j++) {
      const dx = curr[j]!.x - prev[j]!.x;
      const dy = curr[j]!.y - prev[j]!.y;
      movements.push(Math.sqrt(dx * dx + dy * dy));
    }

    const avgMovement = movements.reduce((a, b) => a + b, 0) / movements.length;
    if (thresholds.some((t) => avgMovement < t)) {
      consistentFrames++;
    }
  }

  const ratio = consistentFrames / (landmarksSequence.length - 1);
  return {
    isConsistent: ratio > 0.6,
    confidence: ratio,
  };
}
