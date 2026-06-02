import { LANDMARK_INDICES } from '../../../models/landmarks/landmarksConfig';
import type { Landmark } from '../types/landmarks.types';

export function getMouthLandmarks(landmarks: Landmark[]): {
  upper: Landmark;
  lower: Landmark;
  left: Landmark;
  right: Landmark;
} {
  const idx = LANDMARK_INDICES;
  return {
    upper: landmarks[idx.mouthTop]!,
    lower: landmarks[idx.mouthBottom]!,
    left: landmarks[idx.mouthLeft]!,
    right: landmarks[idx.mouthRight]!,
  };
}
