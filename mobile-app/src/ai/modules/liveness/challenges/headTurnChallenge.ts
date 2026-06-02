import type { Landmark } from '../../landmarks/types/landmarks.types';
import type { HeadPose } from '../../landmarks/types/landmarks.types';
import type { ChallengeType } from '../../../shared/types/sdk.types';
import { estimateHeadPose } from '../../landmarks/pose/poseAngles';
import { analyzePose } from '../analysis/poseAnalysis';

export interface HeadTurnChallengeResult {
  passed: boolean;
  headPose: HeadPose;
  score: number;
}

export function evaluateHeadTurnChallenge(
  landmarks: Landmark[],
  challenge: ChallengeType,
): HeadTurnChallengeResult {
  const headPose = estimateHeadPose(landmarks);
  const result = analyzePose(headPose, challenge);

  return {
    passed: result.passed,
    headPose,
    score: result.score,
  };
}
