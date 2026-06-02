# TASK: initializeSDK

**File:** `src/ai/sdk/initializeSDK.ts`
**Layer:** PUBLIC SDK API
**MVP Day:** Day 1 (environment) → fully wired Day 6
**Depends on:** modelRegistry, runtimeManager, engineState, all module loaders

---

## Objective

Implement `initializeSDK(config: SDKConfig): Promise<void>`.

This is the single entry point the frontend calls before any auth operation. It must:
- Load and warm up all three TFLite models (BlazeFace, FaceMesh, MobileFaceNet)
- Initialize engine state stores (zustand)
- Prime tensor pools
- Run model warm-up passes so first auth has zero cold-start penalty

---

## Acceptance Criteria

- [ ] Calling `initializeSDK` twice does not reload models (idempotent)
- [ ] If any model fails to load, throws `SDKError` with `recoverable: false`
- [ ] `engineState.isReady` is `true` after successful init
- [ ] Model warm-up completes a single blank-frame inference per model
- [ ] Total init time < 3 000 ms on a 3 GB RAM device
- [ ] No network calls are made at any point during init

---

## Types to Define First

```typescript
// src/ai/sdk/sdk.types.ts
interface SDKConfig {
  modelBasePath: string;
  embeddingDimension: 128 | 192;
  livenessTimeout: number;      // ms, default 10000
  authThreshold: number;        // cosine similarity, default 0.6
  enableBenchmarking: boolean;
}

interface SDKInitResult {
  success: boolean;
  modelsLoaded: string[];
  warmupTimeMs: number;
}
```

---

## Implementation Steps

1. Validate `config` shape — throw `SDKError` on missing required fields
2. Call `modelRegistry.loadAll(config.modelBasePath)`
3. Call `runtimeManager.initialize()`
4. For each model: run `modelWarmup.prime(model)` with a 320×320 blank tensor
5. Initialize all four zustand stores with defaults
6. Set `engineState.isReady = true`
7. Return `SDKInitResult`

---

## Tests Required

`src/ai/tests/unit/sdk/initializeSDK.test.ts`

- Should succeed with valid config
- Should throw `SDKError` if model path is invalid
- Should be idempotent on double-call
- Should mark `engineState.isReady` as `true` after success

---

## Prohibited

- No network calls
- No `any` types
- Do not load models from outside `src/ai/models/`
