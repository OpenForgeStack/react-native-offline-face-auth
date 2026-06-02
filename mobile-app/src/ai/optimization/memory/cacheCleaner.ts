import { useCacheState } from '../../engine/state/cacheState';

class CacheCleaner {
  private maxEntries = 50;
  private ttlMs = 5 * 60 * 1000;

  configure(max: number, ttlMs: number): void {
    this.maxEntries = max;
    this.ttlMs = ttlMs;
  }

  run(): void {
    const state = useCacheState.getState();
    const entries = state.entries;
    if (entries.size <= this.maxEntries) return;

    const now = Date.now();
    const sorted = Array.from(entries.entries()).sort((a, b) => {
      return (a[1]?.cachedAt ?? 0) - (b[1]?.cachedAt ?? 0);
    });

    const toDelete: string[] = [];
    for (const [userId, entry] of sorted) {
      if (toDelete.length >= entries.size - this.maxEntries) break;
      if (now - entry.cachedAt > this.ttlMs || toDelete.length < entries.size - this.maxEntries) {
        toDelete.push(userId);
      }
    }

    for (const userId of toDelete) {
      state.invalidate(userId);
    }
  }
}

export const cacheCleaner = new CacheCleaner();
