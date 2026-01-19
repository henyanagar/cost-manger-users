// Main Express application configuration
const express = require('express');
const { requestLogger } = require('./middlewares/logger');
const apiRouter = require('./routes/user');

const app = express();

// Middleware
app.use(express.json());

// Logging middleware - logs every HTTP request
app.use(requestLogger);

// Routes
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    id: 'NOT_FOUND',
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    id: 'SERVER_ERROR',
    message: err.message || 'Internal server error'
  });
});

module.exports = app;