export function validateFaceAngle(rollAngle: number, maxRoll: number = 30): boolean {
  return Math.abs(rollAngle) <= maxRoll;
}
