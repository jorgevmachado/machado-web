import { isStrongPassword, isValidEmail } from '../validation';

describe('isValidEmail', () => {
  it('returns true for a valid email address', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('first.last+tag@sub.domain.org')).toBe(true);
  });

  it('returns false when the @ symbol is missing', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('returns false when the domain part is missing', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('returns false when the local part is missing', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('returns false when TLD is missing', () => {
    expect(isValidEmail('user@example')).toBe(false);
  });
});

describe('isStrongPassword', () => {
  it('returns true for a password meeting all criteria', () => {
    // ≥7 chars, at least one uppercase, at least one special char
    expect(isStrongPassword('Secure@1')).toBe(true);
    expect(isStrongPassword('MyP@ssword!')).toBe(true);
  });

  it('returns false when the password is too short (< 7 chars)', () => {
    expect(isStrongPassword('Ab@12')).toBe(false);
  });

  it('returns false when the password has no uppercase letter', () => {
    expect(isStrongPassword('secure@123')).toBe(false);
  });

  it('returns false when the password has no special character', () => {
    expect(isStrongPassword('SecurePass1')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isStrongPassword('')).toBe(false);
  });
});
