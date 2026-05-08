import { omitUndefined } from './object';

describe('object utils', () => {
  it('removes only undefined values', () => {
    expect(omitUndefined({
      keepNull: null,
      keepFalse: false,
      keepZero: 0,
      remove: undefined,
    })).toEqual({
      keepNull: null,
      keepFalse: false,
      keepZero: 0,
    });
  });
});
