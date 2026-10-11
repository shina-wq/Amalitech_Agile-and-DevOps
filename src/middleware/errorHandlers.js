function notFound(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

function errorHandler(log = console.error) {
  // Express identifies error handlers by their four arguments, so `next` must stay.
  return (err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Malformed JSON in request body' });
    }

    log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} failed:`, err);
    res.status(500).json({ error: 'Internal server error' });
  };
}

module.exports = { notFound, errorHandler };
