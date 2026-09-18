const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  pin: { type: String, default: '1234', trim: true },
  dutyStatus: { type: String, enum: ['ON', 'OFF'], default: 'OFF' },
  isActive: { type: Boolean, default: true },
  assignedOrdersCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Rider', riderSchema);

