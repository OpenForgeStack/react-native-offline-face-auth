import type { ThermalState } from '../state/engineState';
import { runtimeManager } from './runtimeManager';

class ThermalMonitor {
  private currentState: ThermalState = 'normal';

  get state(): ThermalState {
    return this.currentState;
  }

  setState(state: ThermalState): void {
    if (this.currentState !== state) {
      this.currentState = state;
      runtimeManager.onThermalEvent(state);
    }
  }
}

export const thermalMonitor = new ThermalMonitor();
