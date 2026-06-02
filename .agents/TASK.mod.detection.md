# TASK: Detection Module

**Directory:** `src/ai/modules/detection/`
**Layer:** MODULES
**MVP Day:** Day 4
**Depends on:** detectionLoader, runtimeManager, shared/errors

---

## Objective

Implement the full detection module: face detection, cropping, alignment, and position validation. This module owns the BlazeFace inference path and all preprocessing needed before downstream modules run.

---

## Files to Implement

```
modules/detection/
├── services/
│   ├── detectFace.ts          ← BlazeFace inference → BoundingBox
│   ├── trackFace.ts           ← Inter-frame face tracking
│   └── detectMultipleFaces.ts ← Returns count > 1 for validation
├── preprocessing/
│   ├── preprocessFrame.ts     ← Full preprocessing chain
│   ├── resizeFrame.ts         ← 1280×720 → 320×320 → model input size
│   ├── normalizeFrame.ts      ← Pixel values to [0, 1] or [-1, 1]
│   └── cropFace.ts            ← Crop bounding box with padding
├── alignment/
│   ├── faceAlignment.ts       ← Entry: alignment orchestrator
│   ├── rotationCorrection.ts  ← Roll angle → affine transform
│   └── perspectiveCorrection.ts
├── validators/
│   ├── facePresenceValidator.ts  ← Is there a face at all?
│   ├── faceSizeValidator.ts      ← Face too small/too close?
│   └── faceAngleValidator.ts     ← Excessive roll/pitch?
└── types/
    └── detection.types.ts
```

---

## Types to Define First (`detection.types.ts`)

```typescript
interface BoundingBox {
  x: number; y: number;
  width: number; height: number;
  confidence: number;
}

interface DetectionResult {
  boundingBox: BoundingBox;
  faceCount: number;
  processingTimeMs: number;
}

interface AlignedFace {
  pixels: Float32Array;       // 112×112×3 normalized
  shape: [1, 112, 112, 3];
  rollAngle: number;
}
```

---

## Key Implementation Notes

**preprocessFrame**: resize 1280×720 → 128×128 for BlazeFace; use bilinear interpolation. Normalize to `[0, 1]`.

**cropFace**: add 20% padding around bounding box before crop; clamp to frame boundaries.

**rotationCorrection**: use 2D affine transform to deskew based on eye landmark roll angle (pass eye coords from upstream if available, else skip).

**faceSizeValidator**: face bounding box must be at least 15% of frame width.

---

## Acceptance Criteria

- [ ] `detectFace` returns `DetectionResult` with confidence > `detectionConfig.confidenceThreshold`
- [ ] `detectMultipleFaces` returns `faceCount` — validation module uses this
- [ ] All preprocessing stays within the module — no raw frames escape to other modules
- [ ] Exports only through `index.ts` barrel
- [ ] No imports from `recognition/`, `liveness/`, or `landmarks/`

---

## Tests Required

`src/ai/tests/unit/modules/detection/`

- `detectFace`: returns bounding box on mock frame with face
- `preprocessFrame`: output shape must be `[1, 128, 128, 3]`
- `normalizeFrame`: all values in `[0, 1]`
- `faceSizeValidator`: rejects face < 15% frame width
- `faceAngleValidator`: rejects roll > 30°
