import type { LocationResult } from '../types/gps.types';

export function formatLocation(
  latitude: number,
  longitude: number,
  accuracy: number,
): LocationResult {
  return {
    latitude,
    longitude,
    accuracy,
    capturedAt: Date.now(),
    encrypted: false,
  };
}
