import { cosineSimilarity } from '../similarity/cosineSimilarity';
import { SIMILARITY_THRESHOLD } from '../similarity/similarityThreshold';
import type { ComparisonResult } from '../types/recognition.types';

export function compareEmbeddings(a: Float32Array, b: Float32Array): ComparisonResult {
  const score = cosineSimilarity(a, b);
  return {
    score,
    passed: score >= SIMILARITY_THRESHOLD.cosine,
    metric: 'cosine',
  };
}
