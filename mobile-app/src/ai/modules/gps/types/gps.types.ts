export interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  capturedAt: number;
  encrypted: boolean;
}

export interface GeofenceResult {
  withinZone: boolean;
  distanceMeters: number;
  zoneId?: string;
}

export interface SpoofCheckResult {
  isSpoofed: boolean;
  reason?: 'mock_location' | 'impossible_speed' | 'altitude_anomaly';
}
