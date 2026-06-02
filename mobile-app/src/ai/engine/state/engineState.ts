import { create } from 'zustand';

export type ModelId = 'blazeface' | 'facemesh' | 'mobilefacenet' | 'antispoof';
export type ThermalState = 'normal' | 'warm' | 'hot';

interface EngineState {
  isReady: boolean;
  isPipelineRunning: boolean;
  modelsLoaded: Record<ModelId, boolean>;
  warmupTimeMs: number;
  thermalState: ThermalState;
  setReady: (ready: boolean) => void;
  setPipelineRunning: (running: boolean) => void;
  setThermalState: (state: ThermalState) => void;
  setModelLoaded: (id: ModelId, loaded: boolean) => void;
  setWarmupTimeMs: (ms: number) => void;
  reset: () => void;
}

const initialState = {
  isReady: false,
  isPipelineRunning: false,
  modelsLoaded: {
    blazeface: false,
    facemesh: false,
    mobilefacenet: false,
    antispoof: false,
  } as Record<ModelId, boolean>,
  warmupTimeMs: 0,
  thermalState: 'normal' as ThermalState,
};

export const useEngineState = create<EngineState>()((set) => ({
  ...initialState,
  setReady: (ready: boolean) => set({ isReady: ready }),
  setPipelineRunning: (running: boolean) => set({ isPipelineRunning: running }),
  setThermalState: (state: ThermalState) => set({ thermalState: state }),
  setModelLoaded: (id: ModelId, loaded: boolean) =>
    set((state) => ({
      modelsLoaded: { ...state.modelsLoaded, [id]: loaded },
    })),
  setWarmupTimeMs: (ms: number) => set({ warmupTimeMs: ms }),
  reset: () => set(initialState),
}));
