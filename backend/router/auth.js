const express = require('express');
const router = express.Router();
const User = require('../models/User');



router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role, preferredLanguage } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            preferredLanguage,
        });

        const token = user.getJWT();

        res.status(201).json({
            success: true,
            message: "Signup successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                preferredLanguage: user.preferredLanguage,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Signup failed",
            error: error.message,
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isValid = await user.isPassValid(password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = user.getJWT();

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                preferredLanguage: user.preferredLanguage,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
});

module.exports = router;