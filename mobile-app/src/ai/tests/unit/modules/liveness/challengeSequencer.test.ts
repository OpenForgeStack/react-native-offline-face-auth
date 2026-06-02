import { challengeSequencer } from '../../../../modules/liveness/challenges/challengeSequencer';
import { useSessionState } from '../../../../engine/state/sessionState';

describe('challengeSequencer', () => {
  it('should not produce same sequence twice in a row', () => {
    const sequences: string[][] = [];
    for (let i = 0; i < 10; i++) {
      challengeSequencer.startNewSession();
      const state = useSessionState.getState();
      sequences.push([...state.challengeSequence]);
    }

    for (let i = 1; i < sequences.length; i++) {
      expect(sequences[i]).not.toEqual(sequences[i - 1]);
    }
  });
});
