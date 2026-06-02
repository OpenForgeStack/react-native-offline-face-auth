# TASK: detectionLoader

**File:** `src/ai/models/detection/detectionLoader.ts`
**Layer:** MODELS
**MVP Day:** Day 4
**Depends on:** runtimeManager, detectionConfig

---

## Objective

Load the BlazeFace quantized TFLite model. Provides the model handle to the detection module. Strictly isolated to the detection model's loading concern.

---

## Acceptance Criteria

- [ ] Loads `src/ai/models/detection/face_detection.tflite`
- [ ] Model size must not exceed 2 MB — throw if asset is larger
- [ ] Input tensor shape: `[1, 128, 128, 3]`
- [ ] Output: bounding box coordinates + confidence scores
- [ ] Registers model with `runtimeManager` after load
- [ ] Warm-up: one blank 128×128×3 inference after load

---

## Config (`detectionConfig.ts`)

```typescript
export const DETECTION_CONFIG = {
  modelPath: 'src/ai/models/detection/face_detection.tflite',
  maxSizeBytes: 2 * 1024 * 1024,  // 2 MB
  inputShape: [1, 128, 128, 3] as const,
  confidenceThreshold: 0.7,
  iouThreshold: 0.3,
};
```

---

## Tests Required

`src/ai/tests/unit/models/detectionLoader.test.ts`

- Should reject if model file exceeds 2 MB
- Should register handle with runtimeManager after load
- Input shape should match `[1, 128, 128, 3]`
