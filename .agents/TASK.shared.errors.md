# TASK: Shared Errors

**Directory:** `src/ai/shared/errors/`
**Layer:** SHARED
**MVP Day:** Day 1 — needed before any module implementation
**Depends on:** shared/types, shared/constants/errorCodes

---

## Objective

Implement the typed error system for the entire SDK. Every thrown error in `src/ai/` must be an `SDKError` instance. Never throw raw `Error` or string.

---

## Files to Implement

```
shared/errors/
├── SDKError.ts           ← Base error class
└── errorFactory.ts       ← Factory functions for common error cases
```

`src/ai/shared/constants/errorCodes.ts` — define all error code enums here.

---

## SDKError Implementation

```typescript
// shared/errors/SDKError.ts
import { SDKErrorCode, SDKModule } from '../constants/errorCodes';

export class SDKError extends Error {
  readonly code: SDKErrorCode;
  readonly module: SDKModule;
  readonly recoverable: boolean;
  readonly timestamp: number;

  constructor(params: {
    code: SDKErrorCode;
    module: SDKModule;
    message: string;
    recoverable: boolean;
  }) {
    super(params.message);
    this.name = 'SDKError';
    this.code = params.code;
    this.module = params.module;
    this.recoverable = params.recoverable;
    this.timestamp = Date.now();
  }
}
```

---

## Error Codes to Define

```typescript
// shared/constants/errorCodes.ts
export enum SDKErrorCode {
  // Init
  MODEL_LOAD_FAILED = 'MODEL_LOAD_FAILED',
  SDK_NOT_INITIALIZED = 'SDK_NOT_INITIALIZED',
  // Validation
  FRAME_TOO_BLURRY = 'FRAME_TOO_BLURRY',
  FRAME_TOO_DARK = 'FRAME_TOO_DARK',
  FACE_TOO_SMALL = 'FACE_TOO_SMALL',
  MULTIPLE_FACES = 'MULTIPLE_FACES',
  NO_FACE_DETECTED = 'NO_FACE_DETECTED',
  // Liveness
  LIVENESS_FAILED = 'LIVENESS_FAILED',
  LIVENESS_TIMEOUT = 'LIVENESS_TIMEOUT',
  // Recognition
  USER_NOT_ENROLLED = 'USER_NOT_ENROLLED',
  DUPLICATE_ENROLLMENT = 'DUPLICATE_ENROLLMENT',
  // Runtime
  INFERENCE_FAILED = 'INFERENCE_FAILED',
  THERMAL_THROTTLE = 'THERMAL_THROTTLE',
  // GPS
  GPS_UNAVAILABLE = 'GPS_UNAVAILABLE',
  GPS_SPOOFED = 'GPS_SPOOFED',
}

export enum SDKModule {
  SDK = 'SDK',
  ENGINE = 'ENGINE',
  DETECTION = 'DETECTION',
  LANDMARKS = 'LANDMARKS',
  LIVENESS = 'LIVENESS',
  RECOGNITION = 'RECOGNITION',
  VALIDATION = 'VALIDATION',
  GPS = 'GPS',
  ANTISPOOF = 'ANTISPOOF',
}
```

---

## Tests Required

`src/ai/tests/unit/shared/SDKError.test.ts`

- `SDKError` should be instanceof `Error`
- `recoverable: true` errors should have correct code
- `errorFactory.livenessFailed()` should return correct module + code
