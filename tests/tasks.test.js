const request = require('supertest');
const app = require('../src/app');
const taskStore = require('../src/store/taskStore');

beforeEach(() => taskStore.reset());

describe('POST /tasks', () => {
  it('creates a task and returns 201', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Plan sprint' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Plan sprint', status: 'todo' });
    expect(res.body.id).toEqual(expect.any(String));
    expect(Date.parse(res.body.createdAt)).not.toBeNaN();
  });

  it('saves an optional description', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Plan sprint', description: 'Pick 2-3 stories' });

    expect(res.status).toBe(201);
    expect(res.body.description).toBe('Pick 2-3 stories');
  });

  it.each([
    ['missing', {}],
    ['empty', { title: '' }],
    ['whitespace only', { title: '   ' }],
    ['not a string', { title: 42 }],
  ])('returns 400 when title is %s', async (_, body) => {
    const res = await request(app).post('/tasks').send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  it('returns 400 when description is not a string', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Plan sprint', description: 7 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Description must be a string');
  });
});
