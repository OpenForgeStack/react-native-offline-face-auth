export function normalizeFrame(pixels: Float32Array, range: [number, number] = [0, 1]): Float32Array {
  const [min, max] = range;
  const result = new Float32Array(pixels.length);

  if (min === 0 && max === 1) {
    for (let i = 0; i < pixels.length; i++) {
      result[i] = pixels[i]! / 255.0;
    }
  } else {
    for (let i = 0; i < pixels.length; i++) {
      result[i] = (pixels[i]! / 255.0) * (max - min) + min;
    }
  }

  return result;
}
