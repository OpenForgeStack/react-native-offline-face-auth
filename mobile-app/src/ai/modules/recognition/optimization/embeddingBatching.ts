import { generateEmbedding } from '../services/generateEmbedding';
import type { EmbeddingResult } from '../types/recognition.types';

export function batchGenerateEmbeddings(
  faces: Float32Array[],
): EmbeddingResult[] {
  return faces.map((face) => generateEmbedding(face));
}
