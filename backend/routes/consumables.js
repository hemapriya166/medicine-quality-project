const express = require('express');
const router = express.Router();
const Consumable = require('../models/Consumable');

// GET all consumables
router.get('/', async (req, res) => {
  try {
    const consumables = await Consumable.find();
    res.json(consumables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a new consumable
router.post('/', async (req, res) => {
  try {
    const newConsumable = new Consumable(req.body);
    const saved = await newConsumable.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a consumable
router.delete('/:id', async (req, res) => {
  try {
    await Consumable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Consumable deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;