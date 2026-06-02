import { runtimeManager } from '../../../engine/runtime/runtimeManager';
import { RECOGNITION_CONFIG } from '../../../models/recognition/recognitionConfig';
import { normalizeFrame } from '../../detection/preprocessing/normalizeFrame';
import type { EmbeddingResult } from '../types/recognition.types';

export function generateEmbedding(alignedFacePixels: Float32Array): EmbeddingResult {
  const start = performance.now();
  const model = runtimeManager.getModel('mobilefacenet');
  const normalized = normalizeFrame(alignedFacePixels, [-1, 1]);
  const output = model.instance.run(normalized);

  const dim = RECOGNITION_CONFIG.embeddingDimension;
  const embedding = new Float32Array(dim);
  for (let i = 0; i < dim; i++) {
    embedding[i] = output[i]!;
  }

  return {
    embedding,
    generationTimeMs: performance.now() - start,
  };
}
