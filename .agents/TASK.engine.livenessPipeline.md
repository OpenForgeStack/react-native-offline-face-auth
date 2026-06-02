# TASK: livenessPipeline

**File:** `src/ai/engine/pipelines/livenessPipeline.ts`
**Layer:** ENGINE — PIPELINES
**MVP Day:** Day 7
**Depends on:** landmarksModule, livenessModule, sessionState

---

## Objective

Orchestrate the liveness-only pipeline. Used by both `verifyLiveness()` (standalone SDK call) and as Stage 5 inside `authenticationPipeline`.

---

## Acceptance Criteria

- [ ] Accepts a `LandmarkResult` (not a raw frame — landmarks already extracted upstream)
- [ ] Dispatches to the correct challenge analyzer based on `sessionState.currentChallenge`
- [ ] Returns `LivenessPipelineResult` with pass/fail, score, and active challenge
- [ ] Challenge sequencer is called here to advance or start sessions
- [ ] Does not load or call any TFLite model (landmark-only)

---

## Types to Define First

```typescript
interface LivenessPipelineResult {
  passed: boolean;
  livenessScore: number;
  currentChallenge: ChallengeType;
  completedChallenges: ChallengeType[];
}
```

---

## Implementation Steps

1. Read `sessionState.currentChallenge`
2. If no session active → call `challengeSequencer.startNewSession()`
3. Dispatch: `blink` → `eyeAspectRatio`; `smile` → `mouthRatio`; `turn_*` → `poseAnalysis`
4. Call `livenessValidator.validate(analysisResult, currentChallenge)`
5. On pass: advance session to next challenge via `challengeSequencer.next()`
6. Compute `livenessScore` from `livenessScore.ts`
7. Return `LivenessPipelineResult`

---

## Tests Required

`src/ai/tests/integration/engine/livenessPipeline.test.ts`

- Blink challenge passes when EAR drops below threshold
- Smile challenge passes when MAR exceeds threshold
- Head turn passes when yaw angle exceeds threshold
- Session advances correctly after each challenge pass
- Returns `passed: false` for all challenges on neutral landmarks
