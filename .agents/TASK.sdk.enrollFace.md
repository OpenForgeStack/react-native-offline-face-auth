# TASK: enrollFace

**File:** `src/ai/sdk/enrollFace.ts`
**Layer:** PUBLIC SDK API
**MVP Day:** Day 5–6
**Depends on:** authenticationPipeline, embeddingRepository, validationModule, detectionModule, recognitionModule

---

## Objective

Implement `enrollFace(frame: Frame): Promise<EnrollResult>`.

Enrollment captures the user's face embedding and persists it encrypted in SQLite. This embedding becomes the reference for all future `authenticateFace` calls.

---

## Acceptance Criteria

- [ ] Validates frame quality before running inference (blur, brightness, face size)
- [ ] Runs full detection → alignment → landmark → recognition pipeline
- [ ] Stores the resulting embedding as AES-256 encrypted BLOB via `securityService`
- [ ] Returns `EnrollResult` with `userId`, `enrolledAt`, `embeddingDimension`
- [ ] Throws `SDKError` if face quality check fails (recoverable: true — user can retry)
- [ ] Throws `SDKError` if userId already enrolled (caller must call `deleteEnrollment` first)
- [ ] No liveness check required during enrollment

---

## Types to Define First

```typescript
// src/ai/sdk/sdk.types.ts
interface EnrollResult {
  userId: string;
  enrolledAt: number;        // Unix ms
  embeddingDimension: number;
  qualityScore: number;      // 0–1
}
```

---

## Implementation Steps

1. Assert `engineState.isReady` — throw if SDK not initialized
2. Run `validationModule.validateFrame(frame)` — throw on failure
3. Run `detectionModule.detectFace(frame)` → get bounding box
4. Run `detectionModule.alignFace(croppedFace)` → aligned face
5. Run `recognitionModule.generateEmbedding(alignedFace)` → Float32Array
6. Encrypt embedding via `securityService.encryptBlob(embedding)`
7. Persist via `embeddingRepository.insert({ userId, encryptedBlob, enrolledAt })`
8. Update `cacheState` with new embedding entry
9. Return `EnrollResult`

---

## Tests Required

`src/ai/tests/unit/sdk/enrollFace.test.ts`

- Should enroll successfully with a valid mock frame
- Should throw on blurry frame
- Should throw on duplicate userId
- Should call `securityService.encryptBlob` before `embeddingRepository.insert`
- Should update `cacheState` after successful enrollment

---

## Prohibited

- No liveness checks during enrollment
- No network calls
- Do not store raw (unencrypted) embedding bytes
