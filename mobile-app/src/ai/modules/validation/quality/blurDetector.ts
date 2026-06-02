export function detectBlur(pixels: Float32Array, width: number, height: number): boolean {
  const grayscale = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 3;
    grayscale[i] = 0.299 * pixels[idx]! + 0.587 * pixels[idx + 1]! + 0.114 * pixels[idx + 2]!;
  }

  let sum = 0;
  let sumSq = 0;
  const kernelSize = 3;
  const halfK = Math.floor(kernelSize / 2);

  for (let y = halfK; y < height - halfK; y++) {
    for (let x = halfK; x < width - halfK; x++) {
      let laplacian = 0;
      for (let ky = -halfK; ky <= halfK; ky++) {
        for (let kx = -halfK; kx <= halfK; kx++) {
          const weight = kx === 0 && ky === 0 ? 4 : -1;
          laplacian += weight * grayscale[(y + ky) * width + (x + kx)]!;
        }
      }
      sum += laplacian;
      sumSq += laplacian * laplacian;
    }
  }

  const n = (width - 2 * halfK) * (height - 2 * halfK);
  const variance = sumSq / n - (sum / n) ** 2;
  return variance < 100;
}
