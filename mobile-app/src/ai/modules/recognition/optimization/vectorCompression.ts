export function compressToInt8(vector: Float32Array): Int8Array {
  const result = new Int8Array(vector.length);
  for (let i = 0; i < vector.length; i++) {
    result[i] = Math.round(Math.max(-128, Math.min(127, vector[i]! * 128)));
  }
  return result;
}

export function decompressFromInt8(compressed: Int8Array): Float32Array {
  const result = new Float32Array(compressed.length);
  for (let i = 0; i < compressed.length; i++) {
    result[i] = compressed[i]! / 128;
  }
  return result;
}
