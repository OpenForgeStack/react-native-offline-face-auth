# TASK: recognitionPipeline

**File:** `src/ai/engine/pipelines/recognitionPipeline.ts`
**Layer:** ENGINE — PIPELINES
**MVP Day:** Day 5
**Depends on:** recognitionModule, cacheState, embeddingRepository

---

## Objective

Orchestrate recognition-specific flow: embedding generation, cache check, comparison, and threshold decision. Extracted from `authenticationPipeline` as a composable sub-pipeline.

---

## Acceptance Criteria

- [ ] Checks `cacheState` before running TFLite inference
- [ ] Cache miss → runs MobileFaceNet inference and updates cache
- [ ] Compares live embedding against stored embedding using cosine similarity
- [ ] Returns `RecognitionPipelineResult` with score, verdict, and cache hit flag
- [ ] Threshold loaded from `sdkConfig.authThreshold`

---

## Types to Define First

```typescript
interface RecognitionPipelineResult {
  score: number;
  passed: boolean;
  cacheHit: boolean;
  embeddingDimension: number;
}
```

---

## Implementation Steps

1. Check `cacheState.get(userId)` → if hit, skip inference
2. If miss: run `recognitionModule.generateEmbedding(alignedFace)` → Float32Array
3. Update `cacheState.set(userId, embedding)`
4. Load stored embedding from `embeddingRepository.get(userId)` and decrypt
5. Compute `cosineSimilarity(liveEmbedding, storedEmbedding)`
6. Apply `sdkConfig.authThreshold` → boolean verdict
7. Return `RecognitionPipelineResult`

---

## Tests Required

`src/ai/tests/integration/engine/recognitionPipeline.test.ts`

- Should return `cacheHit: true` on second call for same userId
- Should return `passed: true` for identical embeddings
- Should return `passed: false` when cosine similarity < threshold
- Should decrypt stored embedding before comparison
