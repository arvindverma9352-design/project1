const express = require('express');
const Order = require('../models/Order');
const Setting = require('../models/Setting');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // Check store status — block orders if store is closed
    const storeSetting = await Setting.findOne({ key: 'store_status' });
    if (storeSetting && storeSetting.isOpen === false) {
      return res.status(403).json({
        success: false,
        message: 'Website abhi band hai. Orders accept nahi ho rahe. Thodi der baad try karein.'
      });
    }

    const { customer, mobile, address, location, email, total, status, items } = req.body;

    if (!customer || !total) {
      return res.status(400).json({ success: false, message: 'Customer and total are required.' });
    }

    const newOrder = new Order({
      customer,
      mobile: mobile || '',
      address: address || '',
      location: location || '',
      email: email || '',
      total,
      status: status || 'Packed',
      items: items || []
    });

    await newOrder.save();

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = status ? { status } : req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({ success: true, order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({ success: true, order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
