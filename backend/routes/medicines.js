const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// GET all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a new medicine
router.post('/', async (req, res) => {
  try {
    const newMedicine = new Medicine(req.body);
    const savedMedicine = await newMedicine.save();
    res.status(201).json(savedMedicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a medicine by id
router.delete('/:id', async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;