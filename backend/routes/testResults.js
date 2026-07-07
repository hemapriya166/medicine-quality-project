const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');
const Alert = require('../models/Alert');
const { upload } = require('../cloudinary');

// Side effects database
const sideEffectsDB = {
  'paracetamol': [
    'Liver damage if substandard',
    'Ineffective pain relief',
    'Nausea and vomiting',
    'Allergic reactions'
  ],
  'amoxicillin': [
    'Antibiotic resistance',
    'Reduced infection fighting ability',
    'Diarrhea and stomach upset',
    'Skin rashes'
  ],
  'ibuprofen': [
    'Stomach ulcers',
    'Kidney damage',
    'Ineffective pain relief',
    'Increased bleeding risk'
  ],
  'metformin': [
    'Uncontrolled blood sugar',
    'Lactic acidosis risk',
    'Digestive problems',
    'Vitamin B12 deficiency'
  ],
  'aspirin': [
    'Increased bleeding risk',
    'Stomach irritation',
    'Ineffective blood thinning',
    'Reye syndrome risk'
  ],
  'cetirizine': [
    'Ineffective allergy relief',
    'Drowsiness',
    'Dry mouth',
    'Headache'
  ]
};

// GET all test results
router.get('/', async (req, res) => {
  try {
    const results = await TestResult.find().sort({ testDate: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit a new test result
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      testType, medicineName, batchNumber,
      purity, pH, moistureContent, dissolutionRate, appearance,
      consumableName, category, condition,
      sterilityCheck, physicalIntegrity, expiryDate
    } = req.body;

    let status = 'Pass';
    let failReasons = [];
    let sideEffects = [];
    let alertMessage = '';
    let alertSeverity = 'Warning';

    if (testType === 'Medicine') {
      // Quality checks
      if (purity < 95) {
        status = 'Fail';
        failReasons.push(`Low purity: ${purity}% (required ≥ 95%)`);
        alertSeverity = 'Critical';
      }
      if (pH < 5.5 || pH > 7.5) {
        status = 'Fail';
        failReasons.push(`pH out of range: ${pH} (required 5.5 - 7.5)`);
      }
      if (moistureContent && moistureContent > 2) {
        status = 'Fail';
        failReasons.push(`High moisture content: ${moistureContent}% (required ≤ 2%)`);
      }
      if (dissolutionRate && dissolutionRate < 85) {
        status = 'Fail';
        failReasons.push(`Low dissolution rate: ${dissolutionRate}% (required ≥ 85%)`);
      }
      if (appearance === 'Poor') {
        status = 'Fail';
        failReasons.push('Poor appearance detected');
      }

      // Get side effects if failed
      if (status === 'Fail') {
        const key = medicineName.toLowerCase().trim();
        sideEffects = sideEffectsDB[key] || [
          'Reduced therapeutic effectiveness',
          'Potential adverse reactions',
          'Risk of treatment failure',
          'Consult healthcare professional immediately'
        ];
        alertMessage = failReasons.join(' | ');
      }

    } else {
      // Consumable checks
      if (condition === 'Damaged') {
        status = 'Fail';
        failReasons.push('Consumable is damaged');
        alertSeverity = 'Warning';
      }
      if (condition === 'Expired') {
        status = 'Fail';
        failReasons.push('Consumable has expired');
        alertSeverity = 'Critical';
      }
      if (sterilityCheck === 'Fail') {
        status = 'Fail';
        failReasons.push('Sterility check failed');
        alertSeverity = 'Critical';
      }
      if (physicalIntegrity === 'Damaged') {
        status = 'Fail';
        failReasons.push('Physical integrity compromised');
      }
      if (expiryDate && new Date(expiryDate) < new Date()) {
        status = 'Fail';
        failReasons.push('Consumable expiry date has passed');
        alertSeverity = 'Critical';
      }

      if (status === 'Fail') {
        alertMessage = failReasons.join(' | ');
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
      moistureContent: moistureContent ? parseFloat(moistureContent) : null,
      dissolutionRate: dissolutionRate ? parseFloat(dissolutionRate) : null,
      appearance,
      consumableName,
      category,
      condition,
      sterilityCheck,
      physicalIntegrity,
      expiryDate,
      status,
      failReasons,
      sideEffects,
      photoUrl
    });

    const savedResult = await newResult.save();

    // Create alert if failed
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