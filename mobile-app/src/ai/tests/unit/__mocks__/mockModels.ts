export function loadTensorflowModel(
  _source: number | { url: string },
  _delegate?: string,
): Promise<{ run: (input: Float32Array) => Float32Array; close: () => void }> {
  return Promise.resolve({
    run: (_input: Float32Array) => {
      const outputSize = 896 * 16;
      return new Float32Array(outputSize);
    },
    close: () => {},
  });
}
