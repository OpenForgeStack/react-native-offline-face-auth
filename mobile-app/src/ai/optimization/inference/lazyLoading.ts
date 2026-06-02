import { runtimeManager } from '../../engine/runtime/runtimeManager';
import { getLazyLoadModels, getEagerLoadModels } from '../../models/registry/modelRegistry';
import { useEngineState } from '../../engine/state/engineState';
import type { ModelId } from '../../engine/state/engineState';

export async function loadEagerModels(): Promise<void> {
  const eager = getEagerLoadModels();
  for (const entry of eager) {
    if (!runtimeManager.isModelLoaded(entry.id)) {
      await runtimeManager.loadModel(entry);
    }
  }
}

export async function ensureModelLoaded(modelId: ModelId): Promise<void> {
  if (!runtimeManager.isModelLoaded(modelId)) {
    const entry = getLazyLoadModels().find((e) => e.id === modelId);
    if (entry) {
      await runtimeManager.loadModel(entry);
    }
  }
}
