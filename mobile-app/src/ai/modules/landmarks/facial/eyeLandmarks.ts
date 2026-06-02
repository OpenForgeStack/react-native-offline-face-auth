import { LANDMARK_INDICES } from '../../../models/landmarks/landmarksConfig';
import type { Landmark } from '../types/landmarks.types';

export function getEyeLandmarks(landmarks: Landmark[]): { left: Landmark[]; right: Landmark[] } {
  const idx = LANDMARK_INDICES;
  return {
    left: [
      landmarks[idx.leftEyeLeft]!,
      landmarks[idx.leftEyeTopOuter]!,
      landmarks[idx.leftEyeTopInner]!,
      landmarks[idx.leftEyeRight]!,
      landmarks[idx.leftEyeBottomInner]!,
      landmarks[idx.leftEyeBottomOuter]!,
    ],
    right: [
      landmarks[idx.rightEyeLeft]!,
      landmarks[idx.rightEyeTopOuter]!,
      landmarks[idx.rightEyeTopInner]!,
      landmarks[idx.rightEyeRight]!,
      landmarks[idx.rightEyeBottomInner]!,
      landmarks[idx.rightEyeBottomOuter]!,
    ],
  };
}
