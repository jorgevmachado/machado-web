import { clampPercentage, formatNumberPrefix, toPositiveInteger } from './number';

describe('number utils', () => {
  it('parses only positive integers', () => {
    expect(toPositiveInteger('3', 1)).toBe(3);
    expect(toPositiveInteger('0', 1)).toBe(1);
    expect(toPositiveInteger('1.5', 1)).toBe(1);
    expect(toPositiveInteger(null, 7)).toBe(7);
  });

  it('formats finite positive numbers with a prefix', () => {
    expect(formatNumberPrefix({ value: 25 })).toBe('Nº 0025');
    expect(formatNumberPrefix({ value: -2, prefix: '#', maxLength: 3 })).toBe('# 000');
    expect(formatNumberPrefix({ value: Number.POSITIVE_INFINITY })).toBe('Nº 0000');
    expect(formatNumberPrefix({ value: 5, fillString: ' ' })).toBe('Nº    5');
  });

  it('clamps percentage values between zero and one hundred', () => {
    expect(clampPercentage(5, 10)).toBe(50);
    expect(clampPercentage(20, 10)).toBe(100);
    expect(clampPercentage(-1, 10)).toBe(0);
    expect(clampPercentage(10, 0)).toBe(0);
  });
});
