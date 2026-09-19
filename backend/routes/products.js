const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const products = await Product.find().lean();
    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, description, image, category, available, prices, key } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    const prodKey = key || title.toLowerCase().replace(/\s+/g, '-');
    const existingProduct = await Product.findOne({ key: prodKey });

    if (existingProduct) {
      const updated = await Product.findByIdAndUpdate(
        existingProduct._id,
        {
          title,
          description: description || '',
          image: image || 'images/vegback.png',
          category: category || 'Vegetables',
          available: typeof available === 'boolean' ? available : true,
          prices: prices || { '250g': 0, '500g': 0, '1kg': 0 }
        },
        { new: true }
      );
      return res.json({ success: true, product: updated });
    }

    const newProduct = new Product({
      key: prodKey,
      title,
      description: description || '',
      image: image || 'images/vegback.png',
      category: category || 'Vegetables',
      available: typeof available === 'boolean' ? available : true,
      prices: prices || { '250g': 0, '500g': 0, '1kg': 0 }
    });

    await newProduct.save();

    return res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const idOrKey = req.params.id;
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrKey) && idOrKey.length === 24;
    const filter = isObjectId ? { _id: idOrKey } : { key: idOrKey };

    const updateData = { ...req.body };
    if (!updateData.key && !isObjectId) {
      updateData.key = idOrKey;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const idOrKey = req.params.id;
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrKey) && idOrKey.length === 24;
    const filter = isObjectId ? { _id: idOrKey } : { key: idOrKey };

    const deletedProduct = await Product.findOneAndDelete(filter);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
