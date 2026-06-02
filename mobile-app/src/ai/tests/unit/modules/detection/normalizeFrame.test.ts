import { normalizeFrame } from '../../../../modules/detection/preprocessing/normalizeFrame';

describe('normalizeFrame', () => {
  it('all values in [0, 1]', () => {
    const pixels = new Float32Array([0, 128, 255]);
    const result = normalizeFrame(pixels, [0, 1]);
    for (const v of result) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});
