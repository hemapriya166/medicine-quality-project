const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  testType: {
    type: String,
    enum: ['Medicine', 'Consumable'],
    default: 'Medicine'
  },
  // Medicine fields
  medicineName: { type: String },
  batchNumber: { type: String },
  purity: { type: Number },
  pH: { type: Number },
  moistureContent: { type: Number },
  dissolutionRate: { type: Number },
  appearance: {
    type: String,
    enum: ['Good', 'Poor'],
  },
  // Consumable fields
  consumableName: { type: String },
  category: { type: String },
  condition: {
    type: String,
    enum: ['Good', 'Damaged', 'Expired']
  },
  sterilityCheck: {
    type: String,
    enum: ['Pass', 'Fail']
  },
  physicalIntegrity: {
    type: String,
    enum: ['Intact', 'Damaged']
  },
  expiryDate: { type: Date },
  // Common fields
  status: {
    type: String,
    enum: ['Pass', 'Fail'],
    required: true
  },
  failReasons: [{ type: String }],
  sideEffects: [{ type: String }],
  photoUrl: {
    type: String,
    default: null
  },
  testDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);