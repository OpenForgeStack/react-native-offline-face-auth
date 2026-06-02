# TASK: Integration Tests

**Directory:** `src/ai/tests/integration/`
**Layer:** TESTS
**MVP Day:** Day 6–7
**Depends on:** unit test mocks, all pipeline implementations

---

## Objective

Test complete pipeline flows end-to-end with mock frames. Integration tests exercise the full data path from Frame input to typed result, without requiring a physical device.

---

## Files to Implement

```
tests/integration/
├── engine/
│   ├── authenticationPipeline.test.ts
│   ├── livenessPipeline.test.ts
│   └── recognitionPipeline.test.ts
└── sdk/
    ├── enrollAndAuthenticate.test.ts   ← Full enroll → auth flow
    └── livenessFlow.test.ts            ← Multi-challenge session
```

---

## Key Test Scenarios

**enrollAndAuthenticate.test.ts:**
1. Initialize SDK with test config
2. `enrollFace(validMockFrame)` → `EnrollResult`
3. `authenticateFace(sameMockFrame)` → `AuthResult { success: true }`
4. `authenticateFace(differentPersonFrame)` → `AuthResult { success: false }`

**livenessFlow.test.ts:**
1. Start session → `verifyLiveness(blinkFrame)` → blink challenge passes
2. Next challenge advances
3. All 4 challenges complete → `LivenessResult { passed: true, livenessScore: 1.0 }`
4. Timeout scenario → throws `LIVENESS_TIMEOUT` error

---

## Acceptance Criteria

- [ ] All integration tests pass without a physical device
- [ ] Full enroll → auth round-trip passes
- [ ] Different-person rejection test passes
- [ ] 4-challenge liveness session completes correctly

---

## Test Data Requirements

Use `mockFrame`, `mockLandmarks`, and `mockEmbedding` from unit test mocks. Do not hardcode pixel data in test files.
