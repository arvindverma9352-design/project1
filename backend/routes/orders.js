const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().lean();
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customer, total, status, items } = req.body;

    if (!customer || !total) {
      return res.status(400).json({ success: false, message: 'Customer and total are required.' });
    }

    const newOrder = new Order({
      customer,
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

module.exports = router;
