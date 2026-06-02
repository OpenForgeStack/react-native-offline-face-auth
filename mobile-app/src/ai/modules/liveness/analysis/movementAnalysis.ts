import type { Landmark } from '../../landmarks/types/landmarks.types';
import { euclideanDistance2D } from '../../../shared/utils/mathUtils';

export interface MovementResult {
  hasMovement: boolean;
  movementMagnitude: number;
}

export function analyzeMovement(
  prevLandmarks: Landmark[],
  currLandmarks: Landmark[],
  threshold: number = 0.02,
): MovementResult {
  let totalMovement = 0;
  const samplePoints = [1, 33, 133, 152, 263, 362, 468];

  for (const idx of samplePoints) {
    if (idx < prevLandmarks.length && idx < currLandmarks.length) {
      totalMovement += euclideanDistance2D(
        { x: prevLandmarks[idx]!.x, y: prevLandmarks[idx]!.y },
        { x: currLandmarks[idx]!.x, y: currLandmarks[idx]!.y },
      );
    }
  }

  const avgMovement = totalMovement / samplePoints.length;
  return {
    hasMovement: avgMovement > threshold,
    movementMagnitude: avgMovement,
  };
}
