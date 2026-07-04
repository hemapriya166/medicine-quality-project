const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);