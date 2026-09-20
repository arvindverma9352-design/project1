const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const settingsRoutes = require('./routes/settings');
const ridersRoutes = require('./routes/riders');

const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: false, // Don't break React frontend
  crossOriginEmbedderPolicy: false
}));
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://project1-czw2.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://192.168.') || origin.startsWith('http://10.')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// Vegetable Mart Backend - React SPA Engine v8.1 (Production React Dist Live)
app.use(express.json());
app.use((req, res, next) => {
  const p = req.path.toLowerCase();
  if (p.endsWith('.html') || p === '/' || p.endsWith('.js') || p.endsWith('.json') || p.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}
app.use('/delivery', express.static(path.join(__dirname, 'delivery')));
app.use(express.static(path.join(__dirname, '..')));
app.use('/delivery', express.static(path.join(__dirname, 'delivery'), { index: false }));
app.use(express.static(path.join(__dirname, '..'), { index: false }));

mongoose.connect(process.env.MONGODB_URI)
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
app.use('/api/riders', ridersRoutes);

// SPA client-side routing fallback for React
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.includes('.')) {
    return next();
  }
  const reactIndex = path.resolve(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(reactIndex)) {
    return res.sendFile(reactIndex);
  }
  next();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
