const request = require('supertest');
const app = require('../src/app');

describe('App', () => {
  it('returns 404 for an unknown route', async () => {
    const res = await request(app).get('/does-not-exist');

    expect(res.status).toBe(404);
  });
});
