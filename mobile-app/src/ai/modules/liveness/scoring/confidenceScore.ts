import type { LivenessChallengeResult } from '../types/liveness.types';

export function computeConfidenceScore(
  results: LivenessChallengeResult[],
): number {
  if (results.length === 0) return 0;

  const passed = results.filter((r) => r.passed).length;
  const passRatio = passed / results.length;
  const avgScore = results.reduce((s, r) => s + r.score, 0) / results.length;

  return passRatio * 0.6 + avgScore * 0.4;
}
