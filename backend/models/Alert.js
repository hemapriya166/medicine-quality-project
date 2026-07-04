const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Critical', 'Warning'],
    required: true
  },
  resolved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);