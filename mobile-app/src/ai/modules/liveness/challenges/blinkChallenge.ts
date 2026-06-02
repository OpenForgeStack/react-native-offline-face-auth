import { computeEAR } from '../analysis/eyeAspectRatio';
import type { EARResult } from '../types/liveness.types';
import type { Landmark } from '../../landmarks/types/landmarks.types';
import { getEyeLandmarks } from '../../landmarks/facial/eyeLandmarks';

export interface BlinkChallengeResult {
  passed: boolean;
  earResult: EARResult;
  consecutiveBlinkFrames: number;
}

export function evaluateBlinkChallenge(
  landmarks: Landmark[],
  consecutiveThreshold: number = 2,
): BlinkChallengeResult {
  const eyes = getEyeLandmarks(landmarks);
  const earResult = computeEAR(eyes);

  return {
    passed: earResult.blinkDetected,
    earResult,
    consecutiveBlinkFrames: earResult.blinkDetected ? consecutiveThreshold : 0,
  };
}
