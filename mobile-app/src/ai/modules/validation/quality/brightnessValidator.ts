export interface BrightnessResult {
  tooDark: boolean;
  tooBright: boolean;
  mean: number;
}

export function validateBrightness(pixels: Float32Array): BrightnessResult {
  let sum = 0;
  for (let i = 0; i < pixels.length; i++) {
    sum += pixels[i]!;
  }
  const mean = sum / pixels.length;
  return {
    tooDark: mean < 40,
    tooBright: mean > 220,
    mean,
  };
}
