# TASK: Liveness Module

**Directory:** `src/ai/modules/liveness/`
**Layer:** MODULES
**MVP Day:** Day 7 (critical path MVP)
**Depends on:** landmarks module output only — NO TFLite model

---

## Objective

Detect liveness using facial landmark analysis only. No separate liveness model. Implements blink, smile, and head-turn challenges using Eye Aspect Ratio, Mouth Aspect Ratio, and head pose angles from Face Mesh output.

---

## Files to Implement

```
modules/liveness/
├── challenges/
│   ├── blinkChallenge.ts       ← EAR-based blink detection
│   ├── smileChallenge.ts       ← MAR-based smile detection
│   ├── headTurnChallenge.ts    ← Yaw-based head turn detection
│   ├── randomChallenge.ts      ← Session-safe randomizer
│   └── challengeSequencer.ts  ← Manages challenge order per session
├── analysis/
│   ├── eyeAspectRatio.ts       ← EAR = (|p2-p6| + |p3-p5|) / (2 * |p1-p4|)
│   ├── mouthRatio.ts           ← MAR = vertical dist / horizontal dist
│   ├── movementAnalysis.ts     ← Temporal: detects movement across frames
│   ├── motionConsistency.ts    ← Ensures motion is physiologically plausible
│   └── poseAnalysis.ts         ← Head pose challenge evaluator
├── validators/
│   ├── blinkValidator.ts       ← EAR drops below threshold → blink confirmed
│   ├── smileValidator.ts       ← MAR exceeds threshold → smile confirmed
│   ├── poseValidator.ts        ← Yaw > threshold → head turn confirmed
│   └── livenessValidator.ts    ← Dispatches to correct sub-validator
├── scoring/
│   ├── livenessScore.ts        ← Weighted overall liveness score
│   ├── confidenceScore.ts      ← Confidence in liveness decision
│   └── challengeScore.ts       ← Per-challenge pass score
└── types/
    └── liveness.types.ts
```

---

## Types to Define First

```typescript
type ChallengeType = 'blink' | 'smile' | 'turn_left' | 'turn_right';

interface EARResult {
  leftEAR: number;
  rightEAR: number;
  averageEAR: number;
  blinkDetected: boolean;
}

interface MARResult {
  mar: number;
  smileDetected: boolean;
}

interface ChallengeSessionState {
  sequence: ChallengeType[];     // randomized at session start
  currentIndex: number;
  completedAt: number[];         // Unix ms per challenge
  startedAt: number;
}

interface LivenessChallengeResult {
  passed: boolean;
  challenge: ChallengeType;
  score: number;
  durationMs: number;
}
```

---

## EAR Formula

```
EAR = (||p2 - p6|| + ||p3 - p5||) / (2 * ||p1 - p4||)

Where for left eye:
  p1 = leftEyeLeft  (landmark 33)
  p2 = leftEyeTop   (landmark 159)
  p3 = ...
  p4 = leftEyeRight (landmark 133)
  p5-p6 = bottom eyelid points
```

EAR blink threshold: `< 0.21` for 2+ consecutive frames.

## MAR Formula

```
MAR = (||top - bottom||) / (||left - right||)

Smile threshold: MAR > 0.6 AND lip corners above nose-mouth midpoint
```

---

## Challenge Sequencer Rules

- Start session: `shuffle(['blink', 'smile', 'turn_left', 'turn_right'])`
- Use Fisher-Yates shuffle
- Compare last session's sequence — if identical, re-shuffle
- Store last sequence in `sessionState`

---

## Acceptance Criteria

- [ ] EAR calculation matches formula exactly
- [ ] Blink requires drop below threshold for ≥ 2 consecutive frames
- [ ] Challenge sequence randomizes per session
- [ ] Never same sequence twice in a row
- [ ] `livenessValidator` dispatches correctly without cross-module imports
- [ ] No TFLite model used anywhere in this module
- [ ] Exports only through `index.ts`

---

## Tests Required

`src/ai/tests/unit/modules/liveness/`

- `eyeAspectRatio`: known landmark coords → expected EAR value
- `blinkValidator`: EAR = 0.18 for 3 frames → `blinkDetected: true`
- `smileValidator`: MAR = 0.75 → `smileDetected: true`
- `poseValidator`: yaw > 25° → head turn confirmed
- `challengeSequencer`: 10 sessions → no two consecutive identical sequences
- `livenessScore`: all 4 challenges passed → score = 1.0
