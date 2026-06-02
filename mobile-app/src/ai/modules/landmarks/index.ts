export { extractLandmarks } from './extraction/extractLandmarks';
export { normalizeLandmarks } from './extraction/normalizeLandmarks';
export { getEyeLandmarks } from './facial/eyeLandmarks';
export { getMouthLandmarks } from './facial/mouthLandmarks';
export { estimateHeadPose } from './pose/headPoseEstimator';
export type { Landmark, LandmarkResult, EyeLandmarks, MouthLandmarks, HeadPose } from './types/landmarks.types';
