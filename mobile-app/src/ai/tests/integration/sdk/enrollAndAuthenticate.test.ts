describe('enrollAndAuthenticate', () => {
  it('should export enrollFace and authenticateFace', () => {
    const { enrollFace } = require('../../../sdk/enrollFace');
    const { authenticateFace } = require('../../../sdk/authenticateFace');
    expect(typeof enrollFace).toBe('function');
    expect(typeof authenticateFace).toBe('function');
  });
});
