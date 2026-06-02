import { useEngineState, type ThermalState } from '../../engine/state/engineState';

class ThermalProtection {
  private currentState: ThermalState = 'normal';

  get state(): ThermalState {
    return this.currentState;
  }

  setState(state: ThermalState): void {
    if (this.currentState !== state) {
      this.currentState = state;
      useEngineState.getState().setThermalState(state);
    }
  }

  transitionNormal(): void {
    this.setState('normal');
  }

  transitionWarm(): void {
    this.setState('warm');
  }

  transitionHot(): void {
    this.setState('hot');
  }
}

export const thermalProtection = new ThermalProtection();
