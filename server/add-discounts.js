require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const products = await Product.find({});
  console.log(`Found ${products.length} products`);

  for (const p of products) {
    // Set originalPrice as 25% higher than current price (so 20% discount)
    const originalPrice = Math.round(p.price * 1.25);
    const discount = 20;
    await Product.updateOne(
      { _id: p._id },
      { $set: { originalPrice, discount } }
    );
    console.log(`Updated: ${p.name} — MRP ₹${originalPrice}, Sale ₹${p.price}, ${discount}% off`);
  }

  console.log('\nDone! All products now have 20% discount.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
