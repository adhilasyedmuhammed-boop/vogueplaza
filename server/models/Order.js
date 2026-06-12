const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        brand: String,
        image: String,
        price: Number,
        size: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      email: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },
    paymentMethod: { type: String, enum: ['cod', 'upi', 'card', 'netbanking', 'razorpay'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    trackingNumber: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
