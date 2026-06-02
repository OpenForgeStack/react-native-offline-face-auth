# TASK: runtimeManager

**File:** `src/ai/engine/runtime/runtimeManager.ts`
**Layer:** ENGINE — RUNTIME
**MVP Day:** Day 4–5
**Depends on:** modelRegistry, thermalMonitor, deviceProfiler, engineState

---

## Objective

Manage the lifecycle of TFLite model instances. Handles loading, unloading, warm-up, and runtime health. The single owner of model handles — no other module holds model references directly.

---

## Acceptance Criteria

- [ ] Loads all three TFLite models on `initialize()`
- [ ] Exposes `getModel(modelId: ModelId)` for pipeline use
- [ ] Monitors thermal state — throttles inference when device temp threshold exceeded
- [ ] Tracks model load status per model in `engineState`
- [ ] Graceful unload on app background event
- [ ] Warm-up: runs one blank inference per model after load

---

## Types to Define First

```typescript
type ModelId = 'blazeface' | 'facemesh' | 'mobilefacenet' | 'antispoof';

interface ModelHandle {
  id: ModelId;
  instance: TensorflowModel;  // from react-native-fast-tflite
  inputShape: [number, number, number, number];
  outputShape: [number, number];
  isLoaded: boolean;
}
```

---

## Implementation Steps

1. `initialize()`: iterate `modelRegistry.getAll()` → call `loadModel(entry)` for each
2. `loadModel`: use `react-native-fast-tflite` to load `.tflite` from `src/ai/models/`
3. Store handle in private map
4. Run warm-up inference with zero tensor
5. Subscribe to `thermalMonitor.onThrottle` → pause scheduling on thermal event
6. `getModel(id)`: return handle or throw `SDKError` if not loaded
7. `unloadAll()`: release all model handles

---

## Tests Required

`src/ai/tests/unit/engine/runtimeManager.test.ts`

- Should load all models without error
- `getModel` should throw if called before `initialize()`
- Should update `engineState.modelsLoaded` after each model loads
- Thermal throttle event should pause inference flag
- `unloadAll` should clear all handles
