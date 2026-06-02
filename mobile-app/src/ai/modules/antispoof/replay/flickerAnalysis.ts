export function analyzeFlicker(
  frameSequence: Float32Array[],
): { hasFlicker: boolean; flickerScore: number } {
  if (frameSequence.length < 3) {
    return { hasFlicker: false, flickerScore: 0 };
  }

  let totalVariation = 0;
  let comparisons = 0;

  for (let i = 1; i < frameSequence.length; i++) {
    const prev = frameSequence[i - 1]!;
    const curr = frameSequence[i]!;
    let diff = 0;
    for (let j = 0; j < Math.min(prev.length, curr.length, 1000); j++) {
      diff += Math.abs(curr[j]! - prev[j]!);
    }
    totalVariation += diff;
    comparisons++;
  }

  const avgVariation = comparisons > 0 ? totalVariation / comparisons : 0;
  return {
    hasFlicker: avgVariation > 0.3,
    flickerScore: Math.min(1, avgVariation),
  };
}
