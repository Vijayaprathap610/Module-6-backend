import express from "express";
import jwt from "jsonwebtoken";
import User from '../models/user.js';


const router = express.Router();

const sign = (user) =>
    jwt.sign(
        { id: user._id, role: user.role, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already in use' });
        const user = await User.create({ name, email, password, role: role || 'passenger' });
        const token = sign(user);
        res.status(201).json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(400).json({ message: 'Invalid credentials' });
        const token = sign(user);
        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


// Seed an admin (optional local use)
router.post('/seed-admin', async (req, res) => {
    try {
        const { name = 'Admin', email = 'admin@fd360.com', password = 'Admin@123' } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Admin exists' });
        const admin = await User.create({ name, email, password, role: 'admin' });
        res.status(201).json({ id: admin._id });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

export default router;




