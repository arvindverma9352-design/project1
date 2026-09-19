const express = require('express');
const Order = require('../models/Order');
const Setting = require('../models/Setting');
const { verifyToken, verifyRiderOrAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const { riderId, riderPhone, userId } = req.query;
    let filter = {};

    // Admin can see everything unless they filter.
    // Riders can see their own orders.
    // Customers can see their own orders.

    if (req.user.role === 'admin') {
      if (riderId) {
        filter.deliveryBoyId = riderId;
      }
      if (userId) {
        filter.userId = userId;
      }
    } else if (req.user.role === 'rider') {
      // Rider is restricted to their assigned orders
      filter.deliveryBoyId = req.user.id;
    } else {
      // Customer is restricted to their own orders
      filter.userId = req.user.id;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    } catch (err) {}
  }
  next();
};

router.post('/', optionalAuth, async (req, res) => {
  try {
    // Check store status — block orders if store is closed
    const storeSetting = await Setting.findOne({ key: 'store_status' });
    if (storeSetting && storeSetting.isOpen === false) {
      return res.status(403).json({
        success: false,
        message: 'Website abhi band hai. Orders accept nahi ho rahe. Thodi der baad try karein.'
      });
    }

    const { customer, mobile, phone, address, location, email, items } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer details and items are required.' });
    }

    let calculatedSubtotal = 0;
    const validatedItems = [];
    const Product = require('../models/Product');

    for (const item of items) {
      const product = await Product.findOne({ key: item.name });
      if (!product) continue; 

      let realPrice = 0;
      if (item.weight === '250g') realPrice = product.prices?.['250g'] || 0;
      else if (item.weight === '500g') realPrice = product.prices?.['500g'] || 0;
      else realPrice = product.prices?.['1kg'] || product.price || 0;

      const itemTotal = realPrice * (item.quantity || 1);
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        name: product.key,
        title: product.title,
        price: realPrice,
        weight: item.weight || '1kg',
        quantity: item.quantity || 1,
        total: itemTotal
      });
    }

    const deliveryFee = calculatedSubtotal > 0 ? 10 : 0;
    const calculatedTotal = calculatedSubtotal + deliveryFee;

    const newOrder = new Order({
      userId: req.user ? req.user.id : (req.body.userId || null),
      customer,
      mobile: mobile || phone || '',
      address: address || '',
      location: location || '',
      email: email || '',
      total: calculatedTotal,
      subtotal: calculatedSubtotal,
      deliveryFee: deliveryFee,
      status: 'Received',
      items: validatedItems
    });

    await newOrder.save();

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', verifyRiderOrAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If rider, ONLY allow changing status to Delivered
    if (req.user.role === 'rider') {
      const order = await Order.findById(req.params.id);
      if (!order || String(order.deliveryBoyId) !== String(req.user.id)) {
         return res.status(403).json({ success: false, message: 'Forbidden: Order not assigned to you' });
      }
      // Rider can only update status
      if (updateData.status) {
         await Order.findByIdAndUpdate(req.params.id, { status: updateData.status });
         return res.json({ success: true });
      }
      return res.status(400).json({ success: false });
    }

    // Admin
    if (updateData.deliveryBoyId && !updateData.assignedAt) {
      updateData.assignedAt = new Date();
    }

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

router.put('/:id', verifyRiderOrAdmin, async (req, res) => {
  try {
    if (req.user.role === 'rider') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

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
