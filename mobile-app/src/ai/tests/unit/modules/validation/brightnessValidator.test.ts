import { validateBrightness } from '../../../../modules/validation/quality/brightnessValidator';

describe('brightnessValidator', () => {
  it('all-zero frame should be TOO_DARK', () => {
    const pixels = new Float32Array(320 * 320 * 3).fill(0);
    const result = validateBrightness(pixels);
    expect(result.tooDark).toBe(true);
  });

  it('all-255 frame should be TOO_BRIGHT', () => {
    const pixels = new Float32Array(320 * 320 * 3).fill(255);
    const result = validateBrightness(pixels);
    expect(result.tooBright).toBe(true);
  });
});
