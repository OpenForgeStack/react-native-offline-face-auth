import { DETECTION_CONFIG } from '../../../models/detection/detectionConfig';

export function countFaces(output: Float32Array): number {
  const threshold = DETECTION_CONFIG.confidenceThreshold;
  const numAnchors = 896;
  let count = 0;

  for (let i = 0; i < numAnchors; i++) {
    const confidence = output[i * 16 + 15]!;
    if (confidence >= threshold) {
      count++;
    }
  }

  return count;
}
