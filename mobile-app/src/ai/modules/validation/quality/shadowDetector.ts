export function detectShadow(pixels: Float32Array, width: number, height: number): boolean {
  const halfWidth = Math.floor(width / 2);
  let leftSum = 0;
  let rightSum = 0;
  let leftCount = 0;
  let rightCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const brightness = 0.299 * pixels[idx]! + 0.587 * pixels[idx + 1]! + 0.114 * pixels[idx + 2]!;
      if (x < halfWidth) {
        leftSum += brightness;
        leftCount++;
      } else {
        rightSum += brightness;
        rightCount++;
      }
    }
  }

  const leftMean = leftSum / leftCount;
  const rightMean = rightSum / rightCount;
  const asymmetryRatio = leftMean > rightMean
    ? leftMean / Math.max(rightMean, 1)
    : rightMean / Math.max(leftMean, 1);

  return asymmetryRatio > 0.4;
}
