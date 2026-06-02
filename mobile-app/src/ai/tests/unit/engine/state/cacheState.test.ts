import { useCacheState } from '../../../../engine/state/cacheState';

describe('cacheState', () => {
  it('get after set should return same entry', () => {
    const state = useCacheState.getState();
    const entry = { userId: 'test', embedding: new Float32Array([1, 2, 3]), cachedAt: Date.now(), hitCount: 0 };
    state.set('test', entry);
    const result = state.get('test');
    expect(result).toEqual(entry);
  });

  it('invalidate should remove the entry', () => {
    const state = useCacheState.getState();
    const entry = { userId: 'test', embedding: new Float32Array([1]), cachedAt: Date.now(), hitCount: 0 };
    state.set('test', entry);
    state.invalidate('test');
    expect(state.get('test')).toBeUndefined();
  });
});
