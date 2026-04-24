import request from 'supertest';
import app from '../app';

describe('GET /api/users', () => {
  describe('defaults', () => {
    it('returns 200 with all users when no params supplied', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(5);
    });

    it('response contains data array and paging object', async () => {
      const res = await request(app).get('/api/users');
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('paging');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('paging.totalResults equals full dataset size', async () => {
      const res = await request(app).get('/api/users');
      expect(res.body.paging.totalResults).toBe(5);
    });

    it('no previous link on page 1 by default', async () => {
      const res = await request(app).get('/api/users');
      expect(res.body.paging.previous).toBeUndefined();
    });

    it('no next link when all results fit on one page', async () => {
      const res = await request(app).get('/api/users');
      expect(res.body.paging.next).toBeUndefined();
    });
  });

  describe('pagination', () => {
    it('returns correct slice for page=1&size=2', async () => {
      const res = await request(app).get('/api/users?page=1&size=2');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('returns different slice for page=2&size=2', async () => {
      const p1 = await request(app).get('/api/users?page=1&size=2');
      const p2 = await request(app).get('/api/users?page=2&size=2');
      expect(p2.body.data[0]).not.toEqual(p1.body.data[0]);
    });

    it('returns 200 with empty data when page exceeds range', async () => {
      const res = await request(app).get('/api/users?page=99&size=10');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.paging.totalResults).toBe(5);
    });

    it('includes next link when more pages exist', async () => {
      const res = await request(app).get('/api/users?page=1&size=2');
      expect(res.body.paging.next).toBeDefined();
    });

    it('omits next link on last page', async () => {
      const res = await request(app).get('/api/users?page=3&size=2');
      expect(res.body.paging.next).toBeUndefined();
    });

    it('includes previous link when page > 1', async () => {
      const res = await request(app).get('/api/users?page=2&size=2');
      expect(res.body.paging.previous).toBeDefined();
    });

    it('omits previous link on page 1', async () => {
      const res = await request(app).get('/api/users?page=1&size=2');
      expect(res.body.paging.previous).toBeUndefined();
    });

    it('paging URIs are valid URL strings', async () => {
      const res = await request(app).get('/api/users?page=2&size=2');
      expect(() => new URL(res.body.paging.next)).not.toThrow();
      expect(() => new URL(res.body.paging.previous)).not.toThrow();
    });
  });

  describe('sorting', () => {
    it('returns 200 and sorted data for sort=name', async () => {
      const res = await request(app).get('/api/users?sort=name');
      expect(res.status).toBe(200);
      const names = res.body.data.map((u: { name: string }) => u.name);
      expect(names).toEqual([...names].sort());
    });

    it('returns sorted data for sort=name&order=desc', async () => {
      const res = await request(app).get('/api/users?sort=name&order=desc');
      const names = res.body.data.map((u: { name: string }) => u.name);
      expect(names).toEqual([...names].sort().reverse());
    });

    it('returns sorted data for sort=id', async () => {
      const res = await request(app).get('/api/users?sort=id');
      const ids = res.body.data.map((u: { id: number }) => u.id);
      expect(ids).toEqual([0, 1, 2, 3, 4]);
    });

    it('returns sorted data for sort=id&order=desc', async () => {
      const res = await request(app).get('/api/users?sort=id&order=desc');
      const ids = res.body.data.map((u: { id: number }) => u.id);
      expect(ids).toEqual([4, 3, 2, 1, 0]);
    });
  });

  describe('validation — invalid params', () => {
    it('returns 400 for invalid sort field', async () => {
      const res = await request(app).get('/api/users?sort=invalid');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for invalid order value', async () => {
      const res = await request(app).get('/api/users?order=sideways');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for page=0', async () => {
      const res = await request(app).get('/api/users?page=0');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for page=-1', async () => {
      const res = await request(app).get('/api/users?page=-1');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for page=abc', async () => {
      const res = await request(app).get('/api/users?page=abc');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for size=0', async () => {
      const res = await request(app).get('/api/users?size=0');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for size exceeding MAX_SIZE', async () => {
      const res = await request(app).get('/api/users?size=101');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for size=abc', async () => {
      const res = await request(app).get('/api/users?size=abc');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('400 body has descriptive error message', async () => {
      const res = await request(app).get('/api/users?sort=unknown');
      expect(typeof res.body.error).toBe('string');
      expect(res.body.error.length).toBeGreaterThan(0);
    });
  });

  describe('paging URIs', () => {
    it('next URI increments page by exactly 1', async () => {
      const res = await request(app).get('/api/users?page=1&size=2');
      const nextUrl = new URL(res.body.paging.next);
      expect(nextUrl.searchParams.get('page')).toBe('2');
    });

    it('previous URI decrements page by exactly 1', async () => {
      const res = await request(app).get('/api/users?page=3&size=2');
      const prevUrl = new URL(res.body.paging.previous);
      expect(prevUrl.searchParams.get('page')).toBe('2');
    });

    it('URIs carry sort param when sort was in original request', async () => {
      const res = await request(app).get('/api/users?page=1&size=2&sort=name&order=asc');
      const nextUrl = new URL(res.body.paging.next);
      expect(nextUrl.searchParams.get('sort')).toBe('name');
      expect(nextUrl.searchParams.get('order')).toBe('asc');
    });

    it('URIs carry size param from original request', async () => {
      const res = await request(app).get('/api/users?page=1&size=2');
      const nextUrl = new URL(res.body.paging.next);
      expect(nextUrl.searchParams.get('size')).toBe('2');
    });
  });
});
