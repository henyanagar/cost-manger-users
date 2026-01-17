require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // או ../modules/user אם זה השם אצלך
console.log('bkals');
// ===============================
// GET /api/users  – רשימת משתמשים
// ===============================
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ id: 0, message: 'db error' });
    }
});

// =====================================
// GET /api/users/:id – פרטי משתמש ספציפי
// =====================================
router.get('/users/:id', async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId)) {
            return res.status(400).json({ id: 0, message: 'invalid id' });
        }

        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ id: userId, message: 'user not found' });
        }
        const costApiUrl = process.env.COST_API_URL;
        console.log(`${costApiUrl}/api/total/${userId}`);
        const response= await fetch(`${costApiUrl}/api/total/${userId}`);

        // 2. Check if the request was successful
        if (!response.ok) {
            throw new Error(`Cost Service responded with status: ${response.status}`);
        }
        // 3. Parse the result into a JSON object
        const result = await response.json();
        console.log(result);
        // 4. Access the 'total' property from your Cost Process response
        const totalValue = result.total;

        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: totalValue
        });
    } catch (err) {
        res.status(500).json({ id: 0, message: 'db error' });
    }
});

// ===========================
// POST /api/add – הוספת משתמש
// ===========================

router.post('/add', async (req, res) => {
    try {
        console.log('adasda');
        const { id, first_name, last_name, birthday } = req.body;
        const userId = Number(id);

        if (!Number.isInteger(userId)) {
            return res.status(400).json({ id: 0, message: 'invalid id' });
        }
        if (!first_name || !last_name || !birthday) {
            return res.status(400).json({ id: userId, message: 'missing fields' });
        }

        const exists = await User.findOne({ id: userId });
        if (exists) {
            return res.status(400).json({ id: userId, message: 'user already exists' });
        }


        const newUser = await User.create({

            id: userId,
            first_name,
            last_name,
            birthday: new Date(birthday)
        });

        res.json(newUser);
    } catch (err) {
        res.status(500).json({ id: 0, message: 'db error' });
    }
});

module.exports = router;
