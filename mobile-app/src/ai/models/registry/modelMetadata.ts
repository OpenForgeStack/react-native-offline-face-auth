import type { ModelId } from '../../engine/state/engineState';

export interface ModelRegistryEntry {
  id: ModelId;
  path: string;
  maxSizeBytes: number;
  inputShape: readonly number[];
  outputShape: readonly number[];
  version: string;
  isEagerLoad: boolean;
}
