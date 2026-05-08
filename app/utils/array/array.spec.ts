import { shuffle, uniqueById } from './array';

describe('array utils', () => {
  const originalRandom = Math.random;

  afterEach(() => {
    Math.random = originalRandom;
  });

  it('shuffles without mutating the original array', () => {
    Math.random = jest.fn()
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const source = [1, 2, 3, 4];
    const result = shuffle(source);

    expect(source).toEqual([1, 2, 3, 4]);
    expect(result).toEqual([2, 3, 4, 1]);
  });

  it('keeps the first item for each id', () => {
    expect(uniqueById([
      { id: '1', name: 'first' },
      { id: '2', name: 'second' },
      { id: '1', name: 'duplicate' },
    ])).toEqual([
      { id: '1', name: 'first' },
      { id: '2', name: 'second' },
    ]);
  });
});
