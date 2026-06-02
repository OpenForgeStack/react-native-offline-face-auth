import type { Milliseconds } from './common.types';

export type PipelineStage =
  | 'validation'
  | 'detection'
  | 'alignment'
  | 'landmarks'
  | 'liveness'
  | 'recognition'
  | 'comparison';

export interface StageResult<T> {
  stage: PipelineStage;
  data: T;
  durationMs: Milliseconds;
}
