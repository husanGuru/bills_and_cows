import { parseRecords } from '../core/records';
import type { RecordEntry } from '../core/types';

const KEY = 'bulls-and-cows:records';

export const loadRecords = (): readonly RecordEntry[] => {
  try {
    return parseRecords(localStorage.getItem(KEY));
  } catch {
    return [];
  }
};

export const saveRecords = (records: readonly RecordEntry[]): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    // storage is unavailable, records stay in memory only
  }
};
