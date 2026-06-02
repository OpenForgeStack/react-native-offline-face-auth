import type { ChallengeType } from '../../../shared/types/sdk.types';

export interface EARResult {
  leftEAR: number;
  rightEAR: number;
  averageEAR: number;
  blinkDetected: boolean;
}

export interface MARResult {
  mar: number;
  smileDetected: boolean;
}

export interface ChallengeSessionState {
  sequence: ChallengeType[];
  currentIndex: number;
  completedAt: number[];
  startedAt: number;
}

export interface LivenessChallengeResult {
  passed: boolean;
  challenge: ChallengeType;
  score: number;
  durationMs: number;
}
