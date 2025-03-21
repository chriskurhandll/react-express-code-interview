import request from 'supertest';
import app from '../app'; 

describe('GET /api/users', () => {
  it('should return users sorted by name', async () => {
    const response = await request(app).get('/api/users?sort=name');
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe('Andrew'); // Assuming that Andrew is first in sorted order
  });

  it('should return users sorted by id', async () => {
    const response = await request(app).get('/api/users?sort=id');
    expect(response.status).toBe(200);
    expect(response.body[0].id).toBe(0); // Assuming id=0 is first in sorted order
  });

  it('should return an error for invalid sort field', async () => {
    const response = await request(app).get('/api/users?sort=invalidField');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid sort field: invalidField');
  });
});
