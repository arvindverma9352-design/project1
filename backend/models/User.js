const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  key: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, default: 0 },
  image: { type: String, default: 'images/vegback.png' },
  description: { type: String, default: '' },
  category: { type: String, default: 'Vegetables' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, default: '' },
  role: { type: String, default: 'customer' },
  wishlist: { type: [wishlistItemSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
