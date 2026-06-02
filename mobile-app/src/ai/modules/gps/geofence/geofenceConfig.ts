export interface GeofenceZone {
  id: string;
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
}

export const GEOFENCE_ZONES: GeofenceZone[] = [];
