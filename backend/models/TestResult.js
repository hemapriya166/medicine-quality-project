const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  testType: {
    type: String,
    enum: ['Medicine', 'Consumable'],
    default: 'Medicine'
  },
  medicineName: { type: String },
  batchNumber: { type: String },
  purity: { type: Number },
  pH: { type: Number },
  consumableName: { type: String },
  category: { type: String },
  condition: {
    type: String,
    enum: ['Good', 'Damaged', 'Expired']
  },
  expiryDate: { type: Date },
  status: {
    type: String,
    enum: ['Pass', 'Fail'],
    required: true
  },
  testDate: {
    type: Date,
    default: Date.now
  },
  photoUrl: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);