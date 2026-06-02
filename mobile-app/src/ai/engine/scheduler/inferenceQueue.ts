type InferenceJob = () => Promise<unknown>;

export class InferenceQueue {
  private queue: InferenceJob[] = [];
  private processing = false;

  enqueue(job: InferenceJob): void {
    this.queue.push(job);
    void this.processNext();
  }

  private async processNext(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    const job = this.queue.shift();
    if (job) {
      try {
        await job();
      } catch {
        // Logged upstream
      }
    }
    this.processing = false;
    void this.processNext();
  }

  clear(): void {
    this.queue = [];
  }

  get length(): number {
    return this.queue.length;
  }
}
