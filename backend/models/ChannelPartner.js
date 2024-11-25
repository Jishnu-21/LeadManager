const mongoose = require('mongoose');

const channelPartnerSchema = new mongoose.Schema({
    channelPartnerCode: {
        type: String,
        required: true,
        unique: true, // Ensure each partner has a unique code
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure each partner has a unique email
        lowercase: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
     password: {
        type: String,
        required: true,
    },
});

module.exports =mongoose.model('ChannelPartner',channelPartnerSchema);
