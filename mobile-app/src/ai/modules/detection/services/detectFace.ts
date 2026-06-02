import { runtimeManager } from '../../../engine/runtime/runtimeManager';
import { DETECTION_CONFIG } from '../../../models/detection/detectionConfig';
import { noFaceDetected } from '../../../shared/errors/errorFactory';
import type { BoundingBox, DetectionResult } from '../types/detection.types';
import { preprocessFrame } from '../preprocessing/preprocessFrame';

export function detectFace(framePixels: Float32Array, frameWidth: number, frameHeight: number): DetectionResult {
  const start = performance.now();
  const model = runtimeManager.getModel('blazeface');
  const input = preprocessFrame(framePixels, frameWidth, frameHeight, DETECTION_CONFIG.inputShape.slice(1) as [number, number, number]);
  const output = model.instance.run(input);

  const boxes = parseBlazeFaceOutput(output, DETECTION_CONFIG.confidenceThreshold);

  if (boxes.length === 0) {
    throw noFaceDetected();
  }

  const bestBox = boxes[0]!;
  return {
    boundingBox: bestBox,
    faceCount: boxes.length,
    processingTimeMs: performance.now() - start,
  };
}

function parseBlazeFaceOutput(output: Float32Array, threshold: number): BoundingBox[] {
  const boxes: BoundingBox[] = [];
  const numAnchors = 896;

  for (let i = 0; i < numAnchors; i++) {
    const confidence = output[i * 16 + 15]!;
    if (confidence < threshold) continue;

    const cx = output[i * 16]!;
    const cy = output[i * 16 + 1]!;
    const w = output[i * 16 + 2]!;
    const h = output[i * 16 + 3]!;

    boxes.push({
      x: cx - w / 2,
      y: cy - h / 2,
      width: w,
      height: h,
      confidence,
    });
  }

  return boxes.sort((a, b) => b.confidence - a.confidence);
}
