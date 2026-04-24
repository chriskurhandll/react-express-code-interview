import { toStringParam, parseIntParam, isValidInt, buildPagingUri } from '../utils/pagination';

describe('toStringParam', () => {
  it('returns string when value is string', () => {
    expect(toStringParam('hello')).toBe('hello');
  });

  it('returns undefined when value is undefined', () => {
    expect(toStringParam(undefined)).toBeUndefined();
  });

  it('returns undefined for array (duplicate query param)', () => {
    expect(toStringParam(['a', 'b'])).toBeUndefined();
  });

  it('returns undefined for number', () => {
    expect(toStringParam(42)).toBeUndefined();
  });
});

describe('parseIntParam', () => {
  it('returns parsed integer when value provided', () => {
    expect(parseIntParam('5', 1)).toBe(5);
  });

  it('returns default when value is undefined', () => {
    expect(parseIntParam(undefined, 10)).toBe(10);
  });

  it('returns NaN for non-numeric string', () => {
    expect(parseIntParam('abc', 1)).toBeNaN();
  });
});

describe('isValidInt', () => {
  it('returns true for value within range', () => {
    expect(isValidInt(5, 1, 10)).toBe(true);
  });

  it('returns true for value at min boundary', () => {
    expect(isValidInt(1, 1, 10)).toBe(true);
  });

  it('returns true for value at max boundary', () => {
    expect(isValidInt(10, 1, 10)).toBe(true);
  });

  it('returns false for value below min', () => {
    expect(isValidInt(0, 1, 10)).toBe(false);
  });

  it('returns false for value above max', () => {
    expect(isValidInt(11, 1, 10)).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(isValidInt(NaN, 1, 10)).toBe(false);
  });

  it('returns false for non-integer', () => {
    expect(isValidInt(1.5, 1, 10)).toBe(false);
  });
});

describe('buildPagingUri', () => {
  const BASE = 'http://localhost:3001/api/users';

  it('includes page and size', () => {
    const uri = buildPagingUri({ page: 1, size: 10 }, 2, BASE);
    expect(uri).toContain('page=2');
    expect(uri).toContain('size=10');
  });

  it('includes sort and order when provided', () => {
    const uri = buildPagingUri({ page: 1, size: 10, sort: 'name', order: 'desc' }, 2, BASE);
    expect(uri).toContain('sort=name');
    expect(uri).toContain('order=desc');
  });

  it('omits sort and order when not provided', () => {
    const uri = buildPagingUri({ page: 1, size: 10 }, 2, BASE);
    expect(uri).not.toContain('sort=');
    expect(uri).not.toContain('order=');
  });

  it('uses targetPage not params.page', () => {
    const uri = buildPagingUri({ page: 1, size: 10 }, 5, BASE);
    expect(uri).toContain('page=5');
  });

  it('returns a valid URL', () => {
    const uri = buildPagingUri({ page: 1, size: 10 }, 2, BASE);
    expect(() => new URL(uri)).not.toThrow();
  });
});
