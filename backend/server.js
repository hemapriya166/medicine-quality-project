const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
const medicineRoutes = require('./routes/medicines');
const testResultRoutes = require('./routes/testResults');
const alertRoutes = require('./routes/alerts');
const authRoutes = require('./routes/auth');
const consumableRoutes = require('./routes/consumables');

app.use('/api/medicines', medicineRoutes);
app.use('/api/test-results', testResultRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/consumables', consumableRoutes);
app.get('/', (req, res) => {
  res.send('Medicine Quality Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});