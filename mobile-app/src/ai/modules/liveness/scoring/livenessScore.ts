import type { LivenessChallengeResult } from '../types/liveness.types';

export function computeOverallLivenessScore(
  results: LivenessChallengeResult[],
): number {
  if (results.length === 0) return 0;

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  return totalScore / results.length;
}
