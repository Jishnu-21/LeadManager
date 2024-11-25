const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  dueDate: { type: Date },
  read: { type: Boolean, default: false },
  amount: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);