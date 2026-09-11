const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: 'images/vegback.png' },
  category: { type: String, default: 'Vegetables' },
  available: { type: Boolean, default: true },
  prices: {
    '250g': { type: Number, default: 0 },
    '500g': { type: Number, default: 0 },
    '1kg': { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
