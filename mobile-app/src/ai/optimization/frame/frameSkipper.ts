export class FrameSkipper {
  private counter = 0;
  private interval = 3;

  setInterval(n: number): void {
    this.interval = n;
  }

  shouldProcess(): boolean {
    this.counter++;
    return this.counter % this.interval === 0;
  }

  reset(): void {
    this.counter = 0;
  }
}
