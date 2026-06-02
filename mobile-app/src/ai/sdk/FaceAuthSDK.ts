import { initializeSDK } from './initializeSDK';
import { enrollFace } from './enrollFace';
import { authenticateFace } from './authenticateFace';
import { verifyLiveness } from './verifyLiveness';
import { getRecognitionScore } from './getRecognitionScore';
import type { SDKConfig } from './sdk.types';
import type { EnrollResult, AuthResult, LivenessResult } from '../shared/types/sdk.types';

export class FaceAuthSDK {
  private config: SDKConfig | null = null;
  private initialized = false;

  async initialize(config: SDKConfig): Promise<void> {
    this.config = config;
    await initializeSDK(config);
    this.initialized = true;
  }

  async enroll(framePixels: Float32Array, userId: string): Promise<EnrollResult> {
    this.assertInitialized();
    return enrollFace(framePixels, userId);
  }

  async authenticate(
    framePixels: Float32Array,
    userId: string,
    storedEmbedding: Float32Array,
  ): Promise<AuthResult> {
    this.assertInitialized();
    return authenticateFace(framePixels, userId, storedEmbedding, this.config!);
  }

  async verifyLiveness(framePixels: Float32Array): Promise<LivenessResult> {
    this.assertInitialized();
    return verifyLiveness(framePixels, this.config!.livenessTimeout);
  }

  async getScore(): Promise<number> {
    this.assertInitialized();
    return getRecognitionScore();
  }

  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error('FaceAuthSDK not initialized. Call initialize() first.');
    }
  }
}
