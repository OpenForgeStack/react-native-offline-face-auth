import { gpsSpoofed } from '../../../shared/errors/errorFactory';
import type { SpoofCheckResult, LocationResult } from '../types/gps.types';

export function checkSpoofed(
  location: LocationResult,
  previousLocation?: LocationResult,
): SpoofCheckResult {
  if (previousLocation) {
    const timeDiff = (location.capturedAt - previousLocation.capturedAt) / 1000;
    if (timeDiff > 0) {
      const distance = haversineDistance(
        previousLocation.latitude,
        previousLocation.longitude,
        location.latitude,
        location.longitude,
      );
      const speedKmh = (distance / 1000) / (timeDiff / 3600);
      if (speedKmh > 500) {
        return { isSpoofed: true, reason: 'impossible_speed' };
      }
    }
  }

  return { isSpoofed: false };
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
