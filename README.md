# Secure Offline Face Auth SDK

Build a production-ready mobile Edge AI SDK for a React Native application.

## 🎯 Project Goal
Develop an entirely **OFFLINE** facial authentication SDK for Android and iOS that satisfies the following requirements:

- Offline face recognition
- Offline liveness detection
- Offline GPS capture
- Works without internet
- Optimized for mid-range mobile devices
- Authentication time under 1 second
- AI model footprint under 20 MB total
- Android 8+ and iOS 12+
- Minimum device RAM: 3 GB
- React Native compatible
- TensorFlow Lite based
- Lightweight and modular SDK architecture

## 🧠 Model Stack

Use ONLY lightweight models. **Total AI Model Budget: < 15 MB preferred, < 20 MB mandatory.**

1. **Face Detection** (Max 2 MB)
   - MediaPipe BlazeFace
   - Quantized TFLite
2. **Face Landmarks** (Max 5 MB)
   - MediaPipe Face Mesh
   - Quantized TFLite
3. **Face Recognition** (Max 5 MB)
   - MobileFaceNet INT8 Quantized
   - Embedding Size: 128 or 192

> **⚠️ DO NOT USE:** YOLO, ArcFace ResNet, InsightFace Full Models, Transformers, CLIP, DeepFace package, Heavy anti-spoof CNNs, Cloud inference, GPU dependencies.

## 🏗️ SDK Architecture

Fully modular architecture where each module can be replaced independently.

```text
src/ai/
├── sdk/
├── engine/
├── models/
├── modules/
├── optimization/
├── shared/
└── tests/
```

### Modules

1. **Detection Module:** Detect face, track face, crop face, align face, validate face position.
2. **Landmarks Module:** Face mesh extraction, eye landmarks, mouth landmarks, head pose estimation.
3. **Recognition Module:** Generate embeddings, compare embeddings, cosine similarity, threshold management, embedding cache.
4. **Liveness Module:** Blink detection, smile detection, head turn detection, random challenge generation, challenge validation, liveness scoring.
5. **GPS Module:** Offline coordinate capture, geofence validation, GPS spoof detection, coordinate encryption.
6. **Validation Module:** Blur detection, brightness validation, shadow detection, face size validation, multiple face detection.

## ⚡ Performance Optimization

- Frame skipping
- Adaptive FPS
- Async inference
- Lazy model loading
- Model warmup
- Embedding caching
- Tensor reuse
- Memory management
- Thermal protection
- Battery optimization

**Camera Processing Target:**
- **Input Camera:** 1280x720
- **Inference Resolution:** 320x320
- **Process:** Every 3rd frame
- **Target:** Authentication < 1 second

## 🎭 Liveness Strategy

**DO NOT use heavy liveness models. Use FaceMesh landmarks only.**

Implement:
- Eye Aspect Ratio blink detection
- Smile detection
- Head pose estimation

**Random Challenge Engine:** (Examples: Blink, Smile, Turn left, Turn right). Randomize challenge order and generate a liveness score.

## 🔌 Public SDK API

Expose only the following. Frontend must never access internal AI modules.

```typescript
initializeSDK()
enrollFace(frame)
authenticateFace(frame)
verifyLiveness(frame)
captureLocation()
getRecognitionScore()
```

## 🔄 Authentication Flow

`Frame` → `Validation` → `Face Detection` → `Face Alignment` → `Landmark Extraction` → `Liveness Verification` → `Embedding Generation` → `Embedding Comparison` → `Authentication Result`

## 📊 Benchmarking

Provide benchmark utilities for:
- Latency Benchmark
- FPS Benchmark
- Memory Benchmark
- Battery Benchmark
- Device Benchmark
