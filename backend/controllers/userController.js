// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Lead = require('../models/Lead');

const router = express.Router();

// Helper function to generate tokens
const generateTokens = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
        throw new Error('JWT secrets are not defined in environment variables');
    }

    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' } // Short-lived access token
    );
    const refreshToken = jwt.sign(
        { id: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // Long-lived refresh token
    );
    return { accessToken, refreshToken };
};

// @desc    Login user
// @route   POST /api/user/login
// @access  Public
const login = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Refresh access token
// @route   POST /api/user/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    try {
        const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get leads by BDA name
const getLeadsByBDA = async (req, res) => {
    try {
        const { bdaName } = req.query;
        const leads = await Lead.find({ bdaName });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads', error: error.message });
    }
};

// Update a lead
const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLead = await Lead.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead', error: error.message });
    }
};


module.exports = {
    login,
    refreshToken,
    getAllUsers,
};