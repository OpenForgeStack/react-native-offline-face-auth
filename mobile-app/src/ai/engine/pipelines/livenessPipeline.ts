import { useSessionState } from '../state/sessionState';
import { challengeSequencer } from '../../modules/liveness/challenges/challengeSequencer';
import { validateLivenessChallenge } from '../../modules/liveness/validators/livenessValidator';
import { computeOverallLivenessScore } from '../../modules/liveness/scoring/livenessScore';
import { livenessFailed, livenessTimeout } from '../../shared/errors/errorFactory';
import { sdkLog } from '../../shared/utils/logger';
import type { LandmarkResult } from '../../modules/landmarks/types/landmarks.types';
import type { ChallengeType } from '../../shared/types/sdk.types';
import type { LivenessChallengeResult } from '../../modules/liveness/types/liveness.types';

export interface LivenessPipelineResult {
  passed: boolean;
  livenessScore: number;
  currentChallenge: ChallengeType;
  completedChallenges: ChallengeType[];
}

export async function runLivenessPipeline(
  landmarkResult: LandmarkResult,
  livenessTimeoutMs: number = 10000,
): Promise<LivenessPipelineResult> {
  const sessionState = useSessionState.getState();

  if (!sessionState.currentChallenge) {
    challengeSequencer.startNewSession();
  }

  const challenge = useSessionState.getState().currentChallenge;
  if (!challenge) {
    throw livenessFailed('No active challenge');
  }

  if (sessionState.sessionStartedAt) {
    const elapsed = Date.now() - sessionState.sessionStartedAt;
    if (elapsed > livenessTimeoutMs) {
      challengeSequencer.endSession();
      throw livenessTimeout();
    }
  }

  const challengeResult: LivenessChallengeResult = validateLivenessChallenge(
    landmarkResult.landmarks,
    landmarkResult.headPose,
    challenge,
  );

  sdkLog('LIVENESS', `Challenge ${challenge}: ${challengeResult.passed ? 'PASS' : 'FAIL'} (score: ${challengeResult.score})`);

  if (challengeResult.passed) {
    challengeSequencer.completeCurrent(challenge);
    const next = challengeSequencer.advanceToNext();
    if (!next) {
      challengeSequencer.endSession();
    }
  }

  const completed = sessionState.completedChallenges;
  const allResults = completed.map((c) => ({
    passed: true,
    challenge: c,
    score: 1.0,
    durationMs: 0,
  }));

  if (challengeResult.passed) {
    allResults.push(challengeResult);
  }

  const livenessScore = computeOverallLivenessScore(allResults);

  const isComplete = challengeSequencer.isSessionComplete();

  return {
    passed: isComplete,
    livenessScore,
    currentChallenge: challenge,
    completedChallenges: completed,
  };
}
