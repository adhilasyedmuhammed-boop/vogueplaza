const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discount: { type: Number, required: true, min: 1, max: 90 }, // percentage
    label: { type: String, default: '' },
    minOrder: { type: Number, default: 0 }, // minimum order amount in paisa
    maxUses: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PromoCode', promoCodeSchema);
