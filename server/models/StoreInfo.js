const mongoose = require('mongoose');

const businessHourSchema = new mongoose.Schema({
  day: { type: String, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
});

const storeInfoSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    businessHours: [businessHourSchema],
    aboutText: { type: String, required: true },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    paymentMethods: [String],
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StoreInfo', storeInfoSchema);
