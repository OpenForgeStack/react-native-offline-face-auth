import { DETECTION_CONFIG } from './detectionConfig';
import { getModelEntry } from '../registry/modelRegistry';
import { modelLoadFailed } from '../../shared/errors/errorFactory';
import type { ModelRegistryEntry } from '../registry/modelMetadata';

export async function loadDetectionModel(): Promise<ModelRegistryEntry> {
  const entry = getModelEntry('blazeface');
  if (!entry) {
    throw modelLoadFailed('blazeface', 'Model not found in registry');
  }

  const maxBytes = DETECTION_CONFIG.maxSizeBytes;
  entry.maxSizeBytes = maxBytes;

  return entry;
}
