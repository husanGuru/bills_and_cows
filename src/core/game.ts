import type { GameSettings, GameState, GuessError } from './types';

export const createGame = (
  _settings: GameSettings,
  _secret: string,
  _startedAt: number,
): GameState => {
  throw new Error('Not implemented');
};

export const getGuessError = (_state: GameState, _guess: string): GuessError | null => {
  throw new Error('Not implemented');
};

export const submitGuess = (_state: GameState, _guess: string, _now: number): GameState => {
  throw new Error('Not implemented');
};

export const getAttempts = (_state: GameState): number => {
  throw new Error('Not implemented');
};

export const getElapsedMs = (_state: GameState, _now: number): number => {
  throw new Error('Not implemented');
};
