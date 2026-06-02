import { LANDMARK_INDICES } from '../../../models/landmarks/landmarksConfig';
import type { Landmark, HeadPose } from '../types/landmarks.types';
import { radiansToDegrees } from '../../../shared/utils/mathUtils';

export function estimateHeadPose(landmarks: Landmark[]): HeadPose {
  const idx = LANDMARK_INDICES;
  const nose = landmarks[idx.noseTip]!;
  const chin = landmarks[idx.chin]!;
  const leftEye = landmarks[idx.leftEyeRight]!;
  const rightEye = landmarks[idx.rightEyeLeft]!;

  const eyeCenterX = (leftEye.x + rightEye.x) / 2;
  const eyeCenterY = (leftEye.y + rightEye.y) / 2;

  const roll = radiansToDegrees(Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x));

  const faceDx = nose.x - eyeCenterX;
  const faceDy = nose.y - eyeCenterY;
  const yaw = radiansToDegrees(Math.atan2(faceDx, Math.abs(faceDy)));

  const chinDx = chin.x - eyeCenterX;
  const chinDy = chin.y - eyeCenterY;
  const pitch = radiansToDegrees(Math.atan2(chinDy, Math.abs(chinDx)));

  return {
    yaw: clampAngle(yaw),
    pitch: clampAngle(pitch),
    roll: clampAngle(roll),
  };
}

function clampAngle(angle: number): number {
  return Math.max(-90, Math.min(90, angle));
}
