import { compareEmbeddings } from './compareEmbeddings';
import type { ComparisonResult } from '../types/recognition.types';

export function verifyIdentity(
  liveEmbedding: Float32Array,
  storedEmbedding: Float32Array,
): ComparisonResult {
  return compareEmbeddings(liveEmbedding, storedEmbedding);
}
