import type { Landmark } from '../../landmarks/types/landmarks.types';

export function estimateDepth(
  landmarks: Landmark[],
): { hasDepthVariation: boolean; depthScore: number } {
  if (landmarks.length < 10) {
    return { hasDepthVariation: false, depthScore: 0 };
  }

  let minZ = Infinity;
  let maxZ = -Infinity;

  for (const lm of landmarks) {
    if (lm.z < minZ) minZ = lm.z;
    if (lm.z > maxZ) maxZ = lm.z;
  }

  const range = maxZ - minZ;
  return {
    hasDepthVariation: range > 0.05,
    depthScore: Math.min(1, range * 10),
  };
}
