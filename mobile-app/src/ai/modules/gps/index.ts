export { captureCoordinates } from './tracking/captureCoordinates';
export { formatLocation } from './tracking/locationFormatter';
export { validateGeofence } from './geofence/geofenceValidator';
export { GEOFENCE_ZONES } from './geofence/geofenceConfig';
export { checkSpoofed } from './spoof/gpsSpoofDetector';
export { locationHistory } from './spoof/locationHistory';
export type { LocationResult, GeofenceResult, SpoofCheckResult } from './types/gps.types';
