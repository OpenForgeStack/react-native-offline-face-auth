# TASK: Landmarks Module

**Directory:** `src/ai/modules/landmarks/`
**Layer:** MODULES
**MVP Day:** Day 4–5
**Depends on:** landmarksLoader, runtimeManager

---

## Objective

Run Face Mesh inference on an aligned face crop and return the 468 3D landmark coordinates. This module's output is consumed by both the liveness module and head pose estimation.

---

## Files to Implement

```
modules/landmarks/
├── extraction/
│   ├── extractLandmarks.ts     ← Main entry: runs FaceMesh inference
│   └── normalizeLandmarks.ts   ← Scale landmark coords to frame space
├── facial/
│   ├── eyeLandmarks.ts         ← Extract eye region points from 468
│   └── mouthLandmarks.ts       ← Extract mouth region points
├── pose/
│   ├── headPoseEstimator.ts    ← Yaw, pitch, roll from landmarks
│   └── poseAngles.ts           ← Trig math for angle computation
└── types/
    └── landmarks.types.ts
```

---

## Types to Define First

```typescript
interface Landmark {
  x: number; y: number; z: number;
}

interface LandmarkResult {
  landmarks: Landmark[];        // length: 468
  eyeLandmarks: EyeLandmarks;
  mouthLandmarks: MouthLandmarks;
  headPose: HeadPose;
  processingTimeMs: number;
}

interface EyeLandmarks {
  leftEye: Landmark[];   // relevant indices from LANDMARK_INDICES
  rightEye: Landmark[];
}

interface MouthLandmarks {
  upper: Landmark[];
  lower: Landmark[];
  leftCorner: Landmark;
  rightCorner: Landmark;
}

interface HeadPose {
  yaw: number;    // degrees, negative = left
  pitch: number;  // degrees, negative = down
  roll: number;   // degrees
}
```

---

## Key Implementation Notes

**extractLandmarks**: input is `AlignedFace` (112×112×3). Resize to FaceMesh input 192×192. Run inference. Parse output tensor `[1, 468, 3]`.

**headPoseEstimator**: use 6 stable landmarks (nose tip, chin, corners of eyes, corners of mouth) and a simplified PnP-like estimation. No OpenCV — pure math using the landmark positions.

---

## Acceptance Criteria

- [ ] Returns exactly 468 landmarks
- [ ] `extractLandmarks` input is `AlignedFace` — no raw frames
- [ ] Head pose angles are in degrees, finite, and within ±90
- [ ] Exports only through `index.ts`
- [ ] No imports from `detection/`, `recognition/`, or `liveness/`

---

## Tests Required

`src/ai/tests/unit/modules/landmarks/`

- `extractLandmarks`: output array length === 468
- `headPoseEstimator`: frontal face → yaw near 0°, pitch near 0°
- `eyeLandmarks`: returns correct indices from landmark array
- `mouthLandmarks`: left and right corner landmarks are distinct
