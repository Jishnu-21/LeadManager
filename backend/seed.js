const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path to your User model
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  seedUsers(); // Call seedUsers after successful connection
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const seedUsers = async () => {
  const users = [
    {
      username: 'Jishnu',
      email: 'jishnu.jp@3rdShade.in',
      role: 'Operational'
    },
    {
      username: 'ManagementUser',
      email: 'management@example.com',
      role: 'Management'
    },
    {
      username: 'SalesUser',
      email: 'sales@example.com',
      role: 'Sales'
    },
    {
      username: 'OperationalUser2',
      email: 'operational2@example.com',
      role: 'Operational'
    },
    {
      username: 'ManagementUser2',
      email: 'management2@example.com',
      role: 'Management'
    }
  ];

  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert new users
    await User.insertMany(users);
    console.log('Users have been successfully seeded!');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// We don't need to call seedUsers() here as it's called after successful connection