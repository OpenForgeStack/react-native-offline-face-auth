export function validateFaceSize(boxWidth: number, frameWidth: number): boolean {
  const minRatio = 0.15;
  return boxWidth / frameWidth >= minRatio;
}
