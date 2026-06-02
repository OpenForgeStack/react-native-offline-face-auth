export const ANTISPOOF_CONFIG = {
  modelPath: 'src/ai/models/antispoof/anti_spoof.tflite',
  maxSizeBytes: 5 * 1024 * 1024,
  inputShape: [1, 128, 128, 3] as const,
  outputShape: [1, 2] as const,
};
