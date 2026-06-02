# AI SDK — Task Index

**Scope:** `src/ai/` only — AI SDK Team domain
**Total tasks:** 33
**Read AGENT.md before starting any task.**

---

## Execution Order (follow this sequence)

### Phase 0 — Foundation (start here, Day 1–2)
| # | File | Task | MVP Day |
|---|---|---|---|
| 1 | `TASK.shared.types.md` | Shared TypeScript types | Day 1 |
| 2 | `TASK.shared.errors.md` | SDKError class + error codes | Day 1 |
| 3 | `TASK.shared.utils.md` | Math, tensor, time utilities | Day 1–2 |
| 4 | `TASK.engine.zustandStores.md` | 4 zustand state stores | Day 2 |
| 5 | `TASK.tests.unit.md` | Unit test infra + mock data | Day 2 |

### Phase 1 — Models (Day 3–4)
| # | File | Task | MVP Day |
|---|---|---|---|
| 6 | `TASK.model.registry.md` | Model registry + metadata | Day 3 |
| 7 | `TASK.model.detectionLoader.md` | BlazeFace loader | Day 4 |
| 8 | `TASK.model.landmarksLoader.md` | FaceMesh loader | Day 4 |
| 9 | `TASK.model.recognitionLoader.md` | MobileFaceNet loader | Day 5 |

### Phase 2 — Engine Core (Day 4–5)
| # | File | Task | MVP Day |
|---|---|---|---|
| 10 | `TASK.engine.runtimeManager.md` | Model lifecycle manager | Day 4–5 |
| 11 | `TASK.opt.frameOptimization.md` | Frame skip + adaptive FPS | Day 3 |
| 12 | `TASK.opt.inferenceOptimization.md` | Async inference + warmup | Day 5 |
| 13 | `TASK.opt.memoryManagement.md` | Tensor pooling + release | Day 5 |
| 14 | `TASK.engine.pipelineScheduler.md` | Pipeline mutex + frame gate | Day 5–6 |

### Phase 3 — Modules (Day 4–7)
| # | File | Task | MVP Day |
|---|---|---|---|
| 15 | `TASK.mod.validation.md` | Frame quality checks | Day 3–4 |
| 16 | `TASK.mod.detection.md` | BlazeFace detection + alignment | Day 4 |
| 17 | `TASK.mod.landmarks.md` | FaceMesh 468 landmarks | Day 4–5 |
| 18 | `TASK.mod.recognition.md` | Embedding gen + comparison + cache | Day 5 |
| 19 | `TASK.mod.liveness.md` | EAR/MAR/pose challenge system | Day 7 |
| 20 | `TASK.mod.gps.md` | Offline GPS + spoof detection | Day 6 |
| 21 | `TASK.mod.antispoof.md` | Texture + replay anti-spoof | Post-MVP |

### Phase 4 — Pipelines (Day 5–7)
| # | File | Task | MVP Day |
|---|---|---|---|
| 22 | `TASK.engine.recognitionPipeline.md` | Recognition sub-pipeline | Day 5 |
| 23 | `TASK.engine.livenessPipeline.md` | Liveness orchestration | Day 7 |
| 24 | `TASK.engine.authenticationPipeline.md` | Master 8-stage pipeline | Day 6 |

### Phase 5 — Public SDK API (Day 5–7)
| # | File | Task | MVP Day |
|---|---|---|---|
| 25 | `TASK.sdk.getRecognitionScore.md` | Score reader from state | Day 6 |
| 26 | `TASK.sdk.enrollFace.md` | Enrollment with encryption | Day 5–6 |
| 27 | `TASK.sdk.authenticateFace.md` | Full auth pipeline entry | Day 6 |
| 28 | `TASK.sdk.verifyLiveness.md` | Standalone liveness check | Day 7 |
| 29 | `TASK.sdk.initializeSDK.md` | SDK bootstrap + warmup | Day 1/6 |

### Phase 6 — Optimization & Tests (Day 6–7)
| # | File | Task | MVP Day |
|---|---|---|---|
| 30 | `TASK.opt.batteryOptimization.md` | Thermal + battery protection | Day 6 |
| 31 | `TASK.opt.benchmarks.md` | Benchmark utilities | Day 7 |
| 32 | `TASK.tests.integration.md` | End-to-end pipeline tests | Day 6–7 |
| 33 | `TASK.tests.performance.md` | On-device latency + stress | Day 7 |

---

## MVP Critical Path (12 tasks to reach Day 7 success criterion)

1. `TASK.shared.types.md`
2. `TASK.shared.errors.md`
3. `TASK.model.detectionLoader.md`
4. `TASK.model.landmarksLoader.md`
5. `TASK.model.recognitionLoader.md`
6. `TASK.mod.detection.md`
7. `TASK.mod.landmarks.md`
8. `TASK.mod.recognition.md`
9. `TASK.mod.liveness.md`
10. `TASK.engine.authenticationPipeline.md`
11. `TASK.sdk.enrollFace.md`
12. `TASK.sdk.authenticateFace.md`

**MVP success:** `authenticateFace()` returns correct accept/reject offline in < 1s on physical Android.

---

## Prohibited (applies to all tasks)

No YOLO · No cloud inference · No GPU deps · No network calls in src/ai/ · No cross-module direct imports · No `any` types · No magic error strings

