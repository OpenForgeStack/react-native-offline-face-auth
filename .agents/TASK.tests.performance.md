# TASK: Performance & Stress Tests

**Directory:** `src/ai/tests/performance/` and `src/ai/tests/stress/`
**Layer:** TESTS
**MVP Day:** Day 7 (on-device verification)
**Depends on:** full pipeline implementation, benchmarks module

---

## Objective

Verify that the SDK meets its hard performance requirements on a physical Android device. These tests must run on hardware — not in Jest.

---

## Files to Implement

```
tests/performance/
├── authLatency.perf.ts       ← 20 auths → p95 < 1000 ms
├── livenessLatency.perf.ts   ← 20 liveness checks → p95 < 1000 ms
└── fpsConsistency.perf.ts    ← 60s camera session → avg FPS > 8

tests/stress/
├── memoryLeak.stress.ts      ← 500 frames → delta < 5 MB
└── thermalResilience.ts      ← 10 min session → no crash, no freeze
```

---

## Pass/Fail Criteria

| Test | Pass Condition |
|---|---|
| `authLatency` | p95 < 1 000 ms |
| `livenessLatency` | p95 < 1 000 ms |
| `fpsConsistency` | Average FPS > 8 over 60s |
| `memoryLeak` | Memory delta < 5 MB over 500 frames |
| `thermalResilience` | No crash or ANR in 10 min session |

---

## Implementation Notes

- Run via a React Native screen in debug build, not Jest
- Each test logs results to `console.table` and writes to `AsyncStorage` for retrieval
- `thermalResilience` test automatically throttles per `thermalProtection` rules — must still complete

---

## Acceptance Criteria

- [ ] All 5 tests have documented pass/fail verdicts on reference device
- [ ] Reference device spec documented in test file header comment
- [ ] Tests are never imported into production SDK code
