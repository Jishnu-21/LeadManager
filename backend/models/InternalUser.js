const mongoose = require('mongoose');

const internalUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('InternalUser', internalUserSchema);

