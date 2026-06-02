import { runtimeManager } from '../../engine/runtime/runtimeManager';
import { useEngineState } from '../../engine/state/engineState';
import { createZeroTensor } from '../../shared/utils/tensorUtils';
import type { ModelId } from '../../engine/state/engineState';

export async function primeModel(modelId: ModelId): Promise<void> {
  const handle = runtimeManager.getModel(modelId);
  const blankTensor = createZeroTensor(handle.inputShape);
  handle.instance.run(blankTensor);
}

export async function primeAllModels(): Promise<number> {
  const start = performance.now();
  const modelIds: ModelId[] = ['blazeface', 'facemesh', 'mobilefacenet'];
  for (const id of modelIds) {
    if (runtimeManager.isModelLoaded(id)) {
      await primeModel(id);
    }
  }
  const duration = performance.now() - start;
  useEngineState.getState().setWarmupTimeMs(duration);
  return duration;
}
