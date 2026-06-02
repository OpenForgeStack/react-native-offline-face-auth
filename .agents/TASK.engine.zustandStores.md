# TASK: Zustand State Stores

**Directory:** `src/ai/engine/state/`
**Layer:** ENGINE — STATE
**MVP Day:** Day 2
**Depends on:** zustand, shared/types

---

## Objective

Implement the four zustand stores that manage all SDK runtime state. These are the only state management primitives in `src/ai/`. No React Context, no Redux.

---

## Files to Implement

```
engine/state/
├── engineState.ts    ← Model loaded flags, runtime status
├── authState.ts      ← Current auth session result
├── sessionState.ts   ← Liveness challenge progress
└── cacheState.ts     ← In-memory embedding cache entries
```

---

## Store Definitions

```typescript
// engineState.ts
interface EngineState {
  isReady: boolean;
  isPipelineRunning: boolean;
  modelsLoaded: Record<ModelId, boolean>;
  warmupTimeMs: number;
  thermalState: 'normal' | 'warm' | 'hot';
  setReady: (ready: boolean) => void;
  setThermalState: (state: 'normal' | 'warm' | 'hot') => void;
  setModelLoaded: (id: ModelId, loaded: boolean) => void;
}

// authState.ts
interface AuthState {
  lastResult: AuthResult | null;
  lastScore: number;
  sessionCount: number;
  setResult: (result: AuthResult) => void;
  reset: () => void;
}

// sessionState.ts
interface SessionState {
  currentChallenge: ChallengeType | null;
  challengeSequence: ChallengeType[];
  completedChallenges: ChallengeType[];
  sessionStartedAt: number | null;
  setChallenge: (challenge: ChallengeType) => void;
  completeChallenge: (challenge: ChallengeType) => void;
  startSession: (sequence: ChallengeType[]) => void;
  endSession: () => void;
}

// cacheState.ts
interface CacheState {
  entries: Map<string, CacheEntry>;
  get: (userId: string) => CacheEntry | undefined;
  set: (userId: string, entry: CacheEntry) => void;
  invalidate: (userId: string) => void;
  clear: () => void;
}
```

---

## Acceptance Criteria

- [ ] All stores created with `create<T>()` from zustand
- [ ] No React hooks used inside store definitions
- [ ] `cacheState` uses `Map` not plain object for O(1) lookup
- [ ] All stores have `reset()` action for test teardown

---

## Tests Required

`src/ai/tests/unit/engine/state/`

- `engineState`: `setReady(true)` → `isReady === true`
- `sessionState`: `completeChallenge` advances completed list correctly
- `cacheState`: `get` after `set` returns same entry
- `cacheState`: `invalidate` removes the entry
