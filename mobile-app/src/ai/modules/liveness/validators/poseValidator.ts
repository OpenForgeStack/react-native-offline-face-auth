import type { ChallengeType } from '../../../shared/types/sdk.types';
import type { HeadPose } from '../../landmarks/types/landmarks.types';

export function validatePose(
  headPose: HeadPose,
  challenge: ChallengeType,
  threshold: number = 25,
): boolean {
  switch (challenge) {
    case 'turn_left':
      return headPose.yaw < -threshold;
    case 'turn_right':
      return headPose.yaw > threshold;
    default:
      return false;
  }
}
