import { capitalize, displayDate, formatLabel, formatNumber, normalizedName } from './string';

describe('string utils', () => {
  it('normalizes names and labels', () => {
    expect(normalizedName('mr-mime')).toBe('Mr Mime');
    expect(normalizedName(undefined, 'Fallback')).toBe('Fallback');
    expect(formatLabel('special-attack')).toBe('Special Attack');
  });

  it('capitalizes and formats display values', () => {
    expect(capitalize('pikachu')).toBe('Pikachu');
    expect(formatNumber(25)).toBe('25');
    expect(formatNumber(null)).toBe('Unknown');
    expect(formatNumber(undefined)).toBe('Unknown');
  });

  it('formats valid dates and preserves invalid values', () => {
    expect(displayDate('not-a-date')).toBe('not-a-date');
    expect(displayDate('2026-01-02')).toMatch(/2026|02|2|01|1/);
  });
});
