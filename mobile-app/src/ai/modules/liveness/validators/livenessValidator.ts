import type { ChallengeType } from '../../../shared/types/sdk.types';
import type { Landmark } from '../../landmarks/types/landmarks.types';
import type { HeadPose } from '../../landmarks/types/landmarks.types';
import { evaluateBlinkChallenge } from '../challenges/blinkChallenge';
import { evaluateSmileChallenge } from '../challenges/smileChallenge';
import { evaluateHeadTurnChallenge } from '../challenges/headTurnChallenge';
import type { LivenessChallengeResult } from '../types/liveness.types';

export function validateLivenessChallenge(
  landmarks: Landmark[],
  headPose: HeadPose,
  challenge: ChallengeType,
): LivenessChallengeResult {
  const start = performance.now();

  switch (challenge) {
    case 'blink': {
      const result = evaluateBlinkChallenge(landmarks);
      return {
        passed: result.passed,
        challenge,
        score: result.passed ? 1.0 : result.earResult.averageEAR,
        durationMs: performance.now() - start,
      };
    }
    case 'smile': {
      const result = evaluateSmileChallenge(landmarks);
      return {
        passed: result.passed,
        challenge,
        score: result.passed ? 1.0 : result.marResult.mar,
        durationMs: performance.now() - start,
      };
    }
    case 'turn_left':
    case 'turn_right': {
      const result = evaluateHeadTurnChallenge(landmarks, challenge);
      return {
        passed: result.passed,
        challenge,
        score: result.score,
        durationMs: performance.now() - start,
      };
    }
  }
}
