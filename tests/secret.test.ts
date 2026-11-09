import { describe, expect, it } from 'vitest';
import { generateSecret } from '../src/core/secret';
import { isValidGuess } from '../src/core/validation';
import type { Base, RandomSource } from '../src/core/types';

const constant =
  (value: number): RandomSource =>
  () =>
    value;

const sequence = (values: number[]): RandomSource => {
  let index = 0;
  return () => values[index++ % values.length] ?? 0;
};

const seeded = (seed: number): RandomSource => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
};

describe('generateSecret', () => {
  it('always takes the first free digit when random returns 0', () => {
    expect(generateSecret(4, 10, constant(0))).toBe('0123');
  });

  it('always takes the last free digit when random is close to 1', () => {
    expect(generateSecret(4, 10, constant(0.999))).toBe('9876');
    expect(generateSecret(3, 16, constant(0.999))).toBe('fed');
  });

  it('picks digits from the remaining ones according to random', () => {
    expect(generateSecret(3, 10, sequence([0.5, 0, 0.99]))).toBe('509');
  });

  it('returns the same secret for the same random source', () => {
    expect(generateSecret(5, 16, seeded(42))).toBe(generateSecret(5, 16, seeded(42)));
  });

  it('calls random once per digit', () => {
    let calls = 0;
    const counting: RandomSource = () => {
      calls += 1;
      return 0.3;
    };

    generateSecret(4, 10, counting);

    expect(calls).toBe(4);
  });

  it('produces only 01 or 10 for binary of length 2', () => {
    expect(generateSecret(2, 2, constant(0))).toBe('01');
    expect(generateSecret(2, 2, constant(0.9))).toBe('10');
  });

  it.each<[number, Base]>([
    [2, 2],
    [4, 8],
    [6, 8],
    [4, 10],
    [6, 10],
    [3, 16],
    [6, 16],
  ])('generates a valid secret of length %i in base %i', (length, base) => {
    const random = seeded(length * 100 + base);

    Array.from({ length: 50 }, () => generateSecret(length, base, random)).forEach((secret) => {
      expect(isValidGuess(secret, length, base)).toBe(true);
    });
  });

  it('uses Math.random by default', () => {
    expect(isValidGuess(generateSecret(4, 10), 4, 10)).toBe(true);
  });
});
