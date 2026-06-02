# TASK: Model Registry

**Directory:** `src/ai/models/registry/`
**Layer:** MODELS
**MVP Day:** Day 3–4
**Depends on:** detectionConfig, landmarksConfig, recognitionConfig

---

## Objective

Central registry of all TFLite models. `runtimeManager` uses this to know what to load, where to find it, and what shapes to expect. Single source of truth for model metadata.

---

## Files to Implement

```
models/registry/
├── modelRegistry.ts      ← Registry of all model entries
├── modelMetadata.ts      ← Metadata types and constants
└── modelVersioning.ts    ← Version strings for each model
```

---

## Types to Define

```typescript
interface ModelRegistryEntry {
  id: ModelId;
  path: string;
  maxSizeBytes: number;
  inputShape: readonly number[];
  outputShape: readonly number[];
  version: string;
  isEagerLoad: boolean;   // false = lazy
}
```

---

## Registry Entries

```typescript
export const MODEL_REGISTRY: ModelRegistryEntry[] = [
  {
    id: 'blazeface',
    path: 'src/ai/models/detection/face_detection.tflite',
    maxSizeBytes: 2 * 1024 * 1024,
    inputShape: [1, 128, 128, 3],
    outputShape: [1, 896, 16],
    version: '1.0.0',
    isEagerLoad: true,
  },
  {
    id: 'facemesh',
    path: 'src/ai/models/landmarks/facemesh.tflite',
    maxSizeBytes: 5 * 1024 * 1024,
    inputShape: [1, 192, 192, 3],
    outputShape: [1, 468, 3],
    version: '1.0.0',
    isEagerLoad: false,
  },
  {
    id: 'mobilefacenet',
    path: 'src/ai/models/recognition/mobilefacenet.tflite',
    maxSizeBytes: 5 * 1024 * 1024,
    inputShape: [1, 112, 112, 3],
    outputShape: [1, 128],
    version: '1.0.0',
    isEagerLoad: false,
  },
];
```

---

## Tests Required

`src/ai/tests/unit/models/modelRegistry.test.ts`

- Registry contains exactly 3 entries for MVP
- Total `maxSizeBytes` sum < 20 MB
- Only `blazeface` has `isEagerLoad: true`
- All entries have valid non-empty `path` strings
