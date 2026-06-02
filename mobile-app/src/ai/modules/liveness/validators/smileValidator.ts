import type { MARResult } from '../types/liveness.types';

export function validateSmile(marResult: MARResult): boolean {
  return marResult.smileDetected;
}
