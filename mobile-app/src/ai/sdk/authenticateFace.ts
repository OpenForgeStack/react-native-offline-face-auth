import { useEngineState } from '../engine/state/engineState';
import { useAuthState } from '../engine/state/authState';
import { sdkNotInitialized } from '../shared/errors/errorFactory';
import { runAuthenticationPipeline } from '../engine/pipelines/authenticationPipeline';
import { sdkLog } from '../shared/utils/logger';
import type { AuthResult } from '../shared/types/sdk.types';
import type { SDKConfig } from '../shared/types/sdk.types';

export async function authenticateFace(
  framePixels: Float32Array,
  userId: string,
  storedEmbedding: Float32Array,
  config: SDKConfig,
): Promise<AuthResult> {
  const engineState = useEngineState.getState();

  if (!engineState.isReady) {
    throw sdkNotInitialized();
  }

  sdkLog('SDK', `Authenticating face for userId: ${userId}`);

  const pipelineResult = await runAuthenticationPipeline(
    framePixels,
    userId,
    storedEmbedding,
    {
      authThreshold: config.authThreshold,
      enableBenchmarking: config.enableBenchmarking,
      livenessTimeout: config.livenessTimeout,
    },
  );

  const authState = useAuthState.getState();
  authState.setResult(pipelineResult.authResult);

  return pipelineResult.authResult;
}
