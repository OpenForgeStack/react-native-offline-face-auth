# TASK: Frame Optimization

**Directory:** `src/ai/optimization/frame/`
**Layer:** OPTIMIZATION
**MVP Day:** Day 3
**Depends on:** engineState, thermalMonitor

---

## Objective

Implement the frame-level optimization layer. Controls which frames enter the pipeline and at what rate, entirely within the Vision Camera worklet context.

---

## Files to Implement

```
optimization/frame/
├── frameSkipper.ts      ← N % 3 === 0 gate
├── adaptiveFPS.ts       ← Reduces FPS under thermal/battery pressure
├── frameScheduler.ts    ← Coordinates skipping + FPS together
└── frameQueue.ts        ← Single-slot queue, drops stale frames
```

---

## Key Implementation Notes

**frameSkipper**: stateful counter. Increments on every camera frame. Returns `true` (process this frame) only when `counter % 3 === 0`. Resets safely on pipeline reset.

**adaptiveFPS**: subscribes to `thermalMonitor`. At normal temp → process every 3rd frame. At warm → every 5th. At hot → every 10th (inference pause mode).

**frameQueue**: holds at most 1 pending frame. If a new frame arrives before current is processed, the current is replaced (always latest wins). Prevents memory buildup.

---

## Acceptance Criteria

- [ ] Only ~1/3 of camera frames pass `frameSkipper`
- [ ] `adaptiveFPS` reduces processing rate on thermal events
- [ ] `frameQueue` never grows beyond 1 entry
- [ ] All code is worklet-safe (no React state, no bridge calls)

---

## Tests Required

`src/ai/tests/unit/optimization/frame/`

- `frameSkipper`: 9 frames → exactly 3 pass through
- `adaptiveFPS`: thermal event → skip interval increases
- `frameQueue`: 5 rapid pushes → only 1 frame retained
