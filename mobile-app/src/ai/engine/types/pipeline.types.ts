export interface RecognitionPipelineResult {
  score: number;
  passed: boolean;
  cacheHit: boolean;
  embeddingDimension: number;
}

export interface LivenessPipelineResult {
  passed: boolean;
  livenessScore: number;
  currentChallenge: string;
  completedChallenges: string[];
}
