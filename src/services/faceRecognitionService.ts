import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { Asset } from 'expo-asset';
import * as ort from 'onnxruntime-react-native';

const modelPath = '../models/arcfaceresnet100-11-int8.onnx';

class FaceRecognitionService {
  private modelSession: ort.InferenceSession | null = null;
  private isModelLoading = false;

  private readonly INPUT_SIZE = 112;

  /**
   * Load the ArcFace ONNX model and cache it
   */
  async loadModel(): Promise<ort.InferenceSession | null> {
    // If model is already loaded, return it
    if (this.modelSession) {
      return this.modelSession;
    }

    // If model is currently loading, wait for it
    if (this.isModelLoading) {
      while (this.isModelLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.modelSession;
    }

    try {
      this.isModelLoading = true;
      console.log('Loading ArcFace ONNX model...');

      const modelOnnx = await Asset.fromModule(require(modelPath));
      await modelOnnx.downloadAsync();

      console.log('Model asset downloaded, creating ONNX session...');
      console.log('Model URI:', modelOnnx.localUri);

      const session = await ort.InferenceSession.create(modelOnnx.localUri!, {
        executionProviders: ['cpu'],
      });

      console.log('ArcFace ONNX model loaded successfully');
      console.log('Model input names:', session.inputNames);
      console.log('Model output names:', session.outputNames);

      this.modelSession = session;
      return session;
    } catch (error) {
      console.error('Error loading ArcFace ONNX model:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    } finally {
      this.isModelLoading = false;
    }
  }

  /**
   * L2 normalize a vector (make it unit length)
   */
  l2Normalize(vec: number[]): number[] {
    const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) {
      return vec;
    }
    return vec.map(v => v / norm);
  }

  /**
   * Calculate cosine similarity between two embeddings
   *
   * This implementation matches the web calculateCosineSimilarity exactly:
   * ```javascript
   * const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
   * const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
   * const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
   * return dot / (normA * normB);
   * ```
   */
  calculateCosineSimilarity(a: number[] | Float32Array, b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same length');
    }

    // Exactly matching web implementation with reduce()
    const dot = Array.from(a).reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(Array.from(a).reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dot / (normA * normB);
  }

  async generateFaceEmbedding(base64: string, options?: { normalize?: boolean }): Promise<number[] | null> {
    try {
      const session = await this.loadModel();
      if (!session) {
        console.error('ArcFace ONNX model not loaded');
        return null;
      }

      const imageBuffer = Buffer.from(base64, 'base64');
      const { rgbPixels } = tf.tidy(() => {
        const decoded = decodeJpeg(imageBuffer);
        const resized = decoded.resizeBilinear([this.INPUT_SIZE, this.INPUT_SIZE]);
        const data = resized.dataSync();
        return { rgbPixels: Array.from(data) };
      });

      const pixelCount = this.INPUT_SIZE * this.INPUT_SIZE;
      const input = new Float32Array(3 * pixelCount);
      for (let i = 0; i < pixelCount; i++) {
        input[i] = (rgbPixels[i * 3] / 255.0 - 0.5) / 0.5;
        input[i + pixelCount] = (rgbPixels[i * 3 + 1] / 255.0 - 0.5) / 0.5;
        input[i + 2 * pixelCount] = (rgbPixels[i * 3 + 2] / 255.0 - 0.5) / 0.5;
      }

      const tensor = new ort.Tensor('float32', input, [1, 3, this.INPUT_SIZE, this.INPUT_SIZE]);
      const output = await session.run({ [session.inputNames[0]]: tensor });
      const raw = output[session.outputNames[0]].data as Float32Array;

      const norm = Math.sqrt(Array.from(raw).reduce((sum, x) => sum + x * x, 0));
      if (norm === 0) return Array.from(raw);
      const normalized = Array.from(raw).map(x => x / norm);

      return normalized;
    } catch (error) {
      console.error('Error generating face embedding:', error);
      return null;
    }
  }

  /**
   * Compare two face embeddings (already normalized) - matches web usage
   * Use this when comparing with web-generated embeddings that are already L2 normalized
   */
  compareEmbeddingsRaw(
    embedding1: number[] | Float32Array,
    embedding2: number[]
  ): {
    similarity: number;
    distance: number;
    isMatch: boolean;
    confidence: number;
  } {
    // Direct comparison without re-normalization (web embeddings are already normalized)
    const similarity = this.calculateCosineSimilarity(embedding1, embedding2);
    const distance = 1 - similarity;

    const threshold = 0.45;
    const isMatch = similarity >= threshold;
    const confidence = Math.round(similarity * 100);

    console.log(`🎯 RAW EMBEDDING COMPARISON: ${isMatch ? 'MATCH' : 'NO MATCH'}`);
    console.log(`📊 Cosine Similarity: ${similarity.toFixed(6)} (${confidence}%)`);
    console.log(`📏 Cosine Distance: ${distance.toFixed(6)}`);
    console.log(`🎚️ Threshold: ${threshold} (similarity must be >= ${threshold})`);

    return {
      similarity,
      distance,
      isMatch,
      confidence,
    };
  }

  /**
   * Compare two face embeddings and return similarity metrics
   * This method ensures normalization for backwards compatibility
   */
  compareFaces(
    embedding1: number[],
    embedding2: number[]
  ): {
    similarity: number;
    distance: number;
    isMatch: boolean;
    confidence: number;
  } {
    // Ensure both embeddings are normalized for consistent comparison
    const normalized1 = this.l2Normalize(embedding1);
    const normalized2 = this.l2Normalize(embedding2);

    // Use the raw comparison method
    return this.compareEmbeddingsRaw(normalized1, normalized2);
  }

  /**
   * Get model info if loaded
   */
  getModelInfo(): { inputNames: string[]; outputNames: string[] } | null {
    if (!this.modelSession) {
      return null;
    }
    return {
      inputNames: [...this.modelSession.inputNames],
      outputNames: [...this.modelSession.outputNames],
    };
  }

  /**
   * Check if model is loaded
   */
  isModelLoaded(): boolean {
    return this.modelSession !== null;
  }

  /**
   * Clear the model from memory (useful for testing or memory management)
   */
  clearModel(): void {
    if (this.modelSession) {
      console.log('Clearing ArcFace model from memory...');
      this.modelSession = null;
    }
  }
}

// Export a singleton instance
export const faceRecognitionService = new FaceRecognitionService();
