const mongoose = require('mongoose');

const consumableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Low Stock', 'Out of Stock'],
    default: 'Available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Consumable', consumableSchema);