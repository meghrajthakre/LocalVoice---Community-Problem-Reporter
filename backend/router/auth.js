const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role, preferredLanguage } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            preferredLanguage,
        });

        // Generate token
        const token = user.getJWT();

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        res.status(201).json({
            success: true,
            message: "Signup successful",
            token, // Include token for consistency with login
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                preferredLanguage: user.preferredLanguage,
            },
        });

    } catch (error) {
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: messages,
            });
        }

        res.status(500).json({
            success: false,
            message: "Signup failed",
            error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        }

        // Find user with password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Verify password
        const isValid = await user.isPassValid(password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate token
        const token = user.getJWT();

        // Set cookie (consistent with signup)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

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
            error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
        });
    }
});

router.post('/logout', (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
});

module.exports = router;