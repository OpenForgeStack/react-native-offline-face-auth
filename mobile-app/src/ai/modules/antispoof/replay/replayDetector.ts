export function detectReplay(
  currentFrame: Float32Array,
  previousFrames: Float32Array[],
  threshold: number = 0.95,
): { isReplay: boolean; confidence: number } {
  if (previousFrames.length === 0) {
    return { isReplay: false, confidence: 0 };
  }

  for (const prev of previousFrames) {
    let similarity = 0;
    let total = 0;
    for (let i = 0; i < Math.min(currentFrame.length, prev.length); i++) {
      const diff = currentFrame[i]! - prev[i]!;
      similarity += 1 - Math.abs(diff);
      total++;
    }
    const avgSimilarity = total > 0 ? similarity / total : 0;
    if (avgSimilarity > threshold) {
      return { isReplay: true, confidence: avgSimilarity };
    }
  }

  return { isReplay: false, confidence: 0 };
}
