import type { ThermalState } from '../../engine/state/engineState';

export class AdaptiveFPS {
  private currentSkipInterval = 3;
  private thermalState: ThermalState = 'normal';

  onThermalEvent(state: ThermalState): void {
    this.thermalState = state;
    switch (state) {
      case 'normal':
        this.currentSkipInterval = 3;
        break;
      case 'warm':
        this.currentSkipInterval = 5;
        break;
      case 'hot':
        this.currentSkipInterval = 10;
        break;
    }
  }

  getSkipInterval(): number {
    return this.currentSkipInterval;
  }
}
