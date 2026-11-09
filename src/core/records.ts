import { getAttempts } from './game';
import { BASES } from './settings';
import type { GameSettings, GameState, RecordEntry } from './types';

const isSameSettings =
  (settings: GameSettings) =>
  (record: RecordEntry): boolean =>
    record.length === settings.length && record.base === settings.base;

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isRecordEntry = (value: unknown): value is RecordEntry => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const { length, base, attempts, timeMs, date } = value as Record<string, unknown>;

  return [length, attempts, timeMs, date].every(isNumber) && BASES.some((known) => known === base);
};

export const compareRecords = (a: RecordEntry, b: RecordEntry): number =>
  a.attempts - b.attempts || a.timeMs - b.timeMs;

export const createRecord = (state: GameState): RecordEntry | null => {
  if (state.status !== 'won' || state.finishedAt === null) {
    return null;
  }
  return {
    length: state.settings.length,
    base: state.settings.base,
    attempts: getAttempts(state),
    timeMs: state.finishedAt - state.startedAt,
    date: state.finishedAt,
  };
};

export const getRecordsFor = (
  records: readonly RecordEntry[],
  settings: GameSettings,
): readonly RecordEntry[] => records.filter(isSameSettings(settings));

export const addRecord = (
  records: readonly RecordEntry[],
  entry: RecordEntry,
  limit: number,
): readonly RecordEntry[] => {
  const sameSettings = isSameSettings(entry);
  const others = records.filter((record) => !sameSettings(record));
  const best = [...records.filter(sameSettings), entry].sort(compareRecords).slice(0, limit);

  return [...others, ...best];
};

export const parseRecords = (raw: string | null): readonly RecordEntry[] => {
  if (raw === null) {
    return [];
  }
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isRecordEntry) : [];
  } catch {
    return [];
  }
};
