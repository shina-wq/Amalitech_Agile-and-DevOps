const express = require('express');
const healthRouter = require('./routes/health');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(express.json());
app.use('/health', healthRouter);
app.use('/tasks', tasksRouter);

module.exports = app;
