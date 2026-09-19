const express = require('express');
const Setting = require('../models/Setting');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/settings/store-status
router.get('/store-status', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'store_status' });
    return res.json({ success: true, isOpen: setting ? setting.isOpen : true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings/store-status
router.put('/store-status', verifyAdmin, async (req, res) => {
  try {
    const { isOpen } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: 'store_status' },
      { isOpen: !!isOpen },
      { upsert: true, new: true }
    );
    return res.json({ success: true, isOpen: setting.isOpen });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

