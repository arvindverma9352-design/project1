const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password, address, role } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      mobile,
      password,
      address: address || '',
      role: role || 'customer'
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Signup successful.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if ((!email && !mobile) || !password) {
      return res.status(400).json({ success: false, message: 'Email/mobile and password are required.' });
    }

    const user = await User.findOne({
      $or: [
        { email: email ? email.toLowerCase() : undefined },
        { mobile: mobile || undefined }
      ],
      password
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email/mobile or password.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address || '',
        role: user.role || 'customer'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/wishlist/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('wishlist');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/wishlist/:userId', async (req, res) => {
  try {
    const { wishlist } = req.body;

    if (!Array.isArray(wishlist)) {
      return res.status(400).json({ success: false, message: 'Wishlist must be an array.' });
    }

    const normalizedWishlist = wishlist.map((item) => ({
      key: item.key || item.name || '',
      title: item.title || item.name || 'Fresh Vegetable',
      price: Number(item.price) || 0,
      image: item.image || 'images/vegback.png',
      description: item.description || '',
      category: item.category || 'Vegetables'
    }));

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { wishlist: normalizedWishlist },
      { new: true }
    ).select('wishlist');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email, mobile, newPassword, confirmPassword } = req.body;

    if (!email || !mobile || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase(), mobile },
      { password: newPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'No account found with this email and mobile number.' });
    }

    return res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
