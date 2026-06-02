import { runtimeManager } from './runtimeManager';
import { inferenceFailed } from '../../shared/errors/errorFactory';
import type { ModelId } from '../state/engineState';

export function runInference(modelId: ModelId, input: Float32Array): Float32Array {
  const handle = runtimeManager.getModel(modelId);
  try {
    return handle.instance.run(input);
  } catch (err) {
    throw inferenceFailed(
      err instanceof Error ? err.message : 'Unknown inference error',
    );
  }
}
