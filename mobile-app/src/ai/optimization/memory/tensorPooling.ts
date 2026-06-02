export class TensorPool {
  private pools: Map<string, Float32Array[]> = new Map();
  private checkedOut: Set<Float32Array> = new Set();

  registerShape(shape: number[], count: number = 3): void {
    const key = shape.join('x');
    if (this.pools.has(key)) return;
    const buffers: Float32Array[] = [];
    const size = shape.reduce((a, b) => a * b, 1);
    for (let i = 0; i < count; i++) {
      buffers.push(new Float32Array(size));
    }
    this.pools.set(key, buffers);
  }

  checkout(shape: number[]): Float32Array {
    const key = shape.join('x');
    const pool = this.pools.get(key);
    if (!pool || pool.length === 0) {
      const size = shape.reduce((a, b) => a * b, 1);
      const buf = new Float32Array(size);
      this.checkedOut.add(buf);
      return buf;
    }
    const buf = pool.pop()!;
    this.checkedOut.add(buf);
    return buf;
  }

  return(buf: Float32Array): void {
    if (!this.checkedOut.has(buf)) return;
    this.checkedOut.delete(buf);
    buf.fill(0);
    const shape = this.inferShape(buf);
    const key = shape.join('x');
    let pool = this.pools.get(key);
    if (!pool) {
      pool = [];
      this.pools.set(key, pool);
    }
    pool.push(buf);
  }

  returnAll(): void {
    for (const buf of this.checkedOut) {
      buf.fill(0);
      const shape = this.inferShape(buf);
      const key = shape.join('x');
      let pool = this.pools.get(key);
      if (!pool) {
        pool = [];
        this.pools.set(key, pool);
      }
      pool.push(buf);
    }
    this.checkedOut.clear();
  }

  private inferShape(_buf: Float32Array): number[] {
    return [1, 128, 128, 3];
  }
}

export const tensorPool = new TensorPool();
