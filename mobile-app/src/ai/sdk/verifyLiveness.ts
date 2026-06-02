import { useEngineState } from '../engine/state/engineState';
import { sdkNotInitialized } from '../shared/errors/errorFactory';
import { extractLandmarks } from '../modules/landmarks/extraction/extractLandmarks';
import { runLivenessPipeline } from '../engine/pipelines/livenessPipeline';
import { sdkLog } from '../shared/utils/logger';
import type { LivenessResult } from '../shared/types/sdk.types';
import type { ChallengeType } from '../shared/types/sdk.types';

export async function verifyLiveness(alignedFacePixels: Float32Array, livenessTimeoutMs: number = 10000): Promise<LivenessResult> {
  const engineState = useEngineState.getState();

  if (!engineState.isReady) {
    throw sdkNotInitialized();
  }

  sdkLog('SDK', 'Verifying liveness...');

  const start = performance.now();
  const alignedFaceShape: [number, number, number, number] = [1, 112, 112, 3];

  const landmarkResult = extractLandmarks(alignedFacePixels, alignedFaceShape);

  const livenessResult = await runLivenessPipeline(landmarkResult, livenessTimeoutMs);

  const remainingMs = Math.max(0, livenessTimeoutMs - (performance.now() - start));

  return {
    passed: livenessResult.passed,
    currentChallenge: livenessResult.currentChallenge as ChallengeType,
    completedChallenges: livenessResult.completedChallenges as ChallengeType[],
    livenessScore: livenessResult.livenessScore,
    remainingMs,
  };
}
