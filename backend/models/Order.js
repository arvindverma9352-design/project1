const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  mobile: { type: String, default: '' },
  address: { type: String, default: '' },
  location: { type: String, default: '' },
  email: { type: String, default: '' },
  total: { type: Number, required: true },
  status: { type: String, default: 'Packed' },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      image: String,
      weight: String
    }
  ],
  deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', default: null },
  deliveryBoyName: { type: String, default: '' },
  deliveryBoyPhone: { type: String, default: '' },
  assignedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
