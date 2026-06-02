export interface BatteryReport {
  estimatedMAhPer100Auths: number;
  averageAuthTimeMs: number;
  totalAuths: number;
}

export async function runBatteryBenchmark(
  authCount: number = 100,
): Promise<BatteryReport> {
  const times: number[] = [];

  for (let i = 0; i < authCount; i++) {
    const start = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 50));
    times.push(performance.now() - start);
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const estimatedMAh = avgTime * 0.5 * (authCount / 100);

  return {
    estimatedMAhPer100Auths: estimatedMAh,
    averageAuthTimeMs: avgTime,
    totalAuths: authCount,
  };
}
