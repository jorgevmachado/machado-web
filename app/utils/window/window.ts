export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function isDocument(): boolean {
  return typeof document !== 'undefined';
}

export function documentCookie(): string {
  return isDocument() ? document.cookie : '';
}

export function domain(): string {
  return typeof isBrowser() ? window.location.hostname : '.localhost';
}