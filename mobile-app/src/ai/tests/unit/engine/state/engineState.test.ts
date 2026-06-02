import { useEngineState } from '../../../../engine/state/engineState';

describe('engineState', () => {
  it('setReady(true) should set isReady to true', () => {
    useEngineState.getState().setReady(true);
    expect(useEngineState.getState().isReady).toBe(true);
  });

  it('setReady(false) should set isReady to false', () => {
    useEngineState.getState().setReady(false);
    expect(useEngineState.getState().isReady).toBe(false);
  });
});
