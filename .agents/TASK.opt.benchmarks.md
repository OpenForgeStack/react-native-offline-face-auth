# TASK: Benchmark Utilities

**Directory:** `src/ai/optimization/benchmarks/`
**Layer:** OPTIMIZATION
**MVP Day:** Day 7 (verification)
**Depends on:** runtimeManager, authenticationPipeline, memoryManager

---

## Objective

Implement on-device benchmark utilities for latency, FPS, battery, and stress testing. These run only on physical devices and are never called in the production auth flow.

---

## Files to Implement

```
optimization/benchmarks/
├── latencyBenchmark.ts    ← Per-stage pipeline timing
├── fpsBenchmark.ts        ← Sustained frames/sec over 60s window
├── batteryBenchmark.ts    ← mAh estimate per 100 auths
└── stressBenchmark.ts     ← Memory leak test over 500 frames
```

---

## Public Interface

```typescript
runLatencyBenchmark(): Promise<LatencyReport>
runFPSBenchmark(): Promise<FPSReport>
runBatteryBenchmark(): Promise<BatteryReport>
runStressBenchmark(): Promise<StressReport>
```

---

## Types

```typescript
interface LatencyReport {
  stageTimings: Record<PipelineStage, number>;   // ms
  p50: number; p95: number; p99: number;
  totalMs: number;
}

interface FPSReport {
  averageFPS: number;
  minFPS: number;
  dropCount: number;    // frames > 100 ms
  windowSeconds: number;
}

interface StressReport {
  framesProcessed: number;
  memoryDeltaMB: number;
  leakDetected: boolean;
  averageLatencyMs: number;
}
```

---

## Acceptance Criteria

- [ ] None of these functions are called in `authenticateFace` or any pipeline
- [ ] `runLatencyBenchmark` runs pipeline 20 times and returns percentiles
- [ ] `runStressBenchmark` processes 500 frames and measures memory delta
- [ ] All functions are guarded: throw `SDKError` if called in production build

---

## Tests Required

`src/ai/tests/performance/benchmarks/`

- `runLatencyBenchmark`: p95 < 1000 ms on reference device
- `runStressBenchmark`: `leakDetected: false` after 500 frames
