import { FrameSkipper } from './frameSkipper';
import { AdaptiveFPS } from './adaptiveFPS';
import type { ThermalState } from '../../engine/state/engineState';

export class FrameScheduler {
  readonly skipper: FrameSkipper;
  readonly adaptive: AdaptiveFPS;

  constructor() {
    this.skipper = new FrameSkipper();
    this.adaptive = new AdaptiveFPS();
  }

  onThermalEvent(state: ThermalState): void {
    this.adaptive.onThermalEvent(state);
    this.skipper.setInterval(this.adaptive.getSkipInterval());
  }

  shouldProcessFrame(): boolean {
    return this.skipper.shouldProcess();
  }

  reset(): void {
    this.skipper.reset();
  }
}
