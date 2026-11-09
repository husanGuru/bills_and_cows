import { describe, expect, it } from 'vitest';
import { evaluateGuess } from '../src/core/evaluate';

describe('evaluateGuess', () => {
  it('gives all bulls when the guess equals the secret', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('gives zero bulls and zero cows when no digit matches', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('gives all cows when digits are right but every position is wrong', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts bulls and cows together', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
    expect(evaluateGuess('1234', '1567')).toEqual({ bulls: 1, cows: 0 });
    expect(evaluateGuess('1234', '5174')).toEqual({ bulls: 1, cows: 1 });
  });

  it('handles a secret with a leading zero', () => {
    expect(evaluateGuess('0123', '0123')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('0123', '3210')).toEqual({ bulls: 0, cows: 4 });
  });

  it('works with binary numbers', () => {
    expect(evaluateGuess('10', '10')).toEqual({ bulls: 2, cows: 0 });
    expect(evaluateGuess('10', '01')).toEqual({ bulls: 0, cows: 2 });
  });

  it('ignores letter case for hex digits', () => {
    expect(evaluateGuess('abcd', 'ABCD')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('ABCD', 'dcba')).toEqual({ bulls: 0, cows: 4 });
    expect(evaluateGuess('a1f0', 'F1Ae')).toEqual({ bulls: 1, cows: 2 });
  });
});
