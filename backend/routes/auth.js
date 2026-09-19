const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

router.post('/signup', authLimiter, async (req, res) => {
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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      address: address || '',
      role: role || 'customer'
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role || 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Signup successful.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        address: newUser.address || '',
        role: newUser.role || 'customer'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, mobile, identifier, password } = req.body;

    let loginEmail = email ? email.toLowerCase().trim() : '';
    let loginMobile = mobile ? String(mobile).trim() : '';

    if (identifier) {
      const cleanId = String(identifier).trim();
      if (cleanId.includes('@')) {
        loginEmail = cleanId.toLowerCase();
      } else {
        loginMobile = cleanId;
      }
    }

    if ((!loginEmail && !loginMobile) || !password) {
      return res.status(400).json({ success: false, message: 'Email/mobile and password are required.' });
    }

    const queryConditions = [];
    if (loginEmail) queryConditions.push({ email: loginEmail });
    if (loginMobile) queryConditions.push({ mobile: loginMobile });

    const user = await User.findOne({ $or: queryConditions });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email/mobile or password.' });
    }

    // Compare password (support both old plain text and new hashed passwords for migration)
    const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    
    if (!isMatch && password !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email/mobile or password.' });
    }

    // If it was a plain text match, hash it and save it for next time
    if (password === user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
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

router.get('/wishlist/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

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

router.put('/wishlist/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

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

    const user = await User.findOne({ email: email.toLowerCase(), mobile });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email and mobile number.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
