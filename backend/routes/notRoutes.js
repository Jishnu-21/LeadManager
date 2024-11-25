const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  createNotification,
  deleteNotification
} = require('../controllers/notifivationController');

router.get('/', getNotifications);
router.patch('/:id', markAsRead);
router.post('/', createNotification);
router.delete('/:id', deleteNotification);

module.exports = router;