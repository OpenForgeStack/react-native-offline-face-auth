import type { Landmark } from '../../landmarks/types/landmarks.types';
import { euclideanDistance2D } from '../../../shared/utils/mathUtils';
import type { EARResult } from '../types/liveness.types';

export function computeEAR(eyeLandmarks: { left: Landmark[]; right: Landmark[] }): EARResult {
  const leftEAR = calculateSingleEAR(eyeLandmarks.left);
  const rightEAR = calculateSingleEAR(eyeLandmarks.right);
  const averageEAR = (leftEAR + rightEAR) / 2;

  return {
    leftEAR,
    rightEAR,
    averageEAR,
    blinkDetected: averageEAR < 0.21,
  };
}

function calculateSingleEAR(eyePoints: Landmark[]): number {
  if (eyePoints.length < 6) return 1.0;

  const p1 = eyePoints[0]!;
  const p2 = eyePoints[1]!;
  const p3 = eyePoints[2]!;
  const p4 = eyePoints[3]!;
  const p5 = eyePoints[4]!;
  const p6 = eyePoints[5]!;

  const vertical1 = euclideanDistance2D(
    { x: p2.x, y: p2.y },
    { x: p6.x, y: p6.y },
  );
  const vertical2 = euclideanDistance2D(
    { x: p3.x, y: p3.y },
    { x: p5.x, y: p5.y },
  );
  const horizontal = euclideanDistance2D(
    { x: p1.x, y: p1.y },
    { x: p4.x, y: p4.y },
  );

  if (horizontal === 0) return 1.0;
  return (vertical1 + vertical2) / (2 * horizontal);
}
