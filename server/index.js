require('dotenv').config({ path: '/root/dao/server/.env' });  // Adjust the path to match your server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Set up CORS to allow multiple origins (e.g., localhost and server IP)
const allowedOrigins = ['http://localhost:3000', 'http://206.189.80.118'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Parse JSON bodies
app.use(express.json());

// Database Connection - Ensure MongoDB is properly connected
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if MongoDB cannot connect
});

// Define routes for the API
app.use('/api/auth', authRoutes);

// Root Route for Backend Health Check
app.get('/', (req, res) => {
  res.send('Backend server is working!');
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});