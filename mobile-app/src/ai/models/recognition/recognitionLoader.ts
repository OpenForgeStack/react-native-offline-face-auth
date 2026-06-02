import { RECOGNITION_CONFIG } from './recognitionConfig';
import { getModelEntry } from '../registry/modelRegistry';
import { modelLoadFailed } from '../../shared/errors/errorFactory';
import type { ModelRegistryEntry } from '../registry/modelMetadata';

export async function loadRecognitionModel(): Promise<ModelRegistryEntry> {
  const entry = getModelEntry('mobilefacenet');
  if (!entry) {
    throw modelLoadFailed('mobilefacenet', 'Model not found in registry');
  }

  const maxBytes = RECOGNITION_CONFIG.maxSizeBytes;
  entry.maxSizeBytes = maxBytes;

  return entry;
}
