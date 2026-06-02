# TASK: Recognition Module

**Directory:** `src/ai/modules/recognition/`
**Layer:** MODULES
**MVP Day:** Day 5
**Depends on:** recognitionLoader, runtimeManager, cacheState, embeddingRepository

---

## Objective

Generate face embeddings using MobileFaceNet INT8, compare them using cosine similarity, and manage the embedding cache. This is the identity layer of the SDK.

---

## Files to Implement

```
modules/recognition/
├── services/
│   ├── generateEmbedding.ts    ← MobileFaceNet inference → Float32Array
│   ├── compareEmbeddings.ts    ← Entry: full comparison flow
│   ├── recognizeFace.ts        ← Recognize against all enrolled users
│   └── verifyIdentity.ts       ← Verify against specific userId
├── similarity/
│   ├── cosineSimilarity.ts     ← Core math function
│   ├── euclideanDistance.ts    ← Alternative metric (non-primary)
│   └── similarityThreshold.ts  ← Threshold constants + adaptive logic
├── cache/
│   ├── embeddingCache.ts       ← In-memory cache backed by zustand
│   ├── cacheManager.ts         ← LRU eviction, TTL
│   └── cachePolicy.ts          ← Policy constants
├── optimization/
│   ├── embeddingBatching.ts    ← Batch embeddings for enrollment
│   ├── vectorCompression.ts    ← Int8 quantization of stored vectors
│   └── inferenceOptimization.ts ← Pre/post processing optimizations
└── types/
    └── recognition.types.ts
```

---

## Types to Define First

```typescript
interface EmbeddingResult {
  embedding: Float32Array;   // length 128 or 192
  generationTimeMs: number;
}

interface ComparisonResult {
  score: number;        // cosine similarity 0–1
  passed: boolean;      // score >= threshold
  metric: 'cosine';
}

interface CacheEntry {
  userId: string;
  embedding: Float32Array;
  cachedAt: number;
  hitCount: number;
}
```

---

## Key Implementation Notes

**cosineSimilarity**: `dot(a, b) / (|a| * |b|)`. Both vectors must be L2-normalized first. Result range: `[-1, 1]`, clamp to `[0, 1]` for scoring.

**embeddingCache**: max 50 entries, LRU eviction. TTL: 5 minutes per session. Backed by `cacheState` zustand store.

**generateEmbedding**: input is `AlignedFace` (112×112×3 Float32Array). Normalize to `[-1, 1]`. Run inference. Return output tensor as `Float32Array`.

---

## Acceptance Criteria

- [ ] `cosineSimilarity` returns values in `[0, 1]` for valid face embeddings
- [ ] Cache hit skips TFLite inference entirely
- [ ] Cache evicts LRU entries when limit exceeded
- [ ] Exports only through `index.ts`
- [ ] No imports from `detection/`, `liveness/`, or `landmarks/`

---

## Tests Required

`src/ai/tests/unit/modules/recognition/`

- `cosineSimilarity`: identical vectors → `1.0`; orthogonal vectors → `0.0`
- `generateEmbedding`: output length matches `embeddingDimension` config
- `embeddingCache`: second call returns cached result, not new inference
- `cacheManager`: evicts oldest entry when limit reached
- `similarityThreshold`: score >= 0.6 should return `passed: true`
