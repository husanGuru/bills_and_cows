export type Base = 2 | 8 | 10 | 16;

export type DigitValidator = (char: string) => boolean;

export type RandomSource = () => number;

export interface Score {
  readonly bulls: number;
  readonly cows: number;
}

export interface GameSettings {
  readonly length: number;
  readonly base: Base;
}

export interface HistoryEntry {
  readonly guess: string;
  readonly score: Score;
}

export type GameStatus = 'playing' | 'won';

export interface GameState {
  readonly settings: GameSettings;
  readonly secret: string;
  readonly history: readonly HistoryEntry[];
  readonly status: GameStatus;
  readonly startedAt: number;
  readonly finishedAt: number | null;
}

export type GuessError = 'invalid' | 'duplicate' | 'finished';

export interface RecordEntry {
  readonly length: number;
  readonly base: Base;
  readonly attempts: number;
  readonly timeMs: number;
  readonly date: number;
}
