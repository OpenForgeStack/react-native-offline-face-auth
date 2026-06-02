# TASK: Anti-Spoof Module

**Directory:** `src/ai/modules/antispoof/`
**Layer:** MODULES
**MVP Day:** Post-MVP (Day 7+ stretch)
**Depends on:** antiSpoofLoader (optional), detectionModule output, textureAnalysis

---

## Objective

Detect presentation attacks (printed photos, replay video, 3D masks). Primary method is texture analysis using detection module output — no separate heavy model in MVP. Optional lightweight TFLite model is additive.

---

## Files to Implement

```
modules/antispoof/
├── replay/
│   ├── replayDetector.ts      ← Screen moire pattern detection
│   └── flickerAnalysis.ts     ← Temporal consistency across frames
├── texture/
│   ├── textureAnalyzer.ts     ← LBP-based texture liveness
│   └── lbpFeatures.ts         ← Local Binary Pattern features
├── integrity/
│   ├── frameIntegrity.ts      ← Checks for compression artifacts
│   └── depthEstimator.ts      ← Depth cues from face geometry
└── types/
    └── antispoof.types.ts
```

---

## Types to Define First

```typescript
interface AntiSpoofResult {
  isLive: boolean;
  confidence: number;
  attackType?: 'photo' | 'video_replay' | 'mask';
  processingTimeMs: number;
}
```

---

## MVP Constraint

Anti-spoof model (`anti_spoof.tflite`) must be ≤ 5 MB. If no model is available, fall back to texture analysis only. The system must still function without this module — it is additive to liveness, not a replacement.

---

## Acceptance Criteria

- [ ] Falls back gracefully if model not loaded
- [ ] Texture analysis runs in < 30 ms
- [ ] Model size enforced at ≤ 5 MB if used
- [ ] Exports only through `index.ts`
- [ ] No dependency on liveness or recognition modules

---

## Tests Required

`src/ai/tests/unit/modules/antispoof/`

- `textureAnalyzer`: flat-color cropped face → low liveness score
- `replayDetector`: temporal consistency check with identical frames → replay flagged
- `frameIntegrity`: heavy JPEG compressed frame → artifact score high
