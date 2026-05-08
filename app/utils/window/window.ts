export function isBrowser(): boolean {
  return typeof window !== 'undefined';
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
  return isBrowser() ? window.location.hostname : '.localhost';
}
