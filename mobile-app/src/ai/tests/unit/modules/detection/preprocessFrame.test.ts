import { preprocessFrame } from '../../../../modules/detection/preprocessing/preprocessFrame';

describe('preprocessFrame', () => {
  it('output shape should be [1, 128, 128, 3]', () => {
    const pixels = new Float32Array(1280 * 720 * 3).fill(128);
    const result = preprocessFrame(pixels, 1280, 720, [128, 128, 3]);
    expect(result.length).toBe(128 * 128 * 3);
  });
});
