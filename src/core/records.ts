import type { GameSettings, GameState, RecordEntry } from './types';

export const compareRecords = (_a: RecordEntry, _b: RecordEntry): number => {
  throw new Error('Not implemented');
};

export const createRecord = (_state: GameState): RecordEntry | null => {
  throw new Error('Not implemented');
};

export const getRecordsFor = (
  _records: readonly RecordEntry[],
  _settings: GameSettings,
): readonly RecordEntry[] => {
  throw new Error('Not implemented');
};

export const addRecord = (
  _records: readonly RecordEntry[],
  _entry: RecordEntry,
  _limit: number,
): readonly RecordEntry[] => {
  throw new Error('Not implemented');
};

export const parseRecords = (_raw: string | null): readonly RecordEntry[] => {
  throw new Error('Not implemented');
};
