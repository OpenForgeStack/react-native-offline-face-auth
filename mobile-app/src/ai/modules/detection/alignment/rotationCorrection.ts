export function correctRotation(
  pixels: Float32Array,
  width: number,
  height: number,
  rollAngle: number,
): Float32Array {
  if (Math.abs(rollAngle) < 0.5) return pixels;

  const radians = (rollAngle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const cx = width / 2;
  const cy = height / 2;
  const channels = 3;
  const result = new Float32Array(width * height * channels);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcX = cos * (x - cx) - sin * (y - cy) + cx;
      const srcY = sin * (x - cx) + cos * (y - cy) + cy;

      const sx = Math.round(srcX);
      const sy = Math.round(srcY);

      if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
        const srcIdx = (sy * width + sx) * channels;
        const dstIdx = (y * width + x) * channels;
        for (let c = 0; c < channels; c++) {
          result[dstIdx + c] = pixels[srcIdx + c]!;
        }
      }
    }
  }

  return result;
}
