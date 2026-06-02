import type { EARResult } from '../types/liveness.types';

export function validateBlink(
  earResult: EARResult,
  consecutiveFrames: number = 2,
): boolean {
  return earResult.blinkDetected && consecutiveFrames >= 2;
}
