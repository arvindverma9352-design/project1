const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, image, category, available, prices, key } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    const existingProduct = await Product.findOne({ key: key || title.toLowerCase().replace(/\s+/g, '-') });

    if (existingProduct) {
      return res.status(400).json({ success: false, message: 'Product already exists.' });
    }

    const newProduct = new Product({
      key: key || title.toLowerCase().replace(/\s+/g, '-'),
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

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({ success: true, product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
