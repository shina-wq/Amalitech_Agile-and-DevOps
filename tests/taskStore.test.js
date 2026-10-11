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

describe('taskStore.findAll', () => {
  it('returns all tasks in creation order', () => {
    const a = taskStore.create({ title: 'A' });
    const b = taskStore.create({ title: 'B' });

    expect(taskStore.findAll()).toEqual([a, b]);
  });

  it('returns a copy so callers cannot mutate the store', () => {
    taskStore.create({ title: 'A' });
    taskStore.findAll().pop();

    expect(taskStore.findAll()).toHaveLength(1);
  });
});

describe('taskStore.updateStatus', () => {
  it('updates the status of an existing task', () => {
    const { id } = taskStore.create({ title: 'A' });

    expect(taskStore.updateStatus(id, 'done')).toMatchObject({ id, status: 'done' });
    expect(taskStore.findAll()[0].status).toBe('done');
  });

  it('returns null when the task does not exist', () => {
    expect(taskStore.updateStatus('missing-id', 'done')).toBeNull();
  });
});

describe('taskStore.remove', () => {
  it('removes an existing task and returns true', () => {
    const a = taskStore.create({ title: 'A' });
    const b = taskStore.create({ title: 'B' });

    expect(taskStore.remove(a.id)).toBe(true);
    expect(taskStore.findAll()).toEqual([b]);
  });

  it('returns false when the task does not exist', () => {
    expect(taskStore.remove('missing-id')).toBe(false);
  });
});
