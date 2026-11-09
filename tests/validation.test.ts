import { describe, expect, it } from 'vitest';
import { isValidGuess } from '../src/core/validation';

describe('isValidGuess', () => {
  it('accepts a guess of the right length with unique valid digits', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
    expect(isValidGuess('10', 2, 2)).toBe(true);
    expect(isValidGuess('0765', 4, 8)).toBe(true);
  });

  it('accepts a guess that starts with zero', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('rejects a guess that is too short or too long', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
    expect(isValidGuess('12345', 4, 10)).toBe(false);
    expect(isValidGuess('', 4, 10)).toBe(false);
  });

  it('rejects digits that do not exist in the base', () => {
    expect(isValidGuess('12', 2, 2)).toBe(false);
    expect(isValidGuess('1238', 4, 8)).toBe(false);
    expect(isValidGuess('12a4', 4, 10)).toBe(false);
    expect(isValidGuess('12g4', 4, 16)).toBe(false);
  });

  it('rejects repeated digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
    expect(isValidGuess('11', 2, 2)).toBe(false);
  });

  it('accepts uppercase hex digits', () => {
    expect(isValidGuess('AbC1', 4, 16)).toBe(true);
    expect(isValidGuess('ABCDEF', 6, 16)).toBe(true);
  });

  it('treats the same hex letter in different case as a repeat', () => {
    expect(isValidGuess('aA12', 4, 16)).toBe(false);
  });
});
