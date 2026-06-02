# TASK: pipelineScheduler

**File:** `src/ai/engine/scheduler/pipelineScheduler.ts`
**Layer:** ENGINE — SCHEDULER
**MVP Day:** Day 5–6
**Depends on:** inferenceQueue, executionController, engineState

---

## Objective

Manage the execution order of concurrent pipeline requests. Prevents multiple auth pipelines from running simultaneously, enforces the frame skip rule, and routes frames to the correct pipeline.

---

## Acceptance Criteria

- [ ] Only one auth pipeline runs at a time (queued if busy)
- [ ] Enforces `frameCount % 3 === 0` frame skip
- [ ] Drops frames silently when pipeline is already processing (does not queue frames, only tasks)
- [ ] Exposes `schedule(task: PipelineTask): Promise<void>`
- [ ] `engineState.isPipelineRunning` reflects active state accurately

---

## Types to Define First

```typescript
type PipelineTaskType = 'auth' | 'liveness' | 'enrollment';

interface PipelineTask {
  type: PipelineTaskType;
  frame: Frame;
  userId?: string;
  priority: number;
}
```

---

## Implementation Steps

1. Maintain an internal mutex / lock flag
2. `schedule(task)`: if busy, log drop and return early
3. Set `engineState.isPipelineRunning = true`
4. Check frame skip counter
5. Dispatch to appropriate pipeline function
6. Always set `engineState.isPipelineRunning = false` in `finally`

---

## Tests Required

`src/ai/tests/unit/engine/pipelineScheduler.test.ts`

- Concurrent `schedule` calls — second call should be dropped, not run in parallel
- Frame skip counter should drop frames not divisible by 3
- `engineState.isPipelineRunning` should be false after completion
- Should dispatch to correct pipeline based on task type
