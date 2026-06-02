export function validateShape(tensor: Float32Array, expected: number[]): boolean {
  let size = 1;
  for (const dim of expected) {
    size *= dim;
  }
  return tensor.length === size;
}

export function flattenToFloat32(pixels: number[][][]): Float32Array {
  const height = pixels.length;
  const width = pixels[0]!.length;
  const channels = pixels[0]![0]!.length;
  const flat = new Float32Array(height * width * channels);
  let idx = 0;
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      for (let c = 0; c < channels; c++) {
        flat[idx++] = pixels[h]![w]![c]!;
      }
    }
  }
  return flat;
}

export function reshapeTensor(
  flat: Float32Array,
  shape: number[],
): number[][][] {
  const height = shape[1]!;
  const width = shape[2]!;
  const channels = shape[3]!;
  const result: number[][][] = [];
  let idx = 0;
  for (let h = 0; h < height; h++) {
    const row: number[][] = [];
    for (let w = 0; w < width; w++) {
      const pixel: number[] = [];
      for (let c = 0; c < channels; c++) {
        pixel.push(flat[idx++]!);
      }
      row.push(pixel);
    }
    result.push(row);
  }
  return result;
}

export function createZeroTensor(shape: number[]): Float32Array {
  let size = 1;
  for (const dim of shape) {
    size *= dim;
  }
  return new Float32Array(size);
}
