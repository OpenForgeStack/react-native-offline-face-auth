import { runAuthenticationPipeline } from '../../engine/pipelines/authenticationPipeline';
import type { PipelineStage } from '../../shared/types/pipeline.types';
import type { Milliseconds } from '../../shared/types/common.types';

export interface LatencyReport {
  stageTimings: Record<PipelineStage, number>;
  p50: number;
  p95: number;
  p99: number;
  totalMs: number;
}

export async function runLatencyBenchmark(
  iterations: number = 20,
): Promise<LatencyReport> {
  const allDurations: number[] = [];
  const stageAccumulators: Partial<Record<PipelineStage, number[]>> = {};

  for (let i = 0; i < iterations; i++) {
    const mockFrame = new Float32Array(1280 * 720 * 3) as any;
    const result = await runAuthenticationPipeline(
      mockFrame,
      'benchmark-user',
      new Float32Array(128),
      { authThreshold: 0.6, enableBenchmarking: true, livenessTimeout: 10000 },
    );
    allDurations.push(result.authResult.durationMs);

    for (const [stage, duration] of Object.entries(result.stageDurations)) {
      if (!stageAccumulators[stage as PipelineStage]) {
        stageAccumulators[stage as PipelineStage] = [];
      }
      stageAccumulators[stage as PipelineStage]!.push(duration);
    }
  }

  allDurations.sort((a, b) => a - b);
  const p50 = percentile(allDurations, 50);
  const p95 = percentile(allDurations, 95);
  const p99 = percentile(allDurations, 99);

  const stageTimings = {} as Record<PipelineStage, number>;
  for (const [stage, durations] of Object.entries(stageAccumulators)) {
    stageTimings[stage as PipelineStage] =
      durations!.reduce((a, b) => a + b, 0) / durations!.length;
  }

  const totalMs = allDurations.reduce((a, b) => a + b, 0) / allDurations.length;

  return { stageTimings, p50, p95, p99, totalMs };
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)]!;
}
