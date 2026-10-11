const express = require('express');
const request = require('supertest');
const { errorHandler } = require('../src/middleware/errorHandlers');

describe('errorHandler', () => {
  it('returns 500 with a generic message and logs the error details', async () => {
    const log = jest.fn();
    const error = new Error('Database exploded');

    const app = express();
    app.get('/boom', () => {
      throw error;
    });
    app.use(errorHandler(log));

    const res = await request(app).get('/boom');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('GET /boom failed:'), error);
  });
});
