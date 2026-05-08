import { documentCookie, domain, isBrowser, isDocument } from './window';

describe('window utils', () => {
  it('detects browser globals in jsdom', () => {
    expect(isBrowser()).toBe(true);
    expect(isDocument()).toBe(true);
  });

  it('reads document cookie and current domain', () => {
    document.cookie = 'session=test-token';

    expect(documentCookie()).toContain('session=test-token');
    expect(domain()).toBe(window.location.hostname);
  });

});
