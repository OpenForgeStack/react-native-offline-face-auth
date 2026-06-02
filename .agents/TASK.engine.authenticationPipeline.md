# TASK: authenticationPipeline

**File:** `src/ai/engine/pipelines/authenticationPipeline.ts`
**Layer:** ENGINE — PIPELINES
**MVP Day:** Day 6
**Depends on:** validationModule, detectionModule, landmarksModule, livenessModule, recognitionModule, memoryManager

---

## Objective

Implement the master authentication pipeline that sequences all 8 stages. This is the single place where stage order is enforced. All SDK-level `authenticateFace` calls flow through here.

---

## Acceptance Criteria

- [ ] Stages execute in strict order: validation → detection → alignment → landmarks → liveness → recognition → comparison → result
- [ ] Each stage receives only its required inputs (no god-object passing)
- [ ] Pipeline aborts cleanly at any failed stage and propagates the `SDKError`
- [ ] `memoryManager.release()` called in `finally` regardless of outcome
- [ ] Stage timings captured if benchmarking enabled
- [ ] Returns `PipelineResult` typed object

---

## Types to Define First

```typescript
// No cross-module imports — define locally:
interface PipelineResult {
  authResult: AuthResult;
  stageDurations: Record<PipelineStage, number>;
}

type PipelineStage =
  | 'validation'
  | 'detection'
  | 'alignment'
  | 'landmarks'
  | 'liveness'
  | 'recognition'
  | 'comparison';
```

---

## Implementation Steps

1. Define `runAuthenticationPipeline(frame: Frame, userId: string): Promise<PipelineResult>`
2. Stage 1: `validationModule.validateFrame(frame)` — throw on fail
3. Stage 2: `detectionModule.detectFace(frame)` → `DetectionResult`
4. Stage 3: `detectionModule.alignFace(detection)` → `AlignedFace`
5. Stage 4: `landmarksModule.extractLandmarks(alignedFace)` → `LandmarkResult`
6. Stage 5: `livenessModule.evaluate(landmarks)` → must return `passed: true` to continue
7. Stage 6: `recognitionModule.generateEmbedding(alignedFace)` → `Float32Array`
8. Stage 7: Load stored embedding for `userId` from cache or DB → `compareEmbeddings`
9. Stage 8: Build `AuthResult` from comparison score
10. Wrap in try/finally → `memoryManager.release()`

---

## Tests Required

`src/ai/tests/integration/engine/authenticationPipeline.test.ts`

- Full pipeline with mock frames — valid face should return `success: true`
- Should abort at validation stage for blurry frame
- Should abort at liveness stage and not run recognition
- Should call `memoryManager.release()` on both success and error paths
- Stage durations should all be positive numbers

---

## Prohibited

- Do not import directly between modules (only through this pipeline)
- Do not hardcode threshold values — read from `sdkConfig`
