const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');
const Alert = require('../models/Alert');
const { upload } = require('../cloudinary');

// GET all test results
router.get('/', async (req, res) => {
  try {
    const results = await TestResult.find().sort({ testDate: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit a new test result with optional photo
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { testType, medicineName, batchNumber, purity, pH,
            consumableName, category, condition, expiryDate } = req.body;

    let status = 'Pass';
    let alertMessage = '';
    let alertSeverity = 'Warning';

    if (testType === 'Medicine') {
      if (purity < 95 || pH < 5.5 || pH > 7.5) {
        status = 'Fail';
        if (purity < 95) {
          alertMessage = `Low purity detected: ${purity}% (below 95% threshold)`;
          alertSeverity = 'Critical';
        } else {
          alertMessage = `pH out of range: ${pH} (acceptable range 5.5 to 7.5)`;
          alertSeverity = 'Warning';
        }
      }
    } else {
      if (condition === 'Damaged' || condition === 'Expired') {
        status = 'Fail';
        alertMessage = `Consumable ${consumableName} is ${condition}`;
        alertSeverity = condition === 'Expired' ? 'Critical' : 'Warning';
      }
      if (expiryDate && new Date(expiryDate) < new Date()) {
        status = 'Fail';
        alertMessage = `Consumable ${consumableName} has expired!`;
        alertSeverity = 'Critical';
      }
    }

    // Get photo URL if uploaded
    const photoUrl = req.file ? req.file.path : null;

    const newResult = new TestResult({
      testType,
      medicineName,
      batchNumber,
      purity: purity ? parseFloat(purity) : null,
      pH: pH ? parseFloat(pH) : null,
      consumableName,
      category,
      condition,
      expiryDate,
      status,
      photoUrl
    });

    const savedResult = await newResult.save();

    if (status === 'Fail') {
      const newAlert = new Alert({
        medicineName: testType === 'Medicine' ? medicineName : consumableName,
        batchNumber: batchNumber || 'N/A',
        message: alertMessage,
        severity: alertSeverity
      });
      await newAlert.save();
    }

    res.status(201).json(savedResult);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;