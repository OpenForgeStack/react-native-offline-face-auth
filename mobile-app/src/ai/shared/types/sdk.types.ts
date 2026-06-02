import type { NormalizedFloat, UnixTimestamp, Milliseconds } from './common.types';

export interface SDKConfig {
  modelBasePath: string;
  embeddingDimension: 128 | 192;
  livenessTimeout: number;
  authThreshold: number;
  enableBenchmarking: boolean;
}

export interface SDKInitResult {
  success: boolean;
  modelsLoaded: string[];
  warmupTimeMs: number;
}

export type ChallengeType = 'blink' | 'smile' | 'turn_left' | 'turn_right';

export interface AuthResult {
  success: boolean;
  score: number;
  confidence: number;
  livenessScore: number;
  timestamp: UnixTimestamp;
  durationMs: Milliseconds;
}

export interface EnrollResult {
  userId: string;
  enrolledAt: UnixTimestamp;
  embeddingDimension: number;
  qualityScore: NormalizedFloat;
}

export interface LivenessResult {
  passed: boolean;
  currentChallenge: ChallengeType;
  completedChallenges: ChallengeType[];
  livenessScore: NormalizedFloat;
  remainingMs: Milliseconds;
}
