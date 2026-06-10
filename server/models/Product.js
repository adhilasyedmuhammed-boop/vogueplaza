const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['womenswear', 'menswear', 'accessories', 'kids', 'homedecor', 'footwear']
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  sizes: [{
    type: String
  }],
  description: {
    type: String
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
