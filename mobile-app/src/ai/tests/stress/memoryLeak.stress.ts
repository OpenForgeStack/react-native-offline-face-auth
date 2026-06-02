import { runStressBenchmark } from '../../../optimization/benchmarks/stressBenchmark';

async function main(): Promise<void> {
  console.log('Running memory leak stress test (500 frames)...');
  const report = await runStressBenchmark(500);
  console.table(report);
  const passed = !report.leakDetected;
  console.log(`Memory leak test: ${passed ? 'PASS' : 'FAIL'} (delta: ${report.memoryDeltaMB.toFixed(1)}MB)`);
}

main().catch(console.error);
