# TASK: Unit Test Infrastructure

**Directory:** `src/ai/tests/unit/`
**Layer:** TESTS
**MVP Day:** Day 2 (setup) → ongoing
**Depends on:** jest, shared/errors, shared/utils

---

## Objective

Set up the unit test infrastructure and implement shared test utilities (mock frames, mock landmarks, mock embeddings). Unit tests run without a device — pure logic only.

---

## Files to Implement

```
tests/unit/
├── __mocks__/
│   ├── mockFrame.ts           ← Fake Vision Camera Frame
│   ├── mockLandmarks.ts       ← 468-landmark array (frontal face, blink, smile, turn)
│   ├── mockEmbedding.ts       ← Known 128-dim Float32Array pairs (match + no-match)
│   └── mockModels.ts          ← Stub TFLite model that returns deterministic output
├── setup.ts                   ← Jest global setup (resets stores before each test)
└── testUtils.ts               ← Helpers: assertSDKError, assertShape, etc.
```

---

## Key Mock Implementations

```typescript
// mockLandmarks.ts
export const FRONTAL_FACE_LANDMARKS: Landmark[]   // neutral, eyes open, mouth closed
export const BLINK_LANDMARKS: Landmark[]           // EAR < 0.21
export const SMILE_LANDMARKS: Landmark[]           // MAR > 0.6
export const TURN_LEFT_LANDMARKS: Landmark[]       // yaw < -25°

// mockEmbedding.ts
export const MATCHING_EMBEDDING_A: Float32Array    // cosine similarity > 0.8 with B
export const MATCHING_EMBEDDING_B: Float32Array
export const NON_MATCHING_EMBEDDING: Float32Array  // cosine similarity < 0.3 with A
```

---

## jest.config additions

```javascript
// jest.config.js
moduleNameMapper: {
  'react-native-fast-tflite': '<rootDir>/src/ai/tests/unit/__mocks__/mockModels.ts',
  'react-native-vision-camera': '<rootDir>/src/ai/tests/unit/__mocks__/mockFrame.ts',
}
```

---

## Acceptance Criteria

- [ ] All unit tests run with `jest` — no emulator or device needed
- [ ] Mock landmarks cover all 4 challenge states
- [ ] `MATCHING_EMBEDDING_A` and `B` have cosine similarity > 0.8
- [ ] Store reset runs in `beforeEach` via `setup.ts`

---

## Tests Required

`tests/unit/testUtils.test.ts`

- `assertSDKError`: correctly identifies `SDKError` instances
- Mock landmark arrays have length 468
- `MATCHING_EMBEDDING_A` cosine similarity with `B` > 0.8
