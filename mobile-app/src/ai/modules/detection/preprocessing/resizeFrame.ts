export function resizeFrame(
  pixels: Float32Array,
  srcWidth: number,
  srcHeight: number,
  dstWidth: number,
  dstHeight: number,
): Float32Array {
  const channels = 3;
  const result = new Float32Array(dstWidth * dstHeight * channels);

  for (let dy = 0; dy < dstHeight; dy++) {
    for (let dx = 0; dx < dstWidth; dx++) {
      const srcX = (dx / dstWidth) * srcWidth;
      const srcY = (dy / dstHeight) * srcHeight;
      const sx = Math.floor(srcX);
      const sy = Math.floor(srcY);
      const fracX = srcX - sx;
      const fracY = srcY - sy;

      for (let c = 0; c < channels; c++) {
        const topLeft = pixels[(sy * srcWidth + sx) * channels + c] ?? 0;
        const topRight = pixels[(sy * srcWidth + Math.min(sx + 1, srcWidth - 1)) * channels + c] ?? 0;
        const botLeft = pixels[(Math.min(sy + 1, srcHeight - 1) * srcWidth + sx) * channels + c] ?? 0;
        const botRight = pixels[(Math.min(sy + 1, srcHeight - 1) * srcWidth + Math.min(sx + 1, srcWidth - 1)) * channels + c] ?? 0;

        const top = topLeft * (1 - fracX) + topRight * fracX;
        const bot = botLeft * (1 - fracX) + botRight * fracX;
        result[(dy * dstWidth + dx) * channels + c] = top * (1 - fracY) + bot * fracY;
      }
    }
  }

  return result;
}
