require('dotenv').config();
console.log('Loaded environment variables');

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const leadRoutes = require('./routes/leadRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notRoutes');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const https = require('https');
const Pusher = require('pusher');
const path = require('path')
const initPaymentDueCheck = require('./cron/paymentDueCheck');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// Create axios instance with SSL verification disabled
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

// Pusher setup
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

// Middleware
app.use(cors({
  origin: 'https://leadmanager-isoq.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Example route to trigger a Pusher event
app.post('/api/trigger-notification', (req, res) => {
  pusher.trigger('notifications', 'new-notification', {
    message: 'New notification available'
  });
  res.json({ message: 'Notification triggered' });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export pusher instance for use in other files
module.exports = { pusher, app };

initPaymentDueCheck();
