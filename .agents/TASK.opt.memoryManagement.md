# TASK: Memory Management

**Directory:** `src/ai/optimization/memory/`
**Layer:** OPTIMIZATION
**MVP Day:** Day 5
**Depends on:** engineState

---

## Objective

Prevent memory leaks from tensor allocations and embedding cache growth. Every tensor allocated in a pipeline run must be released. Tensor pooling eliminates `new Float32Array()` in the hot path.

---

## Files to Implement

```
optimization/memory/
├── tensorPooling.ts      ← Pre-allocated tensor pool; checkout/return
├── memoryManager.ts      ← release() called at pipeline end
├── cacheCleaner.ts       ← Evicts stale embedding cache entries
└── garbageCollection.ts ← Triggers GC hints after heavy pipeline runs
```

---

## Key Implementation Notes

**tensorPooling**: pre-allocate a pool of `Float32Array` buffers for the three inference shapes (`[1,128,128,3]`, `[1,192,192,3]`, `[1,112,112,3]`). `checkout(shape)` returns a buffer from pool. `return(buffer)` puts it back. Never allocate new buffers in the hot path.

**memoryManager.release()**: called in the `finally` block of every pipeline. Calls `tensorPool.returnAll()` and clears local references.

**cacheCleaner**: runs on pipeline completion. Evicts cache entries older than TTL (5 min) and over size limit (50 entries).

---

## Acceptance Criteria

- [ ] Zero new `Float32Array` allocations in hot path after warm-up
- [ ] `release()` always called, proven by stress test
- [ ] Pool size covers simultaneous inference needs (at least 3 buffers per shape)
- [ ] Cache never exceeds 50 entries

---

## Tests Required

`src/ai/tests/stress/memory/memoryManager.stress.ts`

- 500 consecutive pipeline runs → memory delta < 5 MB
- `tensorPool.checkout` returns same buffer reference after `return`
- `cacheCleaner`: inserting 60 entries → size capped at 50
