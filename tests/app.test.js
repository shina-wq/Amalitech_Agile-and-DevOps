const request = require('supertest');
const app = require('../src/app');

describe('App', () => {
  it('returns 404 with a JSON error for an unknown route', async () => {
    const res = await request(app).get('/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Route not found' });
  });

  it('returns 400 with a JSON error for malformed JSON', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send('{"title": ');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Malformed JSON in request body' });
  });
});
