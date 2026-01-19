// Server entry point - starts the Express application
const app = require('./app');
const { logger } = require('./logger/pino');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Logs service running on port ${PORT}`);
    logger.info(`Logs service started on port ${PORT}`);
});