const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to database (placeholder for actual DB operation)
    // db.createUser({ email, password: hashedPassword });

    res.status(201).json({ message: 'User registered' });
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Verify user exists in database
    // const user = await db.findUserByEmail(email);

    // Compare password
    // const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;