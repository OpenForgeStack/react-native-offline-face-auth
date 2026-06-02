export class MockFrame {
  readonly width = 1280;
  readonly height = 720;
  readonly pixels: Float32Array;

  constructor(pixels?: Float32Array) {
    this.pixels = pixels ?? new Float32Array(1280 * 720 * 3);
  }

  toString(): string {
    return 'MockFrame';
  }
}
