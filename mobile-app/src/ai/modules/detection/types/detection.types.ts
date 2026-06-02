export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface DetectionResult {
  boundingBox: BoundingBox;
  faceCount: number;
  processingTimeMs: number;
}

export interface AlignedFace {
  pixels: Float32Array;
  shape: [1, 112, 112, 3];
  rollAngle: number;
}
