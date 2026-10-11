const { randomUUID } = require('node:crypto');

const STATUSES = ['todo', 'in-progress', 'done'];

let tasks = [];

function create({ title, description = '' }) {
  const task = {
    id: randomUUID(),
    title,
    description,
    status: 'todo',
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

function findAll() {
  return [...tasks];
}

function updateStatus(id, status) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;

  task.status = status;
  return task;
}

function reset() {
  tasks = [];
}

module.exports = { STATUSES, create, findAll, updateStatus, reset };
