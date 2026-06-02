# TASK: recognitionLoader

**File:** `src/ai/models/recognition/recognitionLoader.ts`
**Layer:** MODELS
**MVP Day:** Day 5
**Depends on:** runtimeManager, recognitionConfig

---

## Objective

Load the MobileFaceNet INT8 quantized TFLite model. Produces face embeddings used for identity comparison.

---

## Acceptance Criteria

- [ ] Loads `src/ai/models/recognition/mobilefacenet.tflite`
- [ ] Model size must not exceed 5 MB
- [ ] Input tensor shape: `[1, 112, 112, 3]`
- [ ] Output embedding: `[1, 128]` or `[1, 192]` depending on `sdkConfig.embeddingDimension`
- [ ] Registers with `runtimeManager`
- [ ] Warm-up: one blank 112×112×3 inference after load

---

## Config (`recognitionConfig.ts`)

```typescript
export const RECOGNITION_CONFIG = {
  modelPath: 'src/ai/models/recognition/mobilefacenet.tflite',
  maxSizeBytes: 5 * 1024 * 1024,
  inputShape: [1, 112, 112, 3] as const,
  embeddingDimension: 128 as 128 | 192,
  similarityThreshold: 0.6,
};
```

---

## Tests Required

`src/ai/tests/unit/models/recognitionLoader.test.ts`

- Should reject if model exceeds 5 MB
- Output embedding length should match configured `embeddingDimension`
- Should register with runtimeManager on load
