import type { ValidationFailure } from '../types/validation.types';

export function computeQualityScore(failures: ValidationFailure[]): number {
  if (failures.length === 0) return 1.0;
  const penaltyPerFailure = 1.0 / (failures.length + 1);
  return Math.max(0, 1.0 - penaltyPerFailure * failures.length);
}
