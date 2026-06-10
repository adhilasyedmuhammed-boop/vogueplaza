const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String, required: true },
    postedDate: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
