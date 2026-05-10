export function isBrowser(): boolean {
  return globalThis.window !== undefined;
}

export function isDocument(): boolean {
  return typeof document !== 'undefined';
}

export function documentCookie(): string {
  /* istanbul ignore next -- exercised only outside the jsdom/browser test environment. */
  return isDocument() ? document.cookie : '';
}

export function domain(): string {
  /* istanbul ignore next -- exercised only outside the jsdom/browser test environment. */
  return isBrowser() ? globalThis.window.location.hostname : '.localhost';
}
