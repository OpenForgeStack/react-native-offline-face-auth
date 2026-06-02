# TASK: authenticateFace

**File:** `src/ai/sdk/authenticateFace.ts`
**Layer:** PUBLIC SDK API
**MVP Day:** Day 6 (critical path)
**Depends on:** authenticationPipeline, livenessModule, recognitionModule, embeddingRepository, cacheState

---

## Objective

Implement `authenticateFace(frame: Frame): Promise<AuthResult>`.

This is the core SDK function. It runs the complete 8-stage authentication pipeline and returns a typed result. Must complete in under 1 000 ms on a 3 GB Android device.

---

## Acceptance Criteria

- [ ] Enforces strict pipeline order: validation → detection → alignment → landmarks → liveness → recognition → comparison
- [ ] Liveness must pass before recognition runs
- [ ] Uses cosine similarity against stored embedding
- [ ] Returns `AuthResult` with `success`, `score`, `confidence`, `livenessScore`, `timestamp`
- [ ] Releases tensors after pipeline completes (`memoryManager.release()`)
- [ ] Checks embedding cache before running recognition inference
- [ ] Total pipeline time logged if `config.enableBenchmarking === true`
- [ ] Throws `SDKError` with `recoverable: true` on liveness failure (user can retry)
- [ ] Throws `SDKError` with `recoverable: false` on model runtime crash

---

## Types to Define First

```typescript
// src/ai/sdk/sdk.types.ts
interface AuthResult {
  success: boolean;
  score: number;           // cosine similarity 0–1
  confidence: number;      // 0–1
  livenessScore: number;   // 0–1
  timestamp: number;       // Unix ms
  durationMs: number;
}
```

---

## Implementation Steps

1. Assert `engineState.isReady`
2. Check frame skip counter — only process if `frameCount % 3 === 0`
3. Run `validationModule.validateFrame(frame)`
4. Run `detectionModule.detectFace(frame)` → bounding box
5. Run `detectionModule.alignFace(crop)` → aligned face
6. Run `landmarksModule.extractLandmarks(alignedFace)` → 468 landmarks
7. Run `livenessModule.verifyLiveness(landmarks)` → must pass before continuing
8. Check `cacheState` for cached embedding; if miss, run `recognitionModule.generateEmbedding`
9. Run `recognitionModule.compareEmbeddings(liveEmbedding, storedEmbedding)`
10. Build and return `AuthResult`
11. Call `memoryManager.release()` in `finally` block

---

## Tests Required

`src/ai/tests/unit/sdk/authenticateFace.test.ts`

- Should return `success: true` for matching mock embedding
- Should return `success: false` for non-matching embedding
- Should throw on liveness failure before running recognition
- Should call `memoryManager.release()` even on pipeline error
- Should use cache instead of re-running inference when cache hit

---

## Prohibited

- Do not skip liveness
- No network calls
- No `any` types
- Do not reorder pipeline stages
