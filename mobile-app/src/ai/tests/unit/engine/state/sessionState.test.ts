import { useSessionState } from '../../../../engine/state/sessionState';

describe('sessionState', () => {
  it('completeChallenge should advance completed list', () => {
    const store = useSessionState;
    store.getState().startSession(['blink', 'smile']);
    store.getState().completeChallenge('blink');
    expect(store.getState().completedChallenges).toEqual(['blink']);
  });
});
