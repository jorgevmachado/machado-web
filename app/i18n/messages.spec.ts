import { createI18nMessage, translateI18nMessage } from './messages';

describe('i18n messages', () => {
  it('creates i18n-prefixed messages', () => {
    expect(createI18nMessage('filters.name')).toBe('i18n:filters.name');
  });

  it('returns the original value when the message is empty or not prefixed', () => {
    const t = jest.fn((value: string) => value);

    expect(translateI18nMessage(t, undefined)).toBeUndefined();
    expect(translateI18nMessage(t, '')).toBe('');
    expect(translateI18nMessage(t, 'plain message')).toBe('plain message');
    expect(t).not.toHaveBeenCalled();
  });

  it('translates prefixed messages', () => {
    const t = jest.fn((value: string) => `translated:${value}`);

    expect(translateI18nMessage(t, 'i18n:pokemon.type.list.title')).toBe('translated:pokemon.type.list.title');
    expect(t).toHaveBeenCalledWith('pokemon.type.list.title');
  });
});
