export interface FPSReport {
  averageFPS: number;
  minFPS: number;
  dropCount: number;
  windowSeconds: number;
}

export async function runFPSBenchmark(
  durationSeconds: number = 60,
): Promise<FPSReport> {
  const frameTimes: number[] = [];
  const start = performance.now();
  let dropCount = 0;

  while (performance.now() - start < durationSeconds * 1000) {
    const frameStart = performance.now();
    await new Promise((resolve) => setImmediate(resolve));
    const elapsed = performance.now() - frameStart;
    frameTimes.push(elapsed);
    if (elapsed > 100) dropCount++;
  }

  const totalTime = performance.now() - start;
  const averageFPS = (frameTimes.length / totalTime) * 1000;
  const minFPS = frameTimes.length > 0
    ? 1000 / Math.max(...frameTimes)
    : 0;

  return {
    averageFPS,
    minFPS,
    dropCount,
    windowSeconds: durationSeconds,
  };
}
