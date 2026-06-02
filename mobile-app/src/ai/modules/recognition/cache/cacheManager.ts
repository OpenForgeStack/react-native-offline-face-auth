import { useCacheState } from '../../../engine/state/cacheState';
import type { CacheEntry } from '../types/recognition.types';

class CacheManager {
  private maxSize = 50;
  private ttlMs = 5 * 60 * 1000;

  configure(maxSize: number, ttlMs: number): void {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  get(userId: string): CacheEntry | undefined {
    const entry = useCacheState.getState().get(userId);
    if (!entry) return undefined;

    entry.hitCount++;
    return entry;
  }

  set(userId: string, embedding: Float32Array): void {
    const state = useCacheState.getState();
    if (state.entries.size >= this.maxSize) {
      this.evictLRU();
    }

    const entry: CacheEntry = {
      userId,
      embedding,
      cachedAt: Date.now(),
      hitCount: 0,
    };
    state.set(userId, entry);
  }

  invalidate(userId: string): void {
    useCacheState.getState().invalidate(userId);
  }

  clear(): void {
    useCacheState.getState().clear();
  }

  private evictLRU(): void {
    const state = useCacheState.getState();
    const entries = Array.from(state.entries.entries());
    if (entries.length === 0) return;

    entries.sort((a, b) => {
      const ageA = Date.now() - a[1]!.cachedAt;
      const ageB = Date.now() - b[1]!.cachedAt;
      return ageB - ageA;
    });

    const oldest = entries[0]![0];
    state.invalidate(oldest);
  }
}

export const cacheManager = new CacheManager();
