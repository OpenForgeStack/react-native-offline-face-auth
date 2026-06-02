export class AsyncTaskManager {
  private pending: Array<() => Promise<void>> = [];

  enqueue(task: () => Promise<void>): void {
    this.pending.push(task);
  }

  async drain(): Promise<void> {
    while (this.pending.length > 0) {
      const task = this.pending.shift();
      if (task) await task();
    }
  }

  clear(): void {
    this.pending = [];
  }
}
