# TASK: landmarksLoader

**File:** `src/ai/models/landmarks/landmarksLoader.ts`
**Layer:** MODELS
**MVP Day:** Day 4–5
**Depends on:** runtimeManager, landmarksConfig

---

## Objective

Load the MediaPipe Face Mesh quantized TFLite model. This model drives both the landmarks module and (indirectly) the entire liveness system.

---

## Acceptance Criteria

- [ ] Loads `src/ai/models/landmarks/facemesh.tflite`
- [ ] Model size must not exceed 5 MB
- [ ] Input tensor shape: `[1, 192, 192, 3]`
- [ ] Output: 468 facial landmark coordinates `[1, 468, 3]`
- [ ] Registers with `runtimeManager` after load
- [ ] Warm-up: one blank inference after load

---

## Config (`landmarksConfig.ts`)

```typescript
export const LANDMARKS_CONFIG = {
  modelPath: 'src/ai/models/landmarks/facemesh.tflite',
  maxSizeBytes: 5 * 1024 * 1024,
  inputShape: [1, 192, 192, 3] as const,
  outputLandmarkCount: 468,
  outputShape: [1, 468, 3] as const,
};
```

---

## Key Landmark Indices

Document these in `landmarksConfig.ts` for use across the liveness module:

```typescript
export const LANDMARK_INDICES = {
  // Left eye
  leftEyeTop: 159, leftEyeBottom: 145,
  leftEyeLeft: 33, leftEyeRight: 133,
  // Right eye
  rightEyeTop: 386, rightEyeBottom: 374,
  rightEyeLeft: 362, rightEyeRight: 263,
  // Mouth
  mouthTop: 13, mouthBottom: 14,
  mouthLeft: 61, mouthRight: 291,
  // Head pose reference
  noseTip: 1, chin: 152, leftTemple: 234, rightTemple: 454,
};
```

---

## Tests Required

`src/ai/tests/unit/models/landmarksLoader.test.ts`

- Should reject if model exceeds 5 MB
- Output shape should be `[1, 468, 3]`
- Landmark indices exported should cover all EAR and MAR calculations
