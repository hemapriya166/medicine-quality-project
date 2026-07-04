const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// GET all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH mark an alert as resolved
router.patch('/:id/resolve', async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    res.json(updatedAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;