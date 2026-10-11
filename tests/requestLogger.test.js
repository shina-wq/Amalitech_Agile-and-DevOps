const express = require('express');
const request = require('supertest');
const requestLogger = require('../src/middleware/requestLogger');

function createApp(log) {
  const app = express();
  app.use(requestLogger(log));
  app.get('/ok', (req, res) => res.send('ok'));
  return app;
}

describe('requestLogger', () => {
  it('logs method, path, status code and response time', async () => {
    const log = jest.fn();

    await request(createApp(log)).get('/ok?x=1');

    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toMatch(/^\S+Z GET \/ok\?x=1 200 \d+\.\dms$/);
  });

  it('logs the status code of failed requests', async () => {
    const log = jest.fn();

    await request(createApp(log)).get('/missing');

    expect(log.mock.calls[0][0]).toContain('GET /missing 404');
  });
});
