import type { Milliseconds, UnixTimestamp } from '../types/common.types';

export function now(): UnixTimestamp {
  return Date.now();
}

export function measureMs(fn: () => void): number {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

export function measureAsyncMs(fn: () => Promise<void>): Promise<number> {
  const start = performance.now();
  return fn().then(() => performance.now() - start);
}

export function formatDuration(ms: number): string {
  return `${Math.round(ms)}ms`;
}
