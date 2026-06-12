const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    addresses: [addressSchema],
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
