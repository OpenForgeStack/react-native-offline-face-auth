export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface EyeLandmarks {
  leftEye: Landmark[];
  rightEye: Landmark[];
}

export interface MouthLandmarks {
  upper: Landmark[];
  lower: Landmark[];
  leftCorner: Landmark;
  rightCorner: Landmark;
}

export interface HeadPose {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface LandmarkResult {
  landmarks: Landmark[];
  eyeLandmarks: EyeLandmarks;
  mouthLandmarks: MouthLandmarks;
  headPose: HeadPose;
  processingTimeMs: number;
}
