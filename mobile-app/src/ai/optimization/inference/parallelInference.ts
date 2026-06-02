import { runtimeManager } from '../../engine/runtime/runtimeManager';
import type { ModelId } from '../../engine/state/engineState';

export async function runParallel<T>(
  tasks: Array<{ modelId: ModelId; fn: () => T }>,
): Promise<T[]> {
  const validTasks = tasks.filter((t) => runtimeManager.isModelLoaded(t.modelId));
  return Promise.all(validTasks.map((t) => Promise.resolve(t.fn())));
}
