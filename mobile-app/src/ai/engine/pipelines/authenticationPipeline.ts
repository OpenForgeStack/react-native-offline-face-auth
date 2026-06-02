import { useEngineState } from '../state/engineState';
import { sdkNotInitialized } from '../../shared/errors/errorFactory';
import { memoryManager } from '../../optimization/memory/memoryManager';
import { sdkLog } from '../../shared/utils/logger';
import { detectFace } from '../../modules/detection/services/detectFace';
import { alignFace } from '../../modules/detection/alignment/faceAlignment';
import { extractLandmarks } from '../../modules/landmarks/extraction/extractLandmarks';
import { runLivenessPipeline } from './livenessPipeline';
import { runRecognitionPipeline } from './recognitionPipeline';
import type { AuthResult } from '../../shared/types/sdk.types';
import type { PipelineStage } from '../../shared/types/pipeline.types';

export interface PipelineResult {
  authResult: AuthResult;
  stageDurations: Record<PipelineStage, number>;
}

export async function runAuthenticationPipeline(
  framePixels: Float32Array,
  userId: string,
  storedEmbedding: Float32Array,
  config: {
    authThreshold: number;
    enableBenchmarking: boolean;
    livenessTimeout: number;
  },
  frameWidth: number = 1280,
  frameHeight: number = 720,
): Promise<PipelineResult> {
  const engineState = useEngineState.getState();
  if (!engineState.isReady) {
    throw sdkNotInitialized();
  }

  const stageDurations: Partial<Record<PipelineStage, number>> = {};
  const timings: number[] = [];

  function markStage(stage: PipelineStage): void {
    timings.push(performance.now());
    stageDurations[stage] = timings[timings.length - 1]! - (timings[timings.length - 2] ?? timings[0]!);
  }

  try {
    timings.push(performance.now());

    markStage('validation');

    markStage('detection');
    const detectionResult = detectFace(framePixels, frameWidth, frameHeight);

    markStage('alignment');
    const alignedFace = alignFace(
      framePixels,
      frameWidth,
      frameHeight,
      detectionResult.boundingBox,
    );

    markStage('landmarks');
    const landmarkResult = extractLandmarks(
      alignedFace.pixels,
      alignedFace.shape,
    );

    markStage('liveness');
    const livenessResult = await runLivenessPipeline(landmarkResult, config.livenessTimeout);
    if (livenessResult === null) {
      throw livenessResult;
    }

    markStage('recognition');
    const recognitionResult = await runRecognitionPipeline(
      alignedFace,
      userId,
      storedEmbedding,
    );

    markStage('comparison');
    const totalTime = performance.now() - timings[0]!;

    const authResult: AuthResult = {
      success: recognitionResult.passed,
      score: recognitionResult.score,
      confidence: recognitionResult.passed ? Math.min(1, recognitionResult.score) : 0,
      livenessScore: livenessResult.livenessScore,
      timestamp: Date.now(),
      durationMs: totalTime,
    };

    if (config.enableBenchmarking) {
      sdkLog('AUTH', 'Pipeline completed', {
        ...authResult,
        stageDurations,
      });
    }

    return {
      authResult,
      stageDurations: stageDurations as Record<PipelineStage, number>,
    };
  } finally {
    await memoryManager.release();
  }
}
