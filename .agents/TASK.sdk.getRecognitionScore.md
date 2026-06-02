# TASK: getRecognitionScore

**File:** `src/ai/sdk/getRecognitionScore.ts`
**Layer:** PUBLIC SDK API
**MVP Day:** Day 6
**Depends on:** authState, cacheState

---

## Objective

Implement `getRecognitionScore(): Promise<number>`.

Returns the cosine similarity score from the most recent `authenticateFace` call. Useful for UI to display confidence without re-running inference.

---

## Acceptance Criteria

- [ ] Returns score from `authState.lastScore`
- [ ] Returns `0` if no auth session has been run yet (not an error)
- [ ] Is a pure state read — no inference, no I/O
- [ ] Resolves immediately (< 5 ms)

---

## Implementation Steps

1. Read `authState.lastScore`
2. Return value or `0` if undefined

---

## Tests Required

`src/ai/tests/unit/sdk/getRecognitionScore.test.ts`

- Should return `0` before any auth attempt
- Should return the score from last `authState` update
- Should resolve in under 5 ms
