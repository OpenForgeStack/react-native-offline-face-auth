export function l2Normalize(vector: Float32Array): Float32Array {
  let sumSq = 0;
  for (let i = 0; i < vector.length; i++) {
    sumSq += vector[i]! * vector[i]!;
  }
  const norm = Math.sqrt(sumSq);
  if (norm === 0) return new Float32Array(vector.length);
  const result = new Float32Array(vector.length);
  for (let i = 0; i < vector.length; i++) {
    result[i] = vector[i]! / norm;
  }
  return result;
}

export function dotProduct(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i]! * b[i]!;
  }
  return sum;
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function euclideanDistance2D(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
