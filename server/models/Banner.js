const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    label: { type: String, default: '' },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    cta: { type: String, default: 'Shop Now' },
    link: { type: String, default: '/products' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
