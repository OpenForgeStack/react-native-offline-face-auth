export function checkFaceSize(boundingBoxWidth: number, frameWidth: number): boolean {
  const minWidthRatio = 0.15;
  return boundingBoxWidth / frameWidth >= minWidthRatio;
}
