export function computeLBP(
  pixels: Float32Array,
  width: number,
  height: number,
): number[] {
  const histogram = new Array(256).fill(0);
  const grayscale = new Float32Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const idx = i * 3;
    grayscale[i] = 0.299 * pixels[idx]! + 0.587 * pixels[idx + 1]! + 0.114 * pixels[idx + 2]!;
  }

  const neighbors = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, 1], [1, 1], [1, 0],
    [1, -1], [0, -1],
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const center = grayscale[y * width + x]!;
      let lbp = 0;

      for (let n = 0; n < 8; n++) {
        const ny = y + neighbors[n]![0]!;
        const nx = x + neighbors[n]![1]!;
        const neighbor = grayscale[ny * width + nx]!;
        if (neighbor >= center) {
          lbp |= 1 << n;
        }
      }

      histogram[lbp] = (histogram[lbp] ?? 0) + 1;
    }
  }

  const total = histogram.reduce((s, v) => s + v, 0);
  return histogram.map((v) => (total > 0 ? v / total : 0));
}
