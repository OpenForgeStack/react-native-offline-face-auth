import type { HeadPose } from '../../landmarks/types/landmarks.types';
import type { ChallengeType } from '../../../shared/types/sdk.types';

export interface PoseAnalysisResult {
  passed: boolean;
  score: number;
  measuredAngle: number;
}

export function analyzePose(
  headPose: HeadPose,
  challenge: ChallengeType,
  threshold: number = 25,
): PoseAnalysisResult {
  let angle: number;
  let expectedSign: number;

  switch (challenge) {
    case 'turn_left':
      angle = headPose.yaw;
      expectedSign = -1;
      break;
    case 'turn_right':
      angle = headPose.yaw;
      expectedSign = 1;
      break;
    default:
      return { passed: false, score: 0, measuredAngle: 0 };
  }

  const magnitude = Math.abs(angle);
  const correctDirection = Math.sign(angle) === expectedSign || magnitude > threshold * 1.5;
  const passed = magnitude > threshold && correctDirection;
  const score = Math.min(1, magnitude / (threshold * 2));

  return { passed, score, measuredAngle: angle };
}
