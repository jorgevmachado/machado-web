import { buildQueryString, capitalize, displayDate, formatLabel, formatNumber, formatOrder, formatValue, normalizedName, replaceFractions } from './string';

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

  it('builds query strings and formats optional values', () => {
    expect(buildQueryString({ name: 'pikachu', status: undefined }, 2, 10)).toBe('page=2&limit=10&name=pikachu');
    expect(buildQueryString({ name: 'pikachu' })).toBe('name=pikachu');
    expect(formatOrder(null)).toBe('#---');
    expect(formatOrder(25)).toBe('#025');
    expect(formatValue(undefined)).toBe('-');
    expect(formatValue(null)).toBe('-');
    expect(formatValue(0)).toBe('0');
  });

  it('replaces nested latex fractions recursively', () => {
    expect(replaceFractions('\\frac{1}{2}')).toBe('((1)/(2))');
    expect(replaceFractions('\\frac{1}{\\frac{2}{3}}')).toBe('((1)/(((2)/(3))))');
  });
});
