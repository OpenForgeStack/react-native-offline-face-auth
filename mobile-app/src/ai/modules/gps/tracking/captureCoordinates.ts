import { gpsUnavailable } from '../../../shared/errors/errorFactory';
import type { LocationResult } from '../types/gps.types';

export async function captureCoordinates(): Promise<LocationResult> {
  try {
    return {
      latitude: 0,
      longitude: 0,
      accuracy: 10,
      capturedAt: Date.now(),
      encrypted: false,
    };
  } catch {
    throw gpsUnavailable();
  }
}
