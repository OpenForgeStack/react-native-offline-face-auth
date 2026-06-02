export const DETECTION_CONFIG = {
  modelPath: 'src/ai/models/detection/face_detection.tflite',
  maxSizeBytes: 2 * 1024 * 1024,
  inputShape: [1, 128, 128, 3] as const,
  confidenceThreshold: 0.7,
  iouThreshold: 0.3,
};
