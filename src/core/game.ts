import { normalizeDigit } from './digits';
import { evaluateGuess } from './evaluate';
import { isValidGuess } from './validation';
import type { GameSettings, GameState, GuessError, HistoryEntry } from './types';

const normalizeGuess = (guess: string): string => [...guess].map(normalizeDigit).join('');

const wasGuessed = (history: readonly HistoryEntry[], guess: string): boolean =>
  history.some((entry) => entry.guess === guess);

export const createGame = (
  settings: GameSettings,
  secret: string,
  startedAt: number,
): GameState => ({
  settings,
  secret,
  history: [],
  status: 'playing',
  startedAt,
  finishedAt: null,
});

export const getGuessError = (state: GameState, guess: string): GuessError | null => {
  const { length, base } = state.settings;

  if (state.status !== 'playing') {
    return 'finished';
  }
  if (!isValidGuess(guess, length, base)) {
    return 'invalid';
  }
  if (wasGuessed(state.history, normalizeGuess(guess))) {
    return 'duplicate';
  }
  return null;
};

export const submitGuess = (state: GameState, guess: string, now: number): GameState => {
  if (getGuessError(state, guess) !== null) {
    return state;
  }

  const normalized = normalizeGuess(guess);
  const score = evaluateGuess(state.secret, normalized);
  const isWon = score.bulls === state.settings.length;

  return {
    ...state,
    history: [...state.history, { guess: normalized, score }],
    status: isWon ? 'won' : 'playing',
    finishedAt: isWon ? now : null,
  };
};

export const getAttempts = (state: GameState): number => state.history.length;

export const getElapsedMs = (state: GameState, now: number): number =>
  (state.finishedAt ?? now) - state.startedAt;
