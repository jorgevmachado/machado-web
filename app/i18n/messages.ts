import type { TFunction } from 'i18next';

const I18N_MESSAGE_PREFIX = 'i18n:';

export function createI18nMessage(key: string): string {
  return `${I18N_MESSAGE_PREFIX}${key}`;
}

export function translateI18nMessage(t: TFunction, message?: string): string | undefined {
  if (!message) {
    return message;
  }

  if (!message.startsWith(I18N_MESSAGE_PREFIX)) {
    return message;
  }

  return t(message.slice(I18N_MESSAGE_PREFIX.length));
}
