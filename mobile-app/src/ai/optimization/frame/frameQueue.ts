import type { Frame } from '../../shared/types/frame.types';

export class FrameQueue {
  private pending: Frame | null = null;

  push(frame: Frame): void {
    this.pending = frame;
  }

  pop(): Frame | null {
    const frame = this.pending;
    this.pending = null;
    return frame;
  }

  clear(): void {
    this.pending = null;
  }
}
