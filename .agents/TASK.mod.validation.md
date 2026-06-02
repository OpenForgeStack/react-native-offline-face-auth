# TASK: Validation Module

**Directory:** `src/ai/modules/validation/`
**Layer:** MODULES
**MVP Day:** Day 3–4
**Depends on:** shared/utils, shared/errors — NO TFLite model

---

## Objective

Gate every frame entering the pipeline with image quality and face condition checks. All checks are CPU-only pixel analysis — no inference required. This is Stage 1 of the authentication pipeline.

---

## Files to Implement

```
modules/validation/
├── quality/
│   ├── blurDetector.ts         ← Laplacian variance method
│   ├── brightnessValidator.ts  ← Mean pixel brightness check
│   └── shadowDetector.ts       ← Histogram asymmetry for shadow detection
├── face/
│   ├── faceSizeCheck.ts        ← Bounding box >= 15% of frame width
│   ├── multipleFaceCheck.ts    ← faceCount > 1 → reject
│   └── frameQualityScore.ts    ← Composite 0–1 quality score
└── types/
    └── validation.types.ts
```

---

## Types to Define First

```typescript
interface ValidationResult {
  passed: boolean;
  qualityScore: number;   // 0–1 composite
  failures: ValidationFailure[];
}

interface ValidationFailure {
  code: ValidationFailureCode;
  message: string;
}

type ValidationFailureCode =
  | 'BLUR_DETECTED'
  | 'TOO_DARK'
  | 'TOO_BRIGHT'
  | 'SHADOW_DETECTED'
  | 'FACE_TOO_SMALL'
  | 'MULTIPLE_FACES'
  | 'NO_FACE';
```

---

## Key Implementation Notes

**blurDetector**: compute Laplacian of the grayscale frame. Variance < 100 = blurry.

**brightnessValidator**: mean pixel value. Thresholds: `< 40` = too dark, `> 220` = overexposed.

**shadowDetector**: compare left/right half brightness histograms. Asymmetry ratio > 0.4 = shadow.

All checks on downsampled 320×320 frame for speed.

---

## Acceptance Criteria

- [ ] `validateFrame` returns all failures in one pass (not early-exit on first)
- [ ] Quality score is composite of all checks
- [ ] `passed: false` if ANY critical check fails
- [ ] Runs in < 10 ms on 320×320 frame
- [ ] Exports only through `index.ts`
- [ ] No TFLite model loaded or called

---

## Tests Required

`src/ai/tests/unit/modules/validation/`

- `blurDetector`: uniform-color frame → blur detected
- `brightnessValidator`: all-zero frame → TOO_DARK
- `brightnessValidator`: all-255 frame → TOO_BRIGHT
- `multipleFaceCheck`: faceCount=2 → fails
- `frameQualityScore`: all checks pass → score = 1.0
