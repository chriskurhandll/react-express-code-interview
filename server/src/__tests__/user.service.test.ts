import { getUsers } from '../services/user.service';
import { UserQueryParams } from '../types/user.types';

const BASE_URL = 'http://localhost:3001/api/users';

const defaultParams = (overrides: Partial<UserQueryParams> = {}): UserQueryParams => ({
  page: 1,
  size: 10,
  ...overrides,
});

describe('getUsers — no params', () => {
  it('returns all users in original order', () => {
    const result = getUsers(defaultParams(), BASE_URL);
    expect(result.data).toHaveLength(5);
    expect(result.data[0].name).toBe('Jorn');
  });

  it('totalResults equals full dataset count', () => {
    const result = getUsers(defaultParams(), BASE_URL);
    expect(result.paging.totalResults).toBe(5);
  });

  it('no previous on page 1', () => {
    const result = getUsers(defaultParams(), BASE_URL);
    expect(result.paging.previous).toBeUndefined();
  });

  it('no next when all results fit on one page', () => {
    const result = getUsers(defaultParams(), BASE_URL);
    expect(result.paging.next).toBeUndefined();
  });
});

describe('getUsers — sorting', () => {
  it('sorts by name ascending', () => {
    const result = getUsers(defaultParams({ sort: 'name', order: 'asc' }), BASE_URL);
    const names = result.data.map((u) => u.name);
    expect(names).toEqual([...names].sort());
  });

  it('sorts by name descending', () => {
    const result = getUsers(defaultParams({ sort: 'name', order: 'desc' }), BASE_URL);
    const names = result.data.map((u) => u.name);
    expect(names).toEqual([...names].sort().reverse());
  });

  it('sorts by id ascending', () => {
    const result = getUsers(defaultParams({ sort: 'id', order: 'asc' }), BASE_URL);
    const ids = result.data.map((u) => u.id);
    expect(ids).toEqual([0, 1, 2, 3, 4]);
  });

  it('sorts by id descending', () => {
    const result = getUsers(defaultParams({ sort: 'id', order: 'desc' }), BASE_URL);
    const ids = result.data.map((u) => u.id);
    expect(ids).toEqual([4, 3, 2, 1, 0]);
  });

  it('defaults to asc when order is omitted', () => {
    const asc = getUsers(defaultParams({ sort: 'id', order: 'asc' }), BASE_URL);
    const noOrder = getUsers(defaultParams({ sort: 'id' }), BASE_URL);
    expect(noOrder.data.map((u) => u.id)).toEqual(asc.data.map((u) => u.id));
  });
});

describe('getUsers — pagination', () => {
  it('returns correct slice for page 1, size 2', () => {
    const result = getUsers(defaultParams({ page: 1, size: 2 }), BASE_URL);
    expect(result.data).toHaveLength(2);
  });

  it('returns correct slice for page 2, size 2', () => {
    const p1 = getUsers(defaultParams({ page: 1, size: 2 }), BASE_URL);
    const p2 = getUsers(defaultParams({ page: 2, size: 2 }), BASE_URL);
    expect(p2.data[0]).not.toEqual(p1.data[0]);
    expect(p2.data).toHaveLength(2);
  });

  it('returns last partial page correctly', () => {
    const result = getUsers(defaultParams({ page: 3, size: 2 }), BASE_URL);
    expect(result.data).toHaveLength(1);
  });

  it('returns empty data when page exceeds total', () => {
    const result = getUsers(defaultParams({ page: 99, size: 10 }), BASE_URL);
    expect(result.data).toHaveLength(0);
  });

  it('totalResults always reflects full dataset, not page count', () => {
    const result = getUsers(defaultParams({ page: 2, size: 2 }), BASE_URL);
    expect(result.paging.totalResults).toBe(5);
  });

  it('totalResults correct even on empty page', () => {
    const result = getUsers(defaultParams({ page: 99, size: 10 }), BASE_URL);
    expect(result.paging.totalResults).toBe(5);
  });
});

describe('getUsers — paging links', () => {
  it('includes next when more pages exist', () => {
    const result = getUsers(defaultParams({ page: 1, size: 2 }), BASE_URL);
    expect(result.paging.next).toBeDefined();
  });

  it('omits next on last page', () => {
    const result = getUsers(defaultParams({ page: 3, size: 2 }), BASE_URL);
    expect(result.paging.next).toBeUndefined();
  });

  it('includes previous when page > 1', () => {
    const result = getUsers(defaultParams({ page: 2, size: 2 }), BASE_URL);
    expect(result.paging.previous).toBeDefined();
  });

  it('omits previous on page 1', () => {
    const result = getUsers(defaultParams({ page: 1, size: 2 }), BASE_URL);
    expect(result.paging.previous).toBeUndefined();
  });

  it('next URI increments page by 1', () => {
    const result = getUsers(defaultParams({ page: 1, size: 2 }), BASE_URL);
    expect(result.paging.next).toContain('page=2');
  });

  it('previous URI decrements page by 1', () => {
    const result = getUsers(defaultParams({ page: 3, size: 2 }), BASE_URL);
    expect(result.paging.previous).toContain('page=2');
  });

  it('URIs preserve size param', () => {
    const result = getUsers(defaultParams({ page: 1, size: 2 }), BASE_URL);
    expect(result.paging.next).toContain('size=2');
  });

  it('URIs preserve sort and order params', () => {
    const result = getUsers(defaultParams({ page: 1, size: 2, sort: 'name', order: 'desc' }), BASE_URL);
    expect(result.paging.next).toContain('sort=name');
    expect(result.paging.next).toContain('order=desc');
  });

  it('URIs omit sort when not in params', () => {
    const result = getUsers(defaultParams({ page: 1, size: 2 }), BASE_URL);
    expect(result.paging.next).not.toContain('sort=');
  });
});

describe('getUsers — combined sort + pagination', () => {
  it('applies sort before paginating', () => {
    const sorted = getUsers(defaultParams({ sort: 'id', order: 'asc', page: 1, size: 2 }), BASE_URL);
    expect(sorted.data[0].id).toBe(0);
    expect(sorted.data[1].id).toBe(1);
  });

  it('page 2 of sorted result returns correct sorted slice', () => {
    const p2 = getUsers(defaultParams({ sort: 'id', order: 'asc', page: 2, size: 2 }), BASE_URL);
    expect(p2.data[0].id).toBe(2);
    expect(p2.data[1].id).toBe(3);
  });
});
