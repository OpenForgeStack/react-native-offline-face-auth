# TASK: Shared Types

**Directory:** `src/ai/shared/types/`
**Layer:** SHARED
**MVP Day:** Day 1 — define before any implementation starts
**Depends on:** nothing

---

## Objective

Define all shared TypeScript types, enums, and interfaces used across modules. This is the first file to create. No implementation — types only.

---

## Files to Implement

```
shared/types/
├── frame.types.ts        ← Frame input types (from Vision Camera)
├── sdk.types.ts          ← Re-export of all public SDK types
├── pipeline.types.ts     ← Internal pipeline data shapes
└── common.types.ts       ← Utility types used everywhere
```

---

## Key Types to Define

```typescript
// frame.types.ts
// Re-use Frame from react-native-vision-camera; extend if needed
import type { Frame } from 'react-native-vision-camera';
export type { Frame };

// common.types.ts
type Milliseconds = number;
type UnixTimestamp = number;
type NormalizedFloat = number;   // 0–1

type Result<T, E = SDKError> =
  | { success: true; data: T }
  | { success: false; error: E };

// pipeline.types.ts
type PipelineStage =
  | 'validation' | 'detection' | 'alignment'
  | 'landmarks' | 'liveness' | 'recognition' | 'comparison';

interface StageResult<T> {
  stage: PipelineStage;
  data: T;
  durationMs: Milliseconds;
}
```

---

## Rules

- All types use `interface` over `type` for object shapes
- All numeric types aliased where semantic meaning matters
- No circular dependencies — this file imports nothing from `src/ai/`

---

## Tests Required

None — types are compile-time only. `tsc --noEmit` passing is the test.
