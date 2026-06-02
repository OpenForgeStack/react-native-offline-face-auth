import { runLatencyBenchmark } from '../../../optimization/benchmarks/latencyBenchmark';

async function main(): Promise<void> {
  console.log('Running auth latency benchmark...');
  const report = await runLatencyBenchmark(20);
  console.table(report);
  const passed = report.p95 < 1000;
  console.log(`Auth latency: ${passed ? 'PASS' : 'FAIL'} (p95: ${report.p95.toFixed(1)}ms)`);
}

main().catch(console.error);
