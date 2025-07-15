const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  items: [
    {
      name: {
          type: String,
          required: true 
      },
      price: {
          type: Number,
          required: true 
      }
    }
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  gstAmount: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
