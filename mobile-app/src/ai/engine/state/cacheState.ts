import { create } from 'zustand';
import type { CacheEntry } from '../../modules/recognition/types/recognition.types';

interface CacheState {
  entries: Map<string, CacheEntry>;
  get: (userId: string) => CacheEntry | undefined;
  set: (userId: string, entry: CacheEntry) => void;
  invalidate: (userId: string) => void;
  clear: () => void;
  reset: () => void;
}

export const useCacheState = create<CacheState>()((set, get) => ({
  entries: new Map(),
  get: (userId: string) => get().entries.get(userId),
  set: (userId: string, entry: CacheEntry) =>
    set((state) => {
      const newMap = new Map(state.entries);
      newMap.set(userId, entry);
      return { entries: newMap };
    }),
  invalidate: (userId: string) =>
    set((state) => {
      const newMap = new Map(state.entries);
      newMap.delete(userId);
      return { entries: newMap };
    }),
  clear: () => set({ entries: new Map() }),
  reset: () => set({ entries: new Map() }),
}));
