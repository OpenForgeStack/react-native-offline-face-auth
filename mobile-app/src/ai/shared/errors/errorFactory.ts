import { SDKError } from './SDKError';
import { SDKErrorCode, SDKModule } from '../constants/errorCodes';

export function modelLoadFailed(modelName: string, reason: string): SDKError {
  return new SDKError({
    code: SDKErrorCode.MODEL_LOAD_FAILED,
    module: SDKModule.ENGINE,
    message: `Failed to load model ${modelName}: ${reason}`,
    recoverable: false,
  });
}

export function sdkNotInitialized(): SDKError {
  return new SDKError({
    code: SDKErrorCode.SDK_NOT_INITIALIZED,
    module: SDKModule.SDK,
    message: 'SDK not initialized. Call initializeSDK() first.',
    recoverable: false,
  });
}

export function frameTooBlurry(): SDKError {
  return new SDKError({
    code: SDKErrorCode.FRAME_TOO_BLURRY,
    module: SDKModule.VALIDATION,
    message: 'Frame is too blurry for face detection.',
    recoverable: true,
  });
}

export function frameTooDark(): SDKError {
  return new SDKError({
    code: SDKErrorCode.FRAME_TOO_DARK,
    module: SDKModule.VALIDATION,
    message: 'Frame is too dark for face detection.',
    recoverable: true,
  });
}

export function faceTooSmall(): SDKError {
  return new SDKError({
    code: SDKErrorCode.FACE_TOO_SMALL,
    module: SDKModule.VALIDATION,
    message: 'Face bounding box is too small relative to frame.',
    recoverable: true,
  });
}

export function multipleFaces(count: number): SDKError {
  return new SDKError({
    code: SDKErrorCode.MULTIPLE_FACES,
    module: SDKModule.VALIDATION,
    message: `Multiple faces detected (${count}). Only one face allowed.`,
    recoverable: true,
  });
}

export function noFaceDetected(): SDKError {
  return new SDKError({
    code: SDKErrorCode.NO_FACE_DETECTED,
    module: SDKModule.DETECTION,
    message: 'No face detected in frame.',
    recoverable: true,
  });
}

export function livenessFailed(reason: string): SDKError {
  return new SDKError({
    code: SDKErrorCode.LIVENESS_FAILED,
    module: SDKModule.LIVENESS,
    message: `Liveness check failed: ${reason}`,
    recoverable: true,
  });
}

export function livenessTimeout(): SDKError {
  return new SDKError({
    code: SDKErrorCode.LIVENESS_TIMEOUT,
    module: SDKModule.LIVENESS,
    message: 'Liveness challenge timed out.',
    recoverable: true,
  });
}

export function userNotEnrolled(userId: string): SDKError {
  return new SDKError({
    code: SDKErrorCode.USER_NOT_ENROLLED,
    module: SDKModule.RECOGNITION,
    message: `User ${userId} is not enrolled.`,
    recoverable: false,
  });
}

export function duplicateEnrollment(userId: string): SDKError {
  return new SDKError({
    code: SDKErrorCode.DUPLICATE_ENROLLMENT,
    module: SDKModule.RECOGNITION,
    message: `User ${userId} is already enrolled. Call deleteEnrollment first.`,
    recoverable: false,
  });
}

export function inferenceFailed(modelName: string): SDKError {
  return new SDKError({
    code: SDKErrorCode.INFERENCE_FAILED,
    module: SDKModule.ENGINE,
    message: `Inference failed on model: ${modelName}`,
    recoverable: false,
  });
}

export function thermalThrottle(): SDKError {
  return new SDKError({
    code: SDKErrorCode.THERMAL_THROTTLE,
    module: SDKModule.ENGINE,
    message: 'Device temperature too high. Inference throttled.',
    recoverable: true,
  });
}

export function gpsUnavailable(): SDKError {
  return new SDKError({
    code: SDKErrorCode.GPS_UNAVAILABLE,
    module: SDKModule.GPS,
    message: 'GPS location unavailable.',
    recoverable: true,
  });
}

export function gpsSpoofed(reason: string): SDKError {
  return new SDKError({
    code: SDKErrorCode.GPS_SPOOFED,
    module: SDKModule.GPS,
    message: `GPS spoofing detected: ${reason}`,
    recoverable: false,
  });
}
