import { detectBlur } from '../../../../modules/validation/quality/blurDetector';

describe('blurDetector', () => {
  it('uniform-color frame should be detected as blurry', () => {
    const pixels = new Float32Array(320 * 320 * 3).fill(128);
    expect(detectBlur(pixels, 320, 320)).toBe(true);
  });
});
