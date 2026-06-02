import type { SDKConfig } from '../shared/types/sdk.types';
import { modelLoadFailed } from '../shared/errors/errorFactory';

export const DEFAULT_SDK_CONFIG: SDKConfig = {
  modelBasePath: 'src/ai/models/',
  embeddingDimension: 128,
  livenessTimeout: 10000,
  authThreshold: 0.6,
  enableBenchmarking: false,
};

export function validateConfig(config: SDKConfig): void {
  if (!config.modelBasePath || typeof config.modelBasePath !== 'string') {
    throw modelLoadFailed('config', 'modelBasePath is required');
  }
  if (config.embeddingDimension !== 128 && config.embeddingDimension !== 192) {
    throw modelLoadFailed('config', 'embeddingDimension must be 128 or 192');
  }
  if (config.livenessTimeout < 1000) {
    throw modelLoadFailed('config', 'livenessTimeout must be >= 1000ms');
  }
  if (config.authThreshold < 0 || config.authThreshold > 1) {
    throw modelLoadFailed('config', 'authThreshold must be between 0 and 1');
  }
}
