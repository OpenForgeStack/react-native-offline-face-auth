# AGENT.md — Secure Offline Face Auth SDK

> **Read this file before touching any code.**
> This is the single source of truth for every AI coding agent working on this project.

---

## Project Identity

| Field | Value |
|---|---|
| Project | `secure-offline-face-auth` |
| Type | Production React Native Mobile App + Edge AI SDK |
| Goal | Fully offline facial authentication with liveness detection and GPS capture |
| Platform | Android 8+ · iOS 12+ |
| Runtime | TensorFlow Lite (CPU only, quantized models) |
| Auth Target | < 1 second end-to-end |
| Model Budget | < 20 MB total (< 15 MB preferred) |

---

## Tech Stack (Non-Negotiable)

```
Node.js          22 LTS
React Native     Latest stable (Community CLI)
TypeScript       Strict mode
Camera           react-native-vision-camera
Frame Workers    react-native-worklets-core
AI Inference     react-native-fast-tflite
Database         react-native-sqlite-storage
GPS              react-native-geolocation-service
Network          @react-native-community/netinfo
State            zustand
Animation        react-native-reanimated
Backend          Node.js + Docker (dev only)
```

---

## Absolute Prohibitions

Do NOT use, install, import, or reference any of the following — ever:

```
YOLO (any variant)
ArcFace ResNet
InsightFace full models
Transformers / HuggingFace
CLIP
DeepFace package
Heavy anti-spoof CNNs (>5 MB)
Cloud inference of any kind
GPU-specific dependencies
Kubernetes
Microservices inside the SDK
localStorage / sessionStorage
Any network call inside src/ai/
```

If a library is not listed in the Tech Stack above and is not a standard Node/RN utility, **ask before adding it**.

---

## AI Model Stack

| Model | File | Max Size | Purpose |
|---|---|---|---|
| BlazeFace (quantized) | `src/ai/models/detection/face_detection.tflite` | 2 MB | Face detection |
| Face Mesh (quantized) | `src/ai/models/landmarks/facemesh.tflite` | 5 MB | Landmarks + liveness |
| MobileFaceNet INT8 | `src/ai/models/recognition/mobilefacenet.tflite` | 5 MB | Embeddings |

**Total hard limit: 20 MB. Target: ≤ 15 MB.**

All `.tflite` files live exclusively under `src/ai/models/`. Never move them.

---

## Repository Structure

```
secure-offline-face-auth/
├── mobile-app/
│   └── src/
│       ├── ai/                  ← EDGE AI SDK (your domain)
│       │   ├── sdk/             ← PUBLIC API ONLY — the only layer frontend touches
│       │   ├── engine/          ← Pipelines, scheduler, runtime, state
│       │   ├── models/          ← .tflite files + loaders + configs
│       │   ├── modules/         ← Isolated feature modules
│       │   │   ├── detection/
│       │   │   ├── recognition/
│       │   │   ├── liveness/
│       │   │   ├── landmarks/
│       │   │   ├── antispoof/
│       │   │   ├── gps/
│       │   │   └── validation/
│       │   ├── optimization/    ← Frame, inference, memory, battery, benchmarks
│       │   ├── shared/          ← utils, constants, errors, types
│       │   └── tests/
│       ├── camera/              ← Vision Camera bridge + frame processor
│       ├── services/            ← faceAuthService, gpsService, syncService
│       ├── database/            ← SQLite repos (embeddings, attendance, sync queue)
│       ├── sync/                ← Offline-first sync manager
│       ├── screens/             ← FRONTEND TEAM — do not modify
│       ├── components/          ← FRONTEND TEAM — do not modify
│       └── navigation/          ← FRONTEND TEAM — do not modify
├── backend/                     ← Docker-only, Node.js API
└── model-training/              ← Optional fine-tuning, quantization
```

---

## Boundary Rules

### The SDK Public API (`src/ai/sdk/`) is the ONLY surface frontend can call.

```typescript
// ✅ Frontend may only call these:
initializeSDK(config: SDKConfig): Promise<void>
enrollFace(frame: Frame): Promise<EnrollResult>
authenticateFace(frame: Frame): Promise<AuthResult>
verifyLiveness(frame: Frame): Promise<LivenessResult>
captureLocation(): Promise<LocationResult>
getRecognitionScore(): Promise<number>
```

Frontend must **never** import from `src/ai/engine/`, `src/ai/modules/`, or `src/ai/models/` directly.

---

## Authentication Pipeline (Enforce This Order)

```
Frame Input (1280×720, every 3rd frame)
  ↓
[validation] — blur, brightness, shadow, face size, multiple faces
  ↓
[detection]  — BlazeFace → bounding box
  ↓
[alignment]  — rotation + perspective correction
  ↓
[landmarks]  — Face Mesh → 468 landmarks
  ↓
[liveness]   — EAR blink · smile ratio · head pose · random challenge
  ↓
[recognition] — MobileFaceNet → 128/192-dim embedding
  ↓
[comparison] — cosine similarity vs stored embedding
  ↓
AuthResult { success, score, confidence, timestamp }
```

Never reorder these stages. Never skip liveness before recognition.

---

## Liveness Rules

Liveness is **landmark-only** — no separate liveness model.

Implement using Face Mesh output only:

- **Eye Aspect Ratio (EAR)** — blink detection
- **Mouth Aspect Ratio (MAR)** — smile detection
- **Head pose angles** — yaw/pitch from landmarks

Challenge sequencer must randomize from: `blink | smile | turn_left | turn_right`

Each session picks a **new random order**. Never the same sequence twice in a row.

---

## Performance Constraints

| Metric | Requirement |
|---|---|
| Auth time | < 1 000 ms |
| Liveness time | < 1 000 ms |
| Inference resolution | 320 × 320 |
| Frame input | 1280 × 720 |
| Frame strategy | Process every 3rd frame |
| Min device RAM | 3 GB |
| Memory posture | Tensor pooling + explicit release |
| Thermal | Throttle inference if device temp threshold exceeded |

All frame processing runs in a **Vision Camera worklet** (JS thread offloaded). Never block the React Native bridge.

---

## Module Contracts

Each module under `src/ai/modules/` must:

1. Export a single `index.ts` barrel.
2. Own its own `types/` subdirectory — no cross-module type imports.
3. Never import from another module directly — communicate through `engine/pipelines/`.
4. Be independently replaceable without touching other modules.

---

## State Management

Use **zustand** for all SDK runtime state. Four stores:

| Store | File | Owns |
|---|---|---|
| `engineState` | `engine/state/engineState.ts` | model loaded flags, runtime status |
| `authState` | `engine/state/authState.ts` | current auth session, result |
| `sessionState` | `engine/state/sessionState.ts` | liveness challenge progress |
| `cacheState` | `engine/state/cacheState.ts` | embedding cache entries |

Do not use React Context or Redux anywhere in the SDK.

---

## Database Schema (SQLite)

Four repositories, one concern each:

```
embeddingRepository    → userId, embedding (BLOB), enrolledAt
attendanceRepository   → userId, timestamp, locationId, authScore
syncQueueRepository    → recordId, table, payload, status, retryCount
locationRepository     → id, lat, lng, accuracy, capturedAt, encrypted
```

All embedding blobs are stored **encrypted**. Use AES-256 via `securityService`.

---

## Offline-First Sync Rules

1. All writes go to SQLite **first**.
2. `networkMonitor` polls connectivity.
3. When online, `syncManager` drains `syncQueueRepository` via `uploadQueue`.
4. Failed uploads follow `retryPolicy` (exponential backoff, max 5 retries).
5. `purgeManager` removes records older than 30 days after confirmed sync.
6. Backend **never** triggers a write directly — it only receives uploads.

---

## Optimization Checklist

Before any inference call, verify:

- [ ] Frame skip counter checked — only process frame N where `N % 3 === 0`
- [ ] Adaptive FPS engaged — drop to lower FPS if thermal warning
- [ ] Tensors allocated from pool — no `new Float32Array()` in hot path
- [ ] Model warm-up completed at SDK init — no cold-start penalty during auth
- [ ] Embedding cache checked before running recognition inference
- [ ] Memory released after pipeline completion (`memoryManager.release()`)

---

## Error Handling Standards

All SDK errors must be typed and thrown as `SDKError`:

```typescript
// src/ai/shared/errors/
class SDKError extends Error {
  code: SDKErrorCode;    // enum — never raw strings
  module: SDKModule;     // which module threw
  recoverable: boolean;  // can the session retry?
}
```

Error codes live in `src/ai/shared/constants/errorCodes.ts`. Never use magic strings.

---

## TypeScript Rules

```jsonc
// tsconfig.json (enforced)
{
  "strict": true,
  "noImplicitAny": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

- No `any` types in SDK code. Use `unknown` + type guards.
- All public SDK functions must have explicit return types.
- All TFLite tensor shapes must be typed with literal tuple types, e.g. `[1, 320, 320, 3]`.

---

## Testing Requirements

```
src/ai/tests/
├── unit/          → Pure function tests (similarity, EAR, validators) — no device needed
├── integration/   → Pipeline tests with mock frames
├── performance/   → Latency + FPS benchmarks — must run on physical device
└── stress/        → Memory leak tests over 500 consecutive frames
```

Every module must have at minimum:
- Unit tests for all validators and scoring functions
- Integration test for its pipeline stage with a known-good mock frame

---

## Benchmark Utilities

Located at `src/ai/optimization/benchmarks/`. Must expose:

```typescript
runLatencyBenchmark(): Promise<LatencyReport>    // per-stage timing
runFPSBenchmark(): Promise<FPSReport>            // sustained frames/sec
runBatteryBenchmark(): Promise<BatteryReport>    // mAh per 100 auths
runStressBenchmark(): Promise<StressReport>      // memory over time
```

These run on-device only. Never call benchmarks in production auth flow.

---

## 7-Day MVP Milestones

| Day | Deliverable | Done When |
|---|---|---|
| 1 | Environment setup | `node -v`, emulator boots, RN project runs |
| 2 | Vision Camera integration | Live camera preview renders |
| 3 | Frame processing worklet | Raw frames logged at 30 FPS |
| 4 | Face detection | BlazeFace bounding box drawn on preview |
| 5 | Embedding generation | MobileFaceNet returns 128-dim vector |
| 6 | Authentication pipeline | `authenticateFace()` returns score vs enrolled embedding |
| 7 | Liveness detection | Blink challenge passes/fails correctly |

**MVP success criterion:** `authenticateFace()` returns a correct accept/reject decision offline, in under 1 second, on a physical Android device.

---

## Agent Task Protocol

When assigned a task, follow this sequence without exception:

1. **Read** the relevant module's `types/` and `AGENT.md` before writing any code.
2. **Check** the prohibition list — if your solution needs anything on it, stop and ask.
3. **Write types first** — define interfaces in `types/` before implementing.
4. **Implement** the function/module.
5. **Write tests** in `src/ai/tests/unit/` alongside implementation.
6. **Verify** the module boundary — no cross-module direct imports introduced.
7. **Run** `tsc --noEmit` — zero TypeScript errors before marking done.

---

## Contact & Ownership

| Domain | Owner |
|---|---|
| `src/ai/` | AI SDK Team |
| `src/screens/` `src/components/` `src/navigation/` | Frontend Team |
| `backend/` | Backend Team |
| `model-training/` | ML Team |

Do not modify files outside your domain without explicit approval from the owning team.

---

*Last updated: auto-generated from project spec*
