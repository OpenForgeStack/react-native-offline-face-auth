export function checkFrameIntegrity(
  pixels: Float32Array,
  width: number,
  height: number,
): { artifactScore: number; isCompromised: boolean } {
  let blockArtifacts = 0;
  const blockSize = 8;
  const channels = 3;

  for (let y = 0; y < height - blockSize; y += blockSize) {
    for (let x = 0; x < width - blockSize; x += blockSize) {
      let blockDiff = 0;
      let samples = 0;

      for (let c = 0; c < channels; c++) {
        const topLeft = pixels[(y * width + x) * channels + c]!;
        const topRight = pixels[(y * width + x + blockSize - 1) * channels + c]!;
        const botLeft = pixels[((y + blockSize - 1) * width + x) * channels + c]!;
        const botRight = pixels[((y + blockSize - 1) * width + x + blockSize - 1) * channels + c]!;

        blockDiff += Math.abs(topLeft - topRight);
        blockDiff += Math.abs(topLeft - botLeft);
        blockDiff += Math.abs(topLeft - botRight);
        samples += 3;
      }

      blockArtifacts += samples > 0 ? blockDiff / samples : 0;
    }
  }

  const totalBlocks = Math.floor(width / blockSize) * Math.floor(height / blockSize);
  const artifactScore = totalBlocks > 0 ? blockArtifacts / totalBlocks : 0;

  return {
    artifactScore: Math.min(1, artifactScore),
    isCompromised: artifactScore > 0.8,
  };
}
