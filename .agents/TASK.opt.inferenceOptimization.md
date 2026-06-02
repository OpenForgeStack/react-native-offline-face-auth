# TASK: Inference Optimization

**Directory:** `src/ai/optimization/inference/`
**Layer:** OPTIMIZATION
**MVP Day:** Day 5
**Depends on:** runtimeManager, engineState

---

## Objective

Optimize TFLite inference performance. Covers async execution, lazy model loading, parallel inference where applicable, and model warm-up.

---

## Files to Implement

```
optimization/inference/
├── asyncInference.ts      ← Wraps TFLite run in non-blocking Promise
├── lazyLoading.ts         ← Defers model load until first use
├── parallelInference.ts   ← Runs detection + (when safe) other models concurrently
└── modelWarmup.ts         ← Blank-frame warm-up at SDK init
```

---

## Key Implementation Notes

**asyncInference**: wraps synchronous TFLite `run()` call in a `setImmediate`-deferred Promise to yield the JS thread briefly between pipeline stages.

**modelWarmup**: on SDK init, run one `[1, H, W, 3]` zero-filled tensor through each model. Discards output. Ensures JIT compilation completes before first real auth.

**lazyLoading**: FaceMesh and MobileFaceNet are lazy — loaded on first use, not at `initializeSDK`. BlazeFace loads eagerly (needed immediately on camera start).

**parallelInference**: BlazeFace and FaceMesh can run in parallel on frame N-1 results if pipelining. Use `Promise.all` carefully — only if both models have separate tensor pools.

---

## Acceptance Criteria

- [ ] Model warm-up completes at init, before first auth
- [ ] BlazeFace loads eagerly; FaceMesh + MobileFaceNet load lazily
- [ ] `asyncInference` does not block the RN bridge
- [ ] Warm-up time logged to `engineState.warmupTimeMs`

---

## Tests Required

`src/ai/tests/unit/optimization/inference/`

- `modelWarmup`: all three models marked warm after `primeAll()`
- `lazyLoading`: FaceMesh not loaded at SDK init; loads on first landmark call
- `asyncInference`: resolves as Promise (not sync return)
