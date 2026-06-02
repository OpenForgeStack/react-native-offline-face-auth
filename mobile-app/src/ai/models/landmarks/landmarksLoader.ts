import { LANDMARKS_CONFIG, LANDMARK_INDICES } from './landmarksConfig';
import { getModelEntry } from '../registry/modelRegistry';
import { modelLoadFailed } from '../../shared/errors/errorFactory';
import type { ModelRegistryEntry } from '../registry/modelMetadata';

export { LANDMARK_INDICES };

export async function loadLandmarksModel(): Promise<ModelRegistryEntry> {
  const entry = getModelEntry('facemesh');
  if (!entry) {
    throw modelLoadFailed('facemesh', 'Model not found in registry');
  }

  const maxBytes = LANDMARKS_CONFIG.maxSizeBytes;
  entry.maxSizeBytes = maxBytes;

  return entry;
}
