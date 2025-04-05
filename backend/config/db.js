require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbUrl = process.env.MONGODB_URI; // Use environment variable
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;