import { cosineSimilarity } from '../similarity/cosineSimilarity';
import { SIMILARITY_THRESHOLD } from '../similarity/similarityThreshold';

export interface RecognizedUser {
  userId: string;
  score: number;
  passed: boolean;
}

export function recognizeFace(
  liveEmbedding: Float32Array,
  enrolledEmbeddings: Map<string, Float32Array>,
): RecognizedUser | null {
  let bestMatch: RecognizedUser | null = null;

  for (const [userId, storedEmbedding] of enrolledEmbeddings) {
    const score = cosineSimilarity(liveEmbedding, storedEmbedding);
    if (score >= SIMILARITY_THRESHOLD.cosine) {
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { userId, score, passed: true };
      }
    }
  }

  return bestMatch;
}
