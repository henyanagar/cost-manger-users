// Routes for user endpoints
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');
const { pino } = require('../middlewares/logger');

// GET /api/users - get all users
router.get('/users', async (req, res) => {
    try {
        pino.info('Accessing GET /api/users endpoint');

        const users = await User.find({});
        res.json(users);
    } catch (err) {
        pino.error(`Error fetching users: ${err.message}`);
        res.status(500).json({
            id: 'USER_LIST_ERROR',
            message: 'Unable to fetch users'
        });
    }
});

// GET /api/users/:id - get specific user with total costs
router.get('/users/:id', async (req, res) => {
    try {
        const userId = Number(req.params.id);
        pino.info(`Accessing GET /api/users/${userId} endpoint`);

        // Validate ID is a number
        if (!Number.isInteger(userId)) {
            res.locals.errorId = 'INVALID_ID';
            return res.status(400).json({
                id: 'INVALID_ID',
                message: 'User ID must be a valid integer'
            });
        }

        // Find user in database
        const user = await User.findOne({ id: userId });
        if (!user) {
            res.locals.errorId = 'USER_NOT_FOUND';
            return res.status(404).json({
                id: 'USER_NOT_FOUND',
                message: 'User not found'
            });
        }

        // Calculate total costs directly from database
        const costs = await Cost.find({ userid: userId });
        const total = costs.reduce((sum, cost) => sum + cost.sum, 0);

        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });
    } catch (err) {
        pino.error(`Error fetching user details: ${err.message}`);
        res.status(500).json({
            id: 'USER_DETAIL_ERROR',
            message: 'Unable to fetch user details'
        });
    }
});

// POST /api/add - add new user
router.post('/add', async (req, res) => {
    try {
        pino.info('Accessing POST /api/add endpoint');

        const { id, first_name, last_name, birthday } = req.body;

        // Validate required fields
        if (!id || !first_name || !last_name || !birthday) {
            res.locals.errorId = 'VALIDATION_ERROR';
            return res.status(400).json({
                id: 'VALIDATION_ERROR',
                message: 'Missing required fields: id, first_name, last_name, birthday'
            });
        }

        const userId = Number(id);

        // Validate ID is a number
        if (!Number.isInteger(userId)) {
            res.locals.errorId = 'INVALID_ID';
            return res.status(400).json({
                id: 'INVALID_ID',
                message: 'User ID must be a valid integer'
            });
        }

        // Check if user already exists
        const exists = await User.findOne({ id: userId });
        if (exists) {
            res.locals.errorId = `USER_EXISTS`;
            return res.status(400).json({
                id: 'USER_EXISTS',
                message: `User with ID ${userId} already exists`
            });
        }

        // Create new user
        const newUser = await User.create({
            id: userId,
            first_name: first_name,
            last_name: last_name,
            birthday: new Date(birthday)
        });

        pino.info(`User ${userId} created successfully`);
        res.status(201).json(newUser);

    } catch (err) {
        pino.error(`Error adding user: ${err.message}`);
        res.status(500).json({
            id: 'USER_ADD_ERROR',
            message: 'Unable to create user'
        });
    }
});

module.exports = router;