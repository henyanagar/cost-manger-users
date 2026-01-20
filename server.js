// Server entry point - starts the Express application
const app = require('./app');
const mongoose = require('mongoose');
const { pino } = require('./middlewares/logger');
require('dotenv').config();

const PORT = process.env.PORT || 3003;

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Users Service: Connected to MongoDB');
        pino.info('Users Service connected to MongoDB');

        // Start server after DB connection
        app.listen(PORT, () => {
            console.log(`Users service running on port ${PORT}`);
            pino.info(`Users service started on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        pino.error('MongoDB connection failed');
        process.exit(1);
    });