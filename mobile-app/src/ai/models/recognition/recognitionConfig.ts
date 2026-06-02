export const RECOGNITION_CONFIG = {
  modelPath: 'src/ai/models/recognition/mobilefacenet.tflite',
  maxSizeBytes: 5 * 1024 * 1024,
  inputShape: [1, 112, 112, 3] as const,
  embeddingDimension: 128 as 128 | 192,
  similarityThreshold: 0.6,
};
