import { describe, expect, it } from 'vitest';
import { createGame, submitGuess } from '../src/core/game';
import {
  addRecord,
  compareRecords,
  createRecord,
  getRecordsFor,
  parseRecords,
} from '../src/core/records';
import type { RecordEntry } from '../src/core/types';

const record = (overrides: Partial<RecordEntry> = {}): RecordEntry => ({
  length: 4,
  base: 10,
  attempts: 5,
  timeMs: 30000,
  date: 1,
  ...overrides,
});

describe('compareRecords', () => {
  it('puts fewer attempts first', () => {
    expect(compareRecords(record({ attempts: 3 }), record({ attempts: 5 }))).toBeLessThan(0);
    expect(compareRecords(record({ attempts: 5 }), record({ attempts: 3 }))).toBeGreaterThan(0);
  });

  it('compares time when attempts are equal', () => {
    expect(compareRecords(record({ timeMs: 1000 }), record({ timeMs: 2000 }))).toBeLessThan(0);
    expect(compareRecords(record(), record())).toBe(0);
  });
});

describe('createRecord', () => {
  it('builds a record from a won game', () => {
    const start = 5000;
    const game = createGame({ length: 2, base: 16 }, 'ab', start);
    const won = submitGuess(submitGuess(game, 'ba', start + 1000), 'ab', start + 4000);

    expect(createRecord(won)).toEqual({
      length: 2,
      base: 16,
      attempts: 2,
      timeMs: 4000,
      date: start + 4000,
    });
  });

  it('returns null while the game is not won', () => {
    expect(createRecord(createGame({ length: 4, base: 10 }, '1234', 0))).toBeNull();
  });
});

describe('getRecordsFor', () => {
  it('keeps only records with the same length and base', () => {
    const records = [
      record({ length: 4, base: 10 }),
      record({ length: 4, base: 16 }),
      record({ length: 3, base: 10 }),
    ];

    expect(getRecordsFor(records, { length: 4, base: 10 })).toEqual([records[0]]);
  });
});

describe('addRecord', () => {
  it('inserts the record in sorted order', () => {
    const records = [record({ attempts: 3 }), record({ attempts: 7 })];

    const result = addRecord(records, record({ attempts: 5 }), 10);

    expect(result.map((entry) => entry.attempts)).toEqual([3, 5, 7]);
  });

  it('keeps only the best records for the same settings', () => {
    const records = [record({ attempts: 3 }), record({ attempts: 4 })];

    const result = addRecord(records, record({ attempts: 9 }), 2);

    expect(result.map((entry) => entry.attempts)).toEqual([3, 4]);
  });

  it('does not drop records of other settings', () => {
    const other = record({ base: 16, attempts: 20 });
    const records = [record({ attempts: 3 }), other];

    const result = addRecord(records, record({ attempts: 4 }), 1);

    expect(result).toContain(other);
    expect(getRecordsFor(result, { length: 4, base: 10 })).toEqual([record({ attempts: 3 })]);
  });

  it('does not change the original array', () => {
    const records = [record({ attempts: 3 })];

    addRecord(records, record({ attempts: 1 }), 10);

    expect(records).toEqual([record({ attempts: 3 })]);
  });
});

describe('parseRecords', () => {
  it('returns an empty list for missing or broken data', () => {
    expect(parseRecords(null)).toEqual([]);
    expect(parseRecords('not json')).toEqual([]);
    expect(parseRecords('{"a":1}')).toEqual([]);
  });

  it('reads saved records', () => {
    const saved = [record(), record({ attempts: 2, base: 8 })];

    expect(parseRecords(JSON.stringify(saved))).toEqual(saved);
  });

  it('skips entries with a wrong shape', () => {
    const raw = JSON.stringify([record(), { attempts: 'x' }, null, record({ base: 3 as never })]);

    expect(parseRecords(raw)).toEqual([record()]);
  });
});
