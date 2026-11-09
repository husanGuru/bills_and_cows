import { describe, expect, it } from 'vitest';
import {
  createGame,
  getAttempts,
  getElapsedMs,
  getGuessError,
  submitGuess,
} from '../src/core/game';

const START = 1_000_000;

const newGame = () => createGame({ length: 4, base: 10 }, '1234', START);

describe('createGame', () => {
  it('starts a game with empty history', () => {
    expect(newGame()).toEqual({
      settings: { length: 4, base: 10 },
      secret: '1234',
      history: [],
      status: 'playing',
      startedAt: START,
      finishedAt: null,
    });
  });
});

describe('getGuessError', () => {
  it('returns null for a correct new guess', () => {
    expect(getGuessError(newGame(), '5678')).toBeNull();
  });

  it('reports an invalid guess', () => {
    expect(getGuessError(newGame(), '12')).toBe('invalid');
    expect(getGuessError(newGame(), '1123')).toBe('invalid');
    expect(getGuessError(newGame(), '12a4')).toBe('invalid');
  });

  it('reports a guess that was already made', () => {
    const game = submitGuess(newGame(), '5678', START + 1);

    expect(getGuessError(game, '5678')).toBe('duplicate');
  });

  it('treats hex guesses in different case as the same guess', () => {
    const hexGame = createGame({ length: 2, base: 16 }, 'ab', START);
    const game = submitGuess(hexGame, 'cd', START + 1);

    expect(getGuessError(game, 'CD')).toBe('duplicate');
  });

  it('reports that the game is already won', () => {
    const game = submitGuess(newGame(), '1234', START + 1);

    expect(getGuessError(game, '5678')).toBe('finished');
  });
});

describe('submitGuess', () => {
  it('adds a history entry with the score', () => {
    const game = submitGuess(newGame(), '1243', START + 1);

    expect(game.history).toEqual([{ guess: '1243', score: { bulls: 2, cows: 2 } }]);
    expect(game.status).toBe('playing');
  });

  it('does not change the previous state', () => {
    const before = newGame();
    const after = submitGuess(before, '5678', START + 1);

    expect(after).not.toBe(before);
    expect(after.history).not.toBe(before.history);
    expect(before.history).toEqual([]);
  });

  it('keeps old entries untouched and appends new ones at the end', () => {
    const first = submitGuess(newGame(), '5678', START + 1);
    const second = submitGuess(first, '1243', START + 2);

    expect(second.history[0]).toBe(first.history[0]);
    expect(second.history.map((entry) => entry.guess)).toEqual(['5678', '1243']);
  });

  it('stores hex guesses in lower case', () => {
    const hexGame = createGame({ length: 2, base: 16 }, 'ab', START);

    expect(submitGuess(hexGame, 'BA', START + 1).history[0]?.guess).toBe('ba');
  });

  it('returns the same state for an invalid or repeated guess', () => {
    const game = submitGuess(newGame(), '5678', START + 1);

    expect(submitGuess(game, '11', START + 2)).toBe(game);
    expect(submitGuess(game, '5678', START + 2)).toBe(game);
  });

  it('finishes the game when every digit is a bull', () => {
    const game = submitGuess(submitGuess(newGame(), '5678', START + 1), '1234', START + 5000);

    expect(game.status).toBe('won');
    expect(game.finishedAt).toBe(START + 5000);
  });

  it('ignores guesses after the game is won', () => {
    const won = submitGuess(newGame(), '1234', START + 1);

    expect(submitGuess(won, '5678', START + 2)).toBe(won);
  });
});

describe('getAttempts', () => {
  it('counts the history entries', () => {
    const game = submitGuess(submitGuess(newGame(), '5678', START + 1), '1243', START + 2);

    expect(getAttempts(newGame())).toBe(0);
    expect(getAttempts(game)).toBe(2);
  });
});

describe('getElapsedMs', () => {
  it('counts time from start to now while playing', () => {
    expect(getElapsedMs(newGame(), START + 3000)).toBe(3000);
  });

  it('stops counting when the game is won', () => {
    const won = submitGuess(newGame(), '1234', START + 7000);

    expect(getElapsedMs(won, START + 60000)).toBe(7000);
  });
});
