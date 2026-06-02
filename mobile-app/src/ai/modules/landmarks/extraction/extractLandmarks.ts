import { runtimeManager } from '../../../engine/runtime/runtimeManager';
import { LANDMARKS_CONFIG } from '../../../models/landmarks/landmarksConfig';
import { resizeFrame } from '../../detection/preprocessing/resizeFrame';
import { normalizeFrame } from '../../detection/preprocessing/normalizeFrame';
import type { Landmark, LandmarkResult, EyeLandmarks, MouthLandmarks, HeadPose } from '../types/landmarks.types';
import { LANDMARK_INDICES } from '../../../models/landmarks/landmarksConfig';
import { estimateHeadPose } from '../pose/poseAngles';

export function extractLandmarks(
  alignedFacePixels: Float32Array,
  alignedFaceShape: [number, number, number, number],
): LandmarkResult {
  const start = performance.now();
  const model = runtimeManager.getModel('facemesh');
  const [, faceH, faceW] = alignedFaceShape;

  const resized = resizeFrame(
    alignedFacePixels,
    faceW,
    faceH,
    LANDMARKS_CONFIG.inputShape[2],
    LANDMARKS_CONFIG.inputShape[1],
  );
  const normalized = normalizeFrame(resized, [0, 1]);
  const output = model.instance.run(normalized);

  const landmarks: Landmark[] = [];
  for (let i = 0; i < 468; i++) {
    landmarks.push({
      x: output[i * 3]!,
      y: output[i * 3 + 1]!,
      z: output[i * 3 + 2]!,
    });
  }

  const eyeLandmarks = extractEyeLandmarks(landmarks);
  const mouthLandmarks = extractMouthLandmarks(landmarks);
  const headPose = estimateHeadPose(landmarks);

  return {
    landmarks,
    eyeLandmarks,
    mouthLandmarks,
    headPose,
    processingTimeMs: performance.now() - start,
  };
}

function extractEyeLandmarks(landmarks: Landmark[]): EyeLandmarks {
  const idx = LANDMARK_INDICES;
  return {
    leftEye: [
      landmarks[idx.leftEyeLeft]!,
      landmarks[idx.leftEyeTopOuter]!,
      landmarks[idx.leftEyeTopInner]!,
      landmarks[idx.leftEyeRight]!,
      landmarks[idx.leftEyeBottomInner]!,
      landmarks[idx.leftEyeBottomOuter]!,
    ],
    rightEye: [
      landmarks[idx.rightEyeLeft]!,
      landmarks[idx.rightEyeTopOuter]!,
      landmarks[idx.rightEyeTopInner]!,
      landmarks[idx.rightEyeRight]!,
      landmarks[idx.rightEyeBottomInner]!,
      landmarks[idx.rightEyeBottomOuter]!,
    ],
  };
}

function extractMouthLandmarks(landmarks: Landmark[]): MouthLandmarks {
  const idx = LANDMARK_INDICES;
  return {
    upper: [landmarks[idx.mouthTop]!],
    lower: [landmarks[idx.mouthBottom]!],
    leftCorner: landmarks[idx.mouthLeft]!,
    rightCorner: landmarks[idx.mouthRight]!,
  };
}
