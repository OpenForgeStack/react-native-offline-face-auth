describe('livenessPipeline', () => {
  it('should export runLivenessPipeline function', () => {
    const { runLivenessPipeline } = require('../../../engine/pipelines/livenessPipeline');
    expect(typeof runLivenessPipeline).toBe('function');
  });
});
