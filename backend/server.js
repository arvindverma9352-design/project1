const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const settingsRoutes = require('./routes/settings');

const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://arvind:arvind5299@cluster0.wnav3z6.mongodb.net/?appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Vegetable Mart API is running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/settings', settingsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
