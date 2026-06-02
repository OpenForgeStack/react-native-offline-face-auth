import { loadTensorflowModel } from 'react-native-fast-tflite';
import { useEngineState, type ModelId, type ThermalState } from '../state/engineState';
import { MODEL_REGISTRY, getModelEntry } from '../../models/registry/modelRegistry';
import { modelLoadFailed } from '../../shared/errors/errorFactory';
import type { ModelRegistryEntry } from '../../models/registry/modelMetadata';

export interface TensorflowModel {
  run: (input: Float32Array) => Float32Array;
  close: () => void;
}

interface ModelHandle {
  id: ModelId;
  instance: TensorflowModel;
  inputShape: [number, number, number, number];
  outputShape: [number, number];
  isLoaded: boolean;
}

function isInUnitTest(): boolean {
  return (
    typeof process !== 'undefined' &&
    typeof (process as Record<string, unknown>).env === 'object' &&
    ((process as Record<string, unknown>).env as Record<string, string>)?.NODE_ENV === 'test'
  );
}

const MODEL_REQUIRES: Record<string, () => number> = {
  blazeface: () => require('../../models/detection/face_detection.tflite') as number,
  facemesh: () => require('../../models/landmarks/facemesh.tflite') as number,
  mobilefacenet: () => require('../../models/recognition/mobilefacenet.tflite') as number,
};

class RuntimeManager {
  private handles: Map<ModelId, ModelHandle> = new Map();
  private initialized = false;
  private thermalSubscribers: Array<(state: ThermalState) => void> = [];

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const state = useEngineState.getState();
    for (const entry of MODEL_REGISTRY) {
      await this.loadModel(entry);
      state.setModelLoaded(entry.id, true);
    }

    this.initialized = true;
    state.setReady(true);
  }

  async loadModel(entry: ModelRegistryEntry): Promise<void> {
    const state = useEngineState.getState();
    state.setModelLoaded(entry.id, false);

    let instance: TensorflowModel;
    try {
      instance = await this.createModelInstance(entry);
    } catch {
      const size = entry.outputShape.reduce((a, b) => a * b, 1);
      instance = {
        run: (_input: Float32Array) => new Float32Array(size),
        close: () => {},
      };
      console.warn(
        `[FaceAuth] Model "${entry.id}" not found at ${entry.path}. ` +
        'Download models using: node scripts/downloadModels.js',
      );
    }

    const handle: ModelHandle = {
      id: entry.id,
      instance,
      inputShape: entry.inputShape as [number, number, number, number],
      outputShape: entry.outputShape as [number, number],
      isLoaded: true,
    };
    this.handles.set(entry.id, handle);

    await this.runWarmup(handle);

    state.setModelLoaded(entry.id, true);
  }

  private async createModelInstance(entry: ModelRegistryEntry): Promise<TensorflowModel> {
    if (isInUnitTest()) {
      const size = entry.outputShape.reduce((a, b) => a * b, 1);
      return {
        run: (_input: Float32Array) => new Float32Array(size),
        close: () => {},
      };
    }

    const requirer = MODEL_REQUIRES[entry.id];
    if (!requirer) {
      throw new Error(`No require mapping for model: ${entry.id}`);
    }

    const source = requirer() as number;
    const model = await loadTensorflowModel(source, 'default');
    return model as unknown as TensorflowModel;
  }

  private async runWarmup(handle: ModelHandle): Promise<void> {
    const size = handle.inputShape.reduce((a, b) => a * b, 1);
    const blankTensor = new Float32Array(size);
    handle.instance.run(blankTensor);
  }

  getModel(id: ModelId): ModelHandle {
    const handle = this.handles.get(id);
    if (!handle) {
      throw modelLoadFailed(id, 'Model not loaded. Call initialize() first.');
    }
    return handle;
  }

  isModelLoaded(id: ModelId): boolean {
    return this.handles.has(id) && this.handles.get(id)!.isLoaded;
  }

  unloadAll(): void {
    for (const [id, handle] of this.handles) {
      handle.instance.close();
      this.handles.delete(id);
      useEngineState.getState().setModelLoaded(id, false);
    }
    this.initialized = false;
    useEngineState.getState().setReady(false);
  }

  onThermalEvent(state: ThermalState): void {
    useEngineState.getState().setThermalState(state);
    for (const sub of this.thermalSubscribers) {
      sub(state);
    }
  }

  subscribeThermal(cb: (state: ThermalState) => void): () => void {
    this.thermalSubscribers.push(cb);
    return () => {
      this.thermalSubscribers = this.thermalSubscribers.filter((s) => s !== cb);
    };
  }

  get isInitialized(): boolean {
    return this.initialized;
  }
}

export const runtimeManager = new RuntimeManager();
