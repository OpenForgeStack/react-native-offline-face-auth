import type { Landmark } from '../../../modules/landmarks/types/landmarks.types';

function createLandmarks(
  eyeHalfHeight: number = 0.03,
  mouthHalfHeight: number = 0.01,
  yawAngle: number = 0,
): Landmark[] {
  const landmarks: Landmark[] = [];
  for (let i = 0; i < 468; i++) {
    landmarks.push({ x: 0.5, y: 0.5, z: 0 });
  }

  landmarks[33] = { x: 0.35, y: 0.40, z: 0 };
  landmarks[159] = { x: 0.37, y: 0.40 - eyeHalfHeight, z: 0 };
  landmarks[158] = { x: 0.44, y: 0.40 - eyeHalfHeight, z: 0 };
  landmarks[133] = { x: 0.47, y: 0.40, z: 0 };
  landmarks[153] = { x: 0.44, y: 0.40 + eyeHalfHeight, z: 0 };
  landmarks[145] = { x: 0.37, y: 0.40 + eyeHalfHeight, z: 0 };

  landmarks[362] = { x: 0.53, y: 0.40, z: 0 };
  landmarks[386] = { x: 0.55, y: 0.40 - eyeHalfHeight, z: 0 };
  landmarks[385] = { x: 0.62, y: 0.40 - eyeHalfHeight, z: 0 };
  landmarks[263] = { x: 0.65, y: 0.40, z: 0 };
  landmarks[380] = { x: 0.62, y: 0.40 + eyeHalfHeight, z: 0 };
  landmarks[374] = { x: 0.55, y: 0.40 + eyeHalfHeight, z: 0 };

  const cornerRaise = mouthHalfHeight * 0.3;
  landmarks[13] = { x: 0.50, y: 0.55 - mouthHalfHeight, z: 0 };
  landmarks[14] = { x: 0.50, y: 0.55 + mouthHalfHeight, z: 0 };
  landmarks[61] = { x: 0.45, y: 0.55 - cornerRaise, z: 0 };
  landmarks[291] = { x: 0.55, y: 0.55 - cornerRaise, z: 0 };

  landmarks[1] = { x: 0.5 + Math.sin(yawAngle * Math.PI / 180) * 0.1, y: 0.5, z: 0 };
  landmarks[152] = { x: 0.5, y: 0.65, z: 0 };
  landmarks[234] = { x: 0.3, y: 0.5, z: 0 };
  landmarks[454] = { x: 0.7, y: 0.5, z: 0 };

  return landmarks;
}

export const FRONTAL_FACE_LANDMARKS = createLandmarks(0.03, 0.01, 0);
export const BLINK_LANDMARKS = createLandmarks(0.005, 0.01, 0);
export const SMILE_LANDMARKS = createLandmarks(0.03, 0.04, 0);
export const TURN_LEFT_LANDMARKS = createLandmarks(0.03, 0.01, -30);
export const TURN_RIGHT_LANDMARKS = createLandmarks(0.03, 0.01, 30);
