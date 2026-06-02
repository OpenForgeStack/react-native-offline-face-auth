describe('livenessFlow', () => {
  it('should export verifyLiveness', () => {
    const { verifyLiveness } = require('../../../sdk/verifyLiveness');
    expect(typeof verifyLiveness).toBe('function');
  });
});
