function requestLogger(log = console.log) {
  return (req, res, next) => {
    const start = performance.now();

    res.on('finish', () => {
      const duration = (performance.now() - start).toFixed(1);
      log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });

    next();
  };
}

module.exports = requestLogger;
