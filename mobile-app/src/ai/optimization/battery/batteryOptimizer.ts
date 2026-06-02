import { thermalProtection } from './thermalProtection';
import { cpuUsageBalancer } from './cpuUsageBalancer';

class BatteryOptimizer {
  private appState: 'active' | 'background' = 'active';

  onAppBackground(): void {
    this.appState = 'background';
  }

  onAppForeground(): void {
    this.appState = 'active';
  }

  isPaused(): boolean {
    return this.appState === 'background';
  }

  getSuggestedSkipInterval(): number {
    if (this.isPaused()) return Infinity;
    if (thermalProtection.state === 'hot') return 10;
    if (thermalProtection.state === 'warm') return 5;
    if (cpuUsageBalancer.shouldThrottle()) return 5;
    return 3;
  }
}

export const batteryOptimizer = new BatteryOptimizer();
