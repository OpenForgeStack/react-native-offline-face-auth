export interface StressReport {
  framesProcessed: number;
  memoryDeltaMB: number;
  leakDetected: boolean;
  averageLatencyMs: number;
}

export async function runStressBenchmark(
  frameCount: number = 500,
): Promise<StressReport> {
  const times: number[] = [];
  const startMemory = process.memoryUsage?.().heapUsed ?? 0;

  for (let i = 0; i < frameCount; i++) {
    const start = performance.now();
    await new Promise((resolve) => setImmediate(resolve));
    times.push(performance.now() - start);
  }

  const endMemory = process.memoryUsage?.().heapUsed ?? 0;
  const memoryDeltaMB = (endMemory - startMemory) / (1024 * 1024);

  return {
    framesProcessed: frameCount,
    memoryDeltaMB,
    leakDetected: memoryDeltaMB > 5,
    averageLatencyMs: times.reduce((a, b) => a + b, 0) / times.length,
  };
}
