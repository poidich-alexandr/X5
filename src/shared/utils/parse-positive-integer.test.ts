import { describe, expect, it } from 'vitest';

import { parsePositiveInteger } from './parse-positive-integer';

describe('parsePositiveInteger', () => {
  const fallbackValue = '10';

  describe('valid positive integers', () => {
    it('returns parsed integer when valid string number', () => {
      expect(parsePositiveInteger('5', fallbackValue)).toBe('5');
    });

    it('floors decimal numbers', () => {
      expect(parsePositiveInteger('5.9', fallbackValue)).toBe('5');
    });

    it('handles numeric string with spaces', () => {
      expect(parsePositiveInteger(' 7 ', fallbackValue)).toBe('7');
    });
  });

  describe('invalid or unsafe values', () => {
    it('returns fallback for empty string', () => {
      expect(parsePositiveInteger('', fallbackValue)).toBe(fallbackValue);
    });

    it('returns fallback for non-numeric string', () => {
      expect(parsePositiveInteger('abc', fallbackValue)).toBe(fallbackValue);
    });

    it('returns fallback for NaN', () => {
      expect(parsePositiveInteger('NaN', fallbackValue)).toBe(fallbackValue);
    });

    it('returns fallback for Infinity', () => {
      expect(parsePositiveInteger('Infinity', fallbackValue)).toBe(fallbackValue);
    });

    it('returns fallback for very large number (1e309 → Infinity)', () => {
      expect(parsePositiveInteger('1e309', fallbackValue)).toBe(fallbackValue);
    });
  });

  describe('non-positive numbers', () => {
    it('returns fallback for zero', () => {
      expect(parsePositiveInteger('0', fallbackValue)).toBe(fallbackValue);
    });

    it('returns fallback for negative number', () => {
      expect(parsePositiveInteger('-5', fallbackValue)).toBe(fallbackValue);
    });

    it('returns fallback when decimal floors below 1', () => {
      expect(parsePositiveInteger('0.7', fallbackValue)).toBe(fallbackValue);
    });
  });
});
