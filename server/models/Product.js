const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: {
    type: String,
    unique: true
  },
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
  image2: String,
  image3: String,
  image4: String,
  sizes: [{
    type: String
  }],
  description: {
    type: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQty: {
    type: Number,
    default: 50
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  },
  originalPrice: {
    type: Number
  },
  discount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Auto-generate productCode before save
productSchema.pre('save', async function(next) {
  if (!this.productCode) {
    const count = await mongoose.model('Product').countDocuments();
    const prefix = this.category ? this.category.substring(0, 3).toUpperCase() : 'VP';
    this.productCode = `${prefix}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
