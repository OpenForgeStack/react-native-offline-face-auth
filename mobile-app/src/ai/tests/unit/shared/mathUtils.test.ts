import { l2Normalize, dotProduct, clamp } from '../../../shared/utils/mathUtils';

describe('mathUtils', () => {
  describe('l2Normalize', () => {
    it('normalized vector should have magnitude 1.0', () => {
      const v = new Float32Array([3, 4, 0]);
      const normalized = l2Normalize(v);
      let sumSq = 0;
      for (let i = 0; i < normalized.length; i++) {
        sumSq += normalized[i]! * normalized[i]!;
      }
      expect(Math.sqrt(sumSq)).toBeCloseTo(1.0, 5);
    });
  });

  describe('dotProduct', () => {
    it('orthogonal unit vectors should return 0', () => {
      const a = new Float32Array([1, 0]);
      const b = new Float32Array([0, 1]);
      expect(dotProduct(a, b)).toBe(0);
    });
  });

  describe('clamp', () => {
    it('values outside range are clamped correctly', () => {
      expect(clamp(5, 0, 1)).toBe(1);
      expect(clamp(-1, 0, 1)).toBe(0);
      expect(clamp(0.5, 0, 1)).toBe(0.5);
    });
  });
});
