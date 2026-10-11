const express = require('express');
const requestLogger = require('./middleware/requestLogger');
const { notFound, errorHandler } = require('./middleware/errorHandlers');
const healthRouter = require('./routes/health');
const tasksRouter = require('./routes/tasks');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger());
}
app.use(express.json());
app.use('/health', healthRouter);
app.use('/tasks', tasksRouter);

app.use(notFound);
app.use(errorHandler());

module.exports = app;
