# TASK: GPS Module

**Directory:** `src/ai/modules/gps/`
**Layer:** MODULES
**MVP Day:** Day 6 (non-blocking for auth MVP, parallel track)
**Depends on:** react-native-geolocation-service, securityService, shared/errors

---

## Objective

Capture GPS coordinates offline, validate for spoofing, apply geofence checks, and encrypt coordinates before storage. Exposed via `captureLocation()` in the public SDK.

---

## Files to Implement

```
modules/gps/
├── tracking/
│   ├── captureCoordinates.ts   ← Single high-accuracy GPS capture
│   └── locationFormatter.ts   ← Format raw coords to LocationResult
├── geofence/
│   ├── geofenceValidator.ts    ← Check if coords within allowed zone
│   └── geofenceConfig.ts      ← Zone definitions
├── spoof/
│   ├── gpsSpoofDetector.ts    ← Mock location / impossible speed detection
│   └── locationHistory.ts     ← Tracks last N locations for velocity check
└── types/
    └── gps.types.ts
```

---

## Types to Define First

```typescript
interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;     // meters
  capturedAt: number;   // Unix ms
  encrypted: boolean;
}

interface GeofenceResult {
  withinZone: boolean;
  distanceMeters: number;
  zoneId?: string;
}

interface SpoofCheckResult {
  isSpoofed: boolean;
  reason?: 'mock_location' | 'impossible_speed' | 'altitude_anomaly';
}
```

---

## Key Implementation Notes

**gpsSpoofDetector**: check `location.isMockProvider` (Android). Also compute speed between last two captured points — if > 500 km/h, flag as spoofed.

**captureCoordinates**: use `getCurrentPosition` with `enableHighAccuracy: true`, timeout 8000 ms, maximumAge 0. Return `LocationResult`.

**Encryption**: pass coordinates through `securityService.encryptString` before `locationRepository.insert`.

---

## Acceptance Criteria

- [ ] `captureCoordinates` works fully offline (no internet needed)
- [ ] Returns `SDKError` with `recoverable: true` if GPS unavailable
- [ ] Spoof detection flags mock location providers
- [ ] Coordinates encrypted before any persistence
- [ ] Exports only through `index.ts`

---

## Tests Required

`src/ai/tests/unit/modules/gps/`

- `gpsSpoofDetector`: `isMockProvider: true` → `isSpoofed: true`
- `gpsSpoofDetector`: speed > 500 km/h between two points → `isSpoofed: true`
- `captureCoordinates`: valid coords returned in expected format
- `geofenceValidator`: point inside radius → `withinZone: true`
