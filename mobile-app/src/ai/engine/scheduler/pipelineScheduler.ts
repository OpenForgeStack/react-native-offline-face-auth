import { useEngineState } from '../state/engineState';
import type { Frame } from '../../shared/types/frame.types';
import { sdkLog } from '../../shared/utils/logger';

export type PipelineTaskType = 'auth' | 'liveness' | 'enrollment';

export interface PipelineTask {
  type: PipelineTaskType;
  frame: Frame;
  userId?: string;
  priority: number;
}

type PipelineFn = (frame: Frame, userId?: string) => Promise<unknown>;

class PipelineScheduler {
  private busy = false;
  private pipelineMap: Map<PipelineTaskType, PipelineFn> = new Map();
  private frameCount = 0;

  registerPipeline(type: PipelineTaskType, fn: PipelineFn): void {
    this.pipelineMap.set(type, fn);
  }

  async schedule(task: PipelineTask): Promise<unknown> {
    if (this.busy) {
      sdkLog('SCHEDULER', `Dropping ${task.type} task — pipeline busy`);
      return;
    }

    this.frameCount++;
    if (this.frameCount % 3 !== 0) {
      return;
    }

    const fn = this.pipelineMap.get(task.type);
    if (!fn) {
      throw new Error(`No pipeline registered for type: ${task.type}`);
    }

    const state = useEngineState.getState();
    state.setPipelineRunning(true);

    try {
      return await fn(task.frame, task.userId);
    } finally {
      state.setPipelineRunning(false);
      this.busy = false;
    }
  }

  resetFrameCount(): void {
    this.frameCount = 0;
  }
}

export const pipelineScheduler = new PipelineScheduler();
