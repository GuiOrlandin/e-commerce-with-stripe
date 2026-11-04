import { estimateTokens } from './estimateTokens';

describe('estimateTokens', () => {
  it('estimates ~1 token per 4 characters (ceil)', () => {
    expect(estimateTokens('abcd')).toBe(1);
    expect(estimateTokens('abcde')).toBe(2);
  });

  it('returns 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0);
  });
});
