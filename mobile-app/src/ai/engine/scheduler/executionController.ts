export type ExecutionState = 'idle' | 'running' | 'paused';

class ExecutionController {
  private state: ExecutionState = 'idle';

  get currentState(): ExecutionState {
    return this.state;
  }

  start(): void {
    this.state = 'running';
  }

  pause(): void {
    this.state = 'paused';
  }

  resume(): void {
    this.state = 'running';
  }

  idle(): void {
    this.state = 'idle';
  }

  get canExecute(): boolean {
    return this.state === 'running';
  }
}

export const executionController = new ExecutionController();
