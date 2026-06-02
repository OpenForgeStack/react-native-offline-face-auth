import { useCacheState } from '../../../engine/state/cacheState';
import type { CacheEntry } from '../types/recognition.types';

export function getCachedEmbedding(userId: string): CacheEntry | undefined {
  return useCacheState.getState().get(userId);
}

export function setCachedEmbedding(userId: string, embedding: Float32Array): void {
  const entry: CacheEntry = {
    userId,
    embedding,
    cachedAt: Date.now(),
    hitCount: 0,
  };
  useCacheState.getState().set(userId, entry);
}

export function invalidateCache(userId: string): void {
  useCacheState.getState().invalidate(userId);
}

export function clearCache(): void {
  useCacheState.getState().clear();
}
