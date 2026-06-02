import type { Landmark } from '../../landmarks/types/landmarks.types';
import { euclideanDistance2D } from '../../../shared/utils/mathUtils';
import type { MARResult } from '../types/liveness.types';

export function computeMAR(mouth: {
  upper: Landmark;
  lower: Landmark;
  left: Landmark;
  right: Landmark;
}): MARResult {
  const vertical = euclideanDistance2D(
    { x: mouth.upper.x, y: mouth.upper.y },
    { x: mouth.lower.x, y: mouth.lower.y },
  );
  const horizontal = euclideanDistance2D(
    { x: mouth.left.x, y: mouth.left.y },
    { x: mouth.right.x, y: mouth.right.y },
  );

  const mar = horizontal === 0 ? 0 : vertical / horizontal;

  const mouthCenterY = (mouth.upper.y + mouth.lower.y) / 2;
  const noseMouthMidpointY = (mouth.upper.y + mouth.lower.y) / 2;
  const cornersAboveMidpoint =
    mouth.left.y < noseMouthMidpointY && mouth.right.y < noseMouthMidpointY;

  return {
    mar,
    smileDetected: mar > 0.6 && cornersAboveMidpoint,
  };
}
