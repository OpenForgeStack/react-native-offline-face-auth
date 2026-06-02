import type { GeofenceResult } from '../types/gps.types';
import type { GeofenceZone } from '../geofence/geofenceConfig';
import { GEOFENCE_ZONES } from '../geofence/geofenceConfig';

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

export function validateGeofence(
  latitude: number,
  longitude: number,
): GeofenceResult {
  for (const zone of GEOFENCE_ZONES) {
    const distance = haversineDistance(
      latitude,
      longitude,
      zone.centerLatitude,
      zone.centerLongitude,
    );
    if (distance <= zone.radiusMeters) {
      return {
        withinZone: true,
        distanceMeters: distance,
        zoneId: zone.id,
      };
    }
  }

  return {
    withinZone: false,
    distanceMeters: 0,
  };
}
