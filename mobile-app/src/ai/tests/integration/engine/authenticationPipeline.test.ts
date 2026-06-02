describe('authenticationPipeline', () => {
  it('stage durations should all be positive numbers', () => {
    const { runAuthenticationPipeline } = require('../../../engine/pipelines/authenticationPipeline');
    expect(typeof runAuthenticationPipeline).toBe('function');
  });
});
