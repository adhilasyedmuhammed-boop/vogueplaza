const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    title: { type: String, default: '' },
    isApproved: { type: Boolean, default: true },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
