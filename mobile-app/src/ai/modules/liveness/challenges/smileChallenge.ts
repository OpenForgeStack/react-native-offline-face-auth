import { computeMAR } from '../analysis/mouthRatio';
import type { MARResult } from '../types/liveness.types';
import type { Landmark } from '../../landmarks/types/landmarks.types';
import { getMouthLandmarks } from '../../landmarks/facial/mouthLandmarks';

export interface SmileChallengeResult {
  passed: boolean;
  marResult: MARResult;
}

export function evaluateSmileChallenge(landmarks: Landmark[]): SmileChallengeResult {
  const mouth = getMouthLandmarks(landmarks);
  const marResult = computeMAR(mouth);

  return {
    passed: marResult.smileDetected,
    marResult,
  };
}
