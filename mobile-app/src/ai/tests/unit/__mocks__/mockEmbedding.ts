function generateEmbedding(values: number[]): Float32Array {
  return new Float32Array(values);
}

export const MATCHING_EMBEDDING_A = generateEmbedding(
  Array.from({ length: 128 }, (_, i) => Math.sin(i * 0.5) * 0.5 + 0.5),
);

export const MATCHING_EMBEDDING_B = generateEmbedding(
  Array.from({ length: 128 }, (_, i) => Math.sin(i * 0.5) * 0.5 + 0.5 + Math.sin(i) * 0.01),
);

export const NON_MATCHING_EMBEDDING = generateEmbedding(
  Array.from({ length: 128 }, () => Math.random() * 2 - 1),
);
