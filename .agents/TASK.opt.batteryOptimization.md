# TASK: Battery & Thermal Optimization

**Directory:** `src/ai/optimization/battery/`
**Layer:** OPTIMIZATION
**MVP Day:** Day 6
**Depends on:** engineState, frameScheduler

---

## Objective

Protect device battery and thermal state during extended face auth sessions. Automatically throttles inference when device runs hot, and reduces CPU load during idle periods.

---

## Files to Implement

```
optimization/battery/
├── batteryOptimizer.ts     ← Coordinates all power-saving strategies
├── cpuUsageBalancer.ts     ← Throttles inference frequency under load
└── thermalProtection.ts    ← Monitors temp; triggers adaptive FPS
```

---

## Key Implementation Notes

**thermalProtection**: use React Native's `AppState` + platform-specific thermal APIs where available. Expose three states: `normal | warm | hot`. Broadcast to `adaptiveFPS` and `pipelineScheduler`.

**cpuUsageBalancer**: tracks inference time per frame. If rolling average > 300 ms → reduce to every 5th frame temporarily.

**batteryOptimizer**: if `AppState === 'background'` → pause all inference. Resume on `foreground`.

---

## Acceptance Criteria

- [ ] Inference pauses when app goes background
- [ ] Thermal `hot` state halves inference frequency
- [ ] CPU overload (>300 ms per frame avg) triggers frequency reduction
- [ ] All thermal state changes reflected in `engineState`

---

## Tests Required

`src/ai/tests/unit/optimization/battery/`

- `thermalProtection`: state transitions normal → warm → hot → normal
- `batteryOptimizer`: background event → inference paused flag set
- `cpuUsageBalancer`: rolling avg > 300 ms → skip interval increases
