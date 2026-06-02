# TASK: Shared Utilities

**Directory:** `src/ai/shared/utils/`
**Layer:** SHARED
**MVP Day:** Day 1–2
**Depends on:** nothing

---

## Objective

Pure utility functions used across the SDK. Math helpers, tensor utilities, and logging. All functions are pure — no side effects, no state.

---

## Files to Implement

```
shared/utils/
├── mathUtils.ts        ← Vector math, normalization, distance
├── tensorUtils.ts      ← Tensor shape validation, flatten, reshape
├── timeUtils.ts        ← Timestamp helpers, duration measurement
└── logger.ts           ← SDK-internal logger (dev only, strips in prod)
```

---

## Key Implementations

```typescript
// mathUtils.ts
function l2Normalize(vector: Float32Array): Float32Array
function dotProduct(a: Float32Array, b: Float32Array): number
function clamp(value: number, min: number, max: number): number
function euclideanDistance2D(p1: {x:number,y:number}, p2: {x:number,y:number}): number

// tensorUtils.ts
function validateShape(tensor: Float32Array, expected: number[]): boolean
function flattenToFloat32(pixels: number[][][]): Float32Array
function reshapeTensor(flat: Float32Array, shape: number[]): number[][][]

// timeUtils.ts
function now(): number                            // Date.now()
function measureMs(fn: () => void): number        // synchronous duration
function formatDuration(ms: number): string       // "123ms"

// logger.ts
// Only logs in __DEV__ — compiled out in release
function sdkLog(module: string, message: string, data?: unknown): void
function sdkWarn(module: string, message: string): void
function sdkError(module: string, error: SDKError): void
```

---

## Tests Required

`src/ai/tests/unit/shared/`

- `l2Normalize`: normalized vector should have magnitude 1.0
- `dotProduct`: orthogonal unit vectors → 0
- `clamp`: values outside range are clamped correctly
- `validateShape`: mismatched shape returns false
- `measureMs`: returns positive number
