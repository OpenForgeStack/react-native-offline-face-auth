import { MODEL_REGISTRY } from '../../../models/registry/modelRegistry';

describe('modelRegistry', () => {
  it('registry contains exactly 3 entries for MVP', () => {
    expect(MODEL_REGISTRY.length).toBe(3);
  });

  it('total maxSizeBytes sum < 20 MB', () => {
    const total = MODEL_REGISTRY.reduce((sum, entry) => sum + entry.maxSizeBytes, 0);
    expect(total).toBeLessThan(20 * 1024 * 1024);
  });

  it('only blazeface has isEagerLoad: true', () => {
    const eager = MODEL_REGISTRY.filter((e) => e.isEagerLoad);
    expect(eager.length).toBe(1);
    expect(eager[0]!.id).toBe('blazeface');
  });

  it('all entries have valid non-empty path strings', () => {
    for (const entry of MODEL_REGISTRY) {
      expect(entry.path.length).toBeGreaterThan(0);
    }
  });
});
