import { computeOverallLivenessScore } from '../../../../modules/liveness/scoring/livenessScore';

describe('livenessScore', () => {
  it('all 4 challenges passed should give score 1.0', () => {
    const results = [
      { passed: true, challenge: 'blink' as const, score: 1.0, durationMs: 100 },
      { passed: true, challenge: 'smile' as const, score: 1.0, durationMs: 100 },
      { passed: true, challenge: 'turn_left' as const, score: 1.0, durationMs: 100 },
      { passed: true, challenge: 'turn_right' as const, score: 1.0, durationMs: 100 },
    ];
    expect(computeOverallLivenessScore(results)).toBeCloseTo(1.0, 5);
  });
});
