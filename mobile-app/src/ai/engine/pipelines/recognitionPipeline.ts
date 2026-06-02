import { useCacheState } from '../state/cacheState';
import { generateEmbedding } from '../../modules/recognition/services/generateEmbedding';
import { compareEmbeddings } from '../../modules/recognition/services/compareEmbeddings';
import { RECOGNITION_CONFIG } from '../../models/recognition/recognitionConfig';
import { l2Normalize } from '../../shared/utils/mathUtils';
import { sdkLog } from '../../shared/utils/logger';
import type { AlignedFace } from '../../modules/detection/types/detection.types';
import type { RecognitionPipelineResult } from '../types/pipeline.types';

export async function runRecognitionPipeline(
  alignedFace: AlignedFace,
  userId: string,
  storedEmbedding: Float32Array,
): Promise<RecognitionPipelineResult> {
  const cacheState = useCacheState.getState();
  const cached = cacheState.get(userId);

  let liveEmbedding: Float32Array;

  if (cached) {
    liveEmbedding = cached.embedding;
    sdkLog('RECOGNITION', `Cache hit for userId: ${userId}`);
  } else {
    const result = generateEmbedding(alignedFace.pixels);
    liveEmbedding = l2Normalize(result.embedding);
    cacheState.set(userId, {
      userId,
      embedding: liveEmbedding,
      cachedAt: Date.now(),
      hitCount: 1,
    });
  }

  const normalizedStored = l2Normalize(storedEmbedding);
  const comparison = compareEmbeddings(liveEmbedding, normalizedStored);

  return {
    score: comparison.score,
    passed: comparison.passed,
    cacheHit: !!cached,
    embeddingDimension: RECOGNITION_CONFIG.embeddingDimension,
  };
}
