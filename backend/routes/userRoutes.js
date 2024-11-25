const express = require('express');
const { login, getChannelPartners } = require('../controllers/userController');

const router = express.Router();

// Route to authenticate user
router.post('/login',login );


// Add more routes for filtering, updating, and deleting leads as needed

module.exports = router;
