# TASK: verifyLiveness

**File:** `src/ai/sdk/verifyLiveness.ts`
**Layer:** PUBLIC SDK API
**MVP Day:** Day 7
**Depends on:** livenessPipeline, landmarksModule, sessionState

---

## Objective

Implement `verifyLiveness(frame: Frame): Promise<LivenessResult>`.

Standalone liveness verification exposed to the frontend for cases where liveness must be checked independently (e.g., anti-fatigue challenge refresh). Internally delegates to `livenessPipeline`.

---

## Acceptance Criteria

- [ ] Runs landmark extraction → challenge evaluation
- [ ] Returns current challenge, pass/fail, and liveness score
- [ ] Challenge sequence is randomized per session (never same order twice in a row)
- [ ] Session state tracks challenge progress across multiple frame calls
- [ ] Times out after `config.livenessTimeout` ms — throws recoverable `SDKError`
- [ ] Does NOT run face recognition

---

## Types to Define First

```typescript
// src/ai/sdk/sdk.types.ts
type ChallengeType = 'blink' | 'smile' | 'turn_left' | 'turn_right';

interface LivenessResult {
  passed: boolean;
  currentChallenge: ChallengeType;
  completedChallenges: ChallengeType[];
  livenessScore: number;   // 0–1
  remainingMs: number;
}
```

---

## Implementation Steps

1. Assert `engineState.isReady`
2. Get active challenge from `sessionState.currentChallenge`
3. If no active session, call `challengeSequencer.startNewSession()` — randomizes challenge order
4. Run `landmarksModule.extractLandmarks(frame)`
5. Dispatch to appropriate analyzer: `eyeAspectRatio`, `mouthRatio`, or `poseAnalysis`
6. Run `livenessValidator.validate(analysisResult, currentChallenge)`
7. Update `sessionState` with result
8. Return `LivenessResult`

---

## Tests Required

`src/ai/tests/unit/sdk/verifyLiveness.test.ts`

- Should return `passed: false` on blank frame
- Should advance `completedChallenges` when challenge passes
- Should generate different challenge order each new session
- Should throw on timeout
- Should not call recognition pipeline at any point

---

## Prohibited

- No recognition inference
- No network calls
- Challenge order must never be hardcoded
