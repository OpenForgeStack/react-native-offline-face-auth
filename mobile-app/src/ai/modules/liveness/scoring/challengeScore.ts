export function computeChallengeScore(
  passed: boolean,
  durationMs: number,
  maxDurationMs: number = 3000,
): number {
  if (passed) {
    const timeBonus = Math.max(0, 1 - durationMs / maxDurationMs);
    return 0.7 + 0.3 * timeBonus;
  }
  return Math.max(0, 1 - durationMs / maxDurationMs) * 0.3;
}
