const { Router } = require('express');
const taskStore = require('../store/taskStore');

const router = Router();

router.get('/', (req, res) => {
  res.json(taskStore.findAll());
});

router.post('/', (req, res) => {
  const { title, description } = req.body ?? {};

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  }

  const task = taskStore.create({ title: title.trim(), description });
  res.status(201).json(task);
});

router.patch('/:id/status', (req, res) => {
  const { status } = req.body ?? {};

  if (!taskStore.STATUSES.includes(status)) {
    return res
      .status(400)
      .json({ error: `Status must be one of: ${taskStore.STATUSES.join(', ')}` });
  }

  const task = taskStore.updateStatus(req.params.id, status);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

router.delete('/:id', (req, res) => {
  if (!taskStore.remove(req.params.id)) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(204).end();
});

module.exports = router;
