describe('recognitionPipeline', () => {
  it('should export runRecognitionPipeline function', () => {
    const { runRecognitionPipeline } = require('../../../engine/pipelines/recognitionPipeline');
    expect(typeof runRecognitionPipeline).toBe('function');
  });
});
