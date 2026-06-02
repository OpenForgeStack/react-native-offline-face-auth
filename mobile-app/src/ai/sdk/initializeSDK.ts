import { useEngineState } from '../engine/state/engineState';
import { runtimeManager } from '../engine/runtime/runtimeManager';
import { loadEagerModels } from '../optimization/inference/lazyLoading';
import { primeAllModels } from '../optimization/inference/modelWarmup';
import { tensorPool } from '../optimization/memory/tensorPooling';
import { validateConfig, DEFAULT_SDK_CONFIG } from './sdkConfig';
import { sdkLog } from '../shared/utils/logger';
import type { SDKConfig, SDKInitResult } from '../shared/types/sdk.types';
import type { ModelId } from '../engine/state/engineState';

export async function initializeSDK(config?: Partial<SDKConfig>): Promise<SDKInitResult> {
  const engineState = useEngineState.getState();

  if (engineState.isReady) {
    sdkLog('SDK', 'initializeSDK called twice — idempotent, returning early');
    return {
      success: true,
      modelsLoaded: Object.entries(engineState.modelsLoaded)
        .filter(([, loaded]) => loaded)
        .map(([id]) => id),
      warmupTimeMs: engineState.warmupTimeMs,
    };
  }

  const mergedConfig: SDKConfig = { ...DEFAULT_SDK_CONFIG, ...config };
  validateConfig(mergedConfig);

  sdkLog('SDK', 'Initializing SDK...');

  const start = performance.now();

  tensorPool.registerShape([1, 128, 128, 3], 3);
  tensorPool.registerShape([1, 192, 192, 3], 3);
  tensorPool.registerShape([1, 112, 112, 3], 3);

  await loadEagerModels();

  const warmupTimeMs = await primeAllModels();

  const modelsLoaded = Object.entries(engineState.modelsLoaded)
    .filter(([, loaded]) => loaded)
    .map(([id]) => id);

  engineState.setReady(true);

  const totalTime = performance.now() - start;
  sdkLog('SDK', `Initialization complete in ${Math.round(totalTime)}ms`);

  return {
    success: true,
    modelsLoaded,
    warmupTimeMs,
  };
}
