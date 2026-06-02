import { validateFaceSize } from '../../../../modules/detection/validators/faceSizeValidator';

describe('faceSizeValidator', () => {
  it('rejects face < 15% frame width', () => {
    expect(validateFaceSize(50, 1000)).toBe(false);
  });

  it('accepts face >= 15% frame width', () => {
    expect(validateFaceSize(200, 1000)).toBe(true);
  });
});
