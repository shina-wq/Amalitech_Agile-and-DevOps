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

module.exports = router;
