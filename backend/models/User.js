const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: true,
        enum:["Operational","Management","Sales"]
    },
});

module.exports = mongoose.model('User', UserSchema);

