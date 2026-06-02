import type { BoundingBox } from '../types/detection.types';

interface TrackedFace {
  boundingBox: BoundingBox;
  lastSeen: number;
  stableCount: number;
}

export class FaceTracker {
  private tracked: TrackedFace | null = null;
  private maxDisappeared = 5;
  private iouThreshold = 0.5;

  update(box: BoundingBox): BoundingBox {
    const now = Date.now();
    if (this.tracked && this.computeIoU(this.tracked.boundingBox, box) > this.iouThreshold) {
      this.tracked = { boundingBox: box, lastSeen: now, stableCount: this.tracked.stableCount + 1 };
      return box;
    }
    this.tracked = { boundingBox: box, lastSeen: now, stableCount: 0 };
    return box;
  }

  getStableCount(): number {
    return this.tracked?.stableCount ?? 0;
  }

  hasDisappeared(): boolean {
    if (!this.tracked) return true;
    return Date.now() - this.tracked.lastSeen > this.maxDisappeared * 100;
  }

  reset(): void {
    this.tracked = null;
  }

  private computeIoU(a: BoundingBox, b: BoundingBox): number {
    const xA = Math.max(a.x, b.x);
    const yA = Math.max(a.y, b.y);
    const xB = Math.min(a.x + a.width, b.x + b.width);
    const yB = Math.min(a.y + a.height, b.y + b.height);
    const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return interArea / (areaA + areaB - interArea);
  }
}
