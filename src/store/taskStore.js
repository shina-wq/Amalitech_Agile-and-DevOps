const { randomUUID } = require('node:crypto');

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

function reset() {
  tasks = [];
}

module.exports = { create, findAll, reset };
