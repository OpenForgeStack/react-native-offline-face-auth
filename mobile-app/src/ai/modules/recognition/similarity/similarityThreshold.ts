export const SIMILARITY_THRESHOLD = {
  cosine: 0.6,
  euclidean: 1.0,
};

export function isMatch(score: number, metric: 'cosine' | 'euclidean' = 'cosine'): boolean {
  const threshold = SIMILARITY_THRESHOLD[metric];
  return score >= threshold;
}
