const taskStore = require('../src/store/taskStore');

beforeEach(() => taskStore.reset());

describe('taskStore.create', () => {
  it('creates a task with defaults', () => {
    const task = taskStore.create({ title: 'Write tests' });

    expect(task).toEqual({
      id: expect.any(String),
      title: 'Write tests',
      description: '',
      status: 'todo',
      createdAt: expect.any(String),
    });
  });

  it('generates a unique id for each task', () => {
    const a = taskStore.create({ title: 'A' });
    const b = taskStore.create({ title: 'B' });

    expect(a.id).not.toBe(b.id);
  });
});
