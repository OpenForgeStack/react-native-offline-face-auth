import type { ModelRegistryEntry } from './modelMetadata';
import { MODEL_VERSIONS } from './modelVersioning';

export const MODEL_REGISTRY: ModelRegistryEntry[] = [
  {
    id: 'blazeface',
    path: 'src/ai/models/detection/face_detection.tflite',
    maxSizeBytes: 2 * 1024 * 1024,
    inputShape: [1, 128, 128, 3],
    outputShape: [1, 896, 16],
    version: MODEL_VERSIONS['blazeface'],
    isEagerLoad: true,
  },
  {
    id: 'facemesh',
    path: 'src/ai/models/landmarks/facemesh.tflite',
    maxSizeBytes: 5 * 1024 * 1024,
    inputShape: [1, 192, 192, 3],
    outputShape: [1, 468, 3],
    version: MODEL_VERSIONS['facemesh'],
    isEagerLoad: false,
  },
  {
    id: 'mobilefacenet',
    path: 'src/ai/models/recognition/mobilefacenet.tflite',
    maxSizeBytes: 5 * 1024 * 1024,
    inputShape: [1, 112, 112, 3],
    outputShape: [1, 128],
    version: MODEL_VERSIONS['mobilefacenet'],
    isEagerLoad: false,
  },
];

export function getModelEntry(id: string): ModelRegistryEntry | undefined {
  return MODEL_REGISTRY.find((entry) => entry.id === id);
}

export function getAllModelEntries(): ModelRegistryEntry[] {
  return MODEL_REGISTRY;
}

export function getEagerLoadModels(): ModelRegistryEntry[] {
  return MODEL_REGISTRY.filter((entry) => entry.isEagerLoad);
}

export function getLazyLoadModels(): ModelRegistryEntry[] {
  return MODEL_REGISTRY.filter((entry) => !entry.isEagerLoad);
}
