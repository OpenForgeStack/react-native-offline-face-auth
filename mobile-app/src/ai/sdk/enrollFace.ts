import { useEngineState } from '../engine/state/engineState';
import { sdkNotInitialized, duplicateEnrollment } from '../shared/errors/errorFactory';
import { detectFace } from '../modules/detection/services/detectFace';
import { alignFace } from '../modules/detection/alignment/faceAlignment';
import { generateEmbedding } from '../modules/recognition/services/generateEmbedding';
import { useCacheState } from '../engine/state/cacheState';
import { sdkLog } from '../shared/utils/logger';
import type { EnrollResult } from '../shared/types/sdk.types';

export async function enrollFace(framePixels: Float32Array, userId: string): Promise<EnrollResult> {
  const engineState = useEngineState.getState();

  if (!engineState.isReady) {
    throw sdkNotInitialized();
  }

  const cacheState = useCacheState.getState();
  if (cacheState.get(userId)) {
    throw duplicateEnrollment(userId);
  }

  sdkLog('SDK', `Enrolling face for userId: ${userId}`);

  const start = performance.now();
  const frameWidth = 1280;
  const frameHeight = 720;

  const detectionResult = detectFace(framePixels, frameWidth, frameHeight);

  const alignedFace = alignFace(
    framePixels,
    frameWidth,
    frameHeight,
    detectionResult.boundingBox,
  );

  const embeddingResult = generateEmbedding(alignedFace.pixels);

  cacheState.set(userId, {
    userId,
    embedding: embeddingResult.embedding,
    cachedAt: Date.now(),
    hitCount: 0,
  });

  const duration = performance.now() - start;

  sdkLog('SDK', `Enrollment complete for userId: ${userId} in ${Math.round(duration)}ms`);

  return {
    userId,
    enrolledAt: Date.now(),
    embeddingDimension: embeddingResult.embedding.length,
    qualityScore: detectionResult.boundingBox.confidence,
  };
}
