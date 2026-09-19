const express = require('express');
const jwt = require('jsonwebtoken');
const Rider = require('../models/Rider');
const Order = require('../models/Order');
const { verifyAdmin, verifyRiderOrAdmin } = require('../middleware/auth');

const router = express.Router();

// 1. Delivery Boy Login
router.post('/login', async (req, res) => {
  try {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({ success: false, message: 'Phone number and 4-digit PIN are required.' });
    }

    const cleanPhone = String(phone).trim();
    const cleanPin = String(pin).trim();

    let rider = await Rider.findOne({ phone: cleanPhone, pin: cleanPin, isActive: true });

    // Fallback: If no riders exist at all yet in database, create the first default captain
    if (!rider && cleanPin === '1234') {
      const totalRiders = await Rider.countDocuments();
      if (totalRiders === 0) {
        rider = new Rider({
          name: 'Default Captain',
          phone: cleanPhone,
          pin: '1234',
          dutyStatus: 'ON',
          isActive: true
        });
        await rider.save();
      }
    }

    if (!rider) {
      return res.status(401).json({ success: false, message: 'Galat Phone Number ya PIN. Kripya check karke dobara try karein.' });
    }

    const token = jwt.sign(
      { id: rider._id, role: 'rider' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      rider: {
        id: rider._id,
        name: rider.name,
        phone: rider.phone,
        dutyStatus: rider.dutyStatus,
        isActive: rider.isActive
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Get All Delivery Boys (Admin Panel)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const riders = await Rider.find({ isActive: true }).sort({ createdAt: -1 }).lean();

    // Populate active order counts for each rider
    const ridersWithCounts = await Promise.all(riders.map(async (rider) => {
      const activeCount = await Order.countDocuments({
        $or: [{ deliveryBoyId: rider._id }, { deliveryBoyPhone: rider.phone }],
        status: { $in: ['Packed', 'Out for Delivery', 'Out for delivery'] }
      });
      return {
        ...rider,
        id: rider._id,
        activeOrdersCount: activeCount
      };
    }));

    return res.json({ success: true, riders: ridersWithCounts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Add New Delivery Boy (Admin Panel)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, phone, pin } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Delivery boy name and phone are required.' });
    }

    const cleanPhone = String(phone).trim();
    const cleanPin = pin ? String(pin).trim() : '1234';

    const existingRider = await Rider.findOne({ phone: cleanPhone });
    if (existingRider) {
      if (!existingRider.isActive) {
        existingRider.isActive = true;
        existingRider.name = name.trim();
        existingRider.pin = cleanPin;
        await existingRider.save();
        return res.json({ success: true, message: 'Delivery boy reactivated successfully.', rider: existingRider });
      }
      return res.status(400).json({ success: false, message: 'Is mobile number se delivery boy already registered hai.' });
    }

    const newRider = new Rider({
      name: name.trim(),
      phone: cleanPhone,
      pin: cleanPin,
      dutyStatus: 'OFF',
      isActive: true
    });

    await newRider.save();

    return res.status(201).json({
      success: true,
      message: 'Delivery boy added successfully.',
      rider: {
        id: newRider._id,
        name: newRider.name,
        phone: newRider.phone,
        dutyStatus: newRider.dutyStatus,
        activeOrdersCount: 0
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Update Duty Status (ON / OFF)
router.put('/:id/duty', verifyRiderOrAdmin, async (req, res) => {
  try {
    if (req.user.role === 'rider' && req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const dutyStatus = req.body.onDuty === true ? 'ON' : (req.body.onDuty === false ? 'OFF' : req.body.dutyStatus);

    if (!['ON', 'OFF'].includes(dutyStatus)) {
      return res.status(400).json({ success: false, message: 'dutyStatus must be ON or OFF.' });
    }

    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      { dutyStatus },
      { new: true }
    );

    if (!rider) {
      return res.status(404).json({ success: false, message: 'Delivery boy not found.' });
    }

    return res.json({
      success: true,
      dutyStatus: rider.dutyStatus,
      rider: {
        id: rider._id,
        name: rider.name,
        phone: rider.phone,
        dutyStatus: rider.dutyStatus
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Delete Delivery Boy (Soft delete)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const rider = await Rider.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!rider) {
      return res.status(404).json({ success: false, message: 'Delivery boy not found.' });
    }

    // Unassign pending orders
    await Order.updateMany(
      {
        $or: [{ deliveryBoyId: rider._id }, { deliveryBoyPhone: rider.phone }],
        status: { $in: ['Packed', 'Out for Delivery', 'Out for delivery'] }
      },
      {
        $set: {
          deliveryBoyId: null,
          deliveryBoyName: '',
          deliveryBoyPhone: '',
          assignedAt: null
        }
      }
    );

    return res.json({ success: true, message: 'Delivery boy deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

