import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from '../src/core/combinatorics';

describe('countPossibleSecrets', () => {
  it('returns 1 for length 0', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('returns base for length 1', () => {
    expect(countPossibleSecrets(1, 2)).toBe(2);
    expect(countPossibleSecrets(1, 16)).toBe(16);
  });

  it.each([
    [2, 2, 2],
    [3, 8, 336],
    [4, 10, 5040],
    [6, 10, 151200],
    [2, 16, 240],
    [6, 16, 5765760],
  ])('counts permutations for length %i in base %i: %i', (length, base, expected) => {
    expect(countPossibleSecrets(length, base)).toBe(expected);
  });

  it('counts secrets with a leading zero too', () => {
    expect(countPossibleSecrets(3, 3)).toBe(6);
  });

  it('returns 0 when the length is bigger than the base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
    expect(countPossibleSecrets(6, 2)).toBe(0);
  });

  it('gives the same answer on repeated calls', () => {
    const first = countPossibleSecrets(5, 16);

    expect(countPossibleSecrets(5, 16)).toBe(first);
    expect(first).toBe(524160);
  });
});
