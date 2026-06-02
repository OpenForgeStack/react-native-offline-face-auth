export interface EmbeddingResult {
  embedding: Float32Array;
  generationTimeMs: number;
}

export interface ComparisonResult {
  score: number;
  passed: boolean;
  metric: 'cosine';
}

export interface CacheEntry {
  userId: string;
  embedding: Float32Array;
  cachedAt: number;
  hitCount: number;
}
