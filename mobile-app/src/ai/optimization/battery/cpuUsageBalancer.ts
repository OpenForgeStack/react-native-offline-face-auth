class CpuUsageBalancer {
  private inferenceTimes: number[] = [];
  private maxSamples = 30;
  private throttleThreshold = 300;

  recordInferenceTime(ms: number): void {
    this.inferenceTimes.push(ms);
    if (this.inferenceTimes.length > this.maxSamples) {
      this.inferenceTimes.shift();
    }
  }

  getRollingAverage(): number {
    if (this.inferenceTimes.length === 0) return 0;
    const sum = this.inferenceTimes.reduce((a, b) => a + b, 0);
    return sum / this.inferenceTimes.length;
  }

  shouldThrottle(): boolean {
    return this.getRollingAverage() > this.throttleThreshold;
  }

  reset(): void {
    this.inferenceTimes = [];
  }
}

export const cpuUsageBalancer = new CpuUsageBalancer();
