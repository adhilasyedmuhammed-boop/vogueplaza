const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  img: { type: String, required: true },
  text: { type: String, required: true },
});

const homeDataSchema = new mongoose.Schema(
  {
    // Brand Spotlight Section
    spotlight: {
      brandName: { type: String, default: 'BURBERRY' },
      tagline: { type: String, default: 'The Art of the Trench — Iconic British Heritage & Modern Tailoring' },
      eyebrow: { type: String, default: 'Brand Spotlight' },
      videoUrl: { type: String, default: '' },
      posterImage: { type: String, default: '' },
      link: { type: String, default: '/products?brand=burberry' },
    },

    // Women's Slides (Split Banner)
    womenSlides: [slideSchema],

    // Men's Slides (Split Banner)
    menSlides: [slideSchema],

    // Contact/Store Section
    contact: {
      heading: { type: String, default: 'Our Flagship Store' },
      description: { type: String, default: '' },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
      hours: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      mapEmbedUrl: { type: String, default: '' },
    },

    // Product slider settings
    newArrivalsLimit: { type: Number, default: 12 },
    trendingLimit: { type: Number, default: 8 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomeData', homeDataSchema);
