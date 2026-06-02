import { ANTISPOOF_CONFIG } from './antiSpoofConfig';
import { getModelEntry } from '../registry/modelRegistry';
import { modelLoadFailed } from '../../shared/errors/errorFactory';
import type { ModelRegistryEntry } from '../registry/modelMetadata';

export async function loadAntiSpoofModel(): Promise<ModelRegistryEntry | null> {
  const entry = getModelEntry('antispoof');
  if (!entry) return null;

  const maxBytes = ANTISPOOF_CONFIG.maxSizeBytes;
  entry.maxSizeBytes = maxBytes;

  return entry;
}
