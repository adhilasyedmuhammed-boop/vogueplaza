const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

// POST /api/orders — place a new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shipping, tax, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    if (items.length > 50) {
      return res.status(400).json({ message: 'Too many items in order' });
    }
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ message: 'Complete shipping address required' });
    }
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      return res.status(400).json({ message: 'Invalid pincode' });
    }
    if (!/^\+?[\d\s-]{10,15}$/.test(shippingAddress.phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Server-side price verification
    const productIds = items.map(i => i._id || i.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const priceMap = {};
    dbProducts.forEach(p => { priceMap[p._id.toString()] = p.price; });

    let verifiedSubtotal = 0;
    for (const item of items) {
      const pid = (item._id || item.product || '').toString();
      const dbPrice = priceMap[pid];
      if (!dbPrice) {
        return res.status(400).json({ message: `Product not found: ${item.name || pid}` });
      }
      verifiedSubtotal += dbPrice * (item.quantity || 1);
    }

    const verifiedShipping = verifiedSubtotal >= 500000 ? 0 : 9900; // Free shipping over ₹5000
    const verifiedTax = Math.round(verifiedSubtotal * 0.05);
    const verifiedTotal = verifiedSubtotal + verifiedShipping + verifiedTax;

    const allowedPayments = ['cod', 'upi', 'card', 'netbanking', 'emi'];
    const cleanPayment = allowedPayments.includes(paymentMethod) ? paymentMethod : 'cod';

    const order = await Order.create({
      user: req.user._id,
      items: items.map(i => ({
        product: i._id || i.product,
        name: String(i.name || '').slice(0, 200),
        brand: String(i.brand || '').slice(0, 100),
        size: String(i.size || 'One Size').slice(0, 20),
        quantity: Math.min(Math.max(Number(i.quantity) || 1, 1), 10),
        price: priceMap[(i._id || i.product || '').toString()] || 0,
        image: String(i.image || '').slice(0, 500),
      })),
      shippingAddress: {
        fullName: String(shippingAddress.fullName).trim().slice(0, 100),
        phone: String(shippingAddress.phone).trim().slice(0, 15),
        street: String(shippingAddress.street).trim().slice(0, 200),
        city: String(shippingAddress.city).trim().slice(0, 50),
        state: String(shippingAddress.state).trim().slice(0, 50),
        pincode: String(shippingAddress.pincode).trim(),
      },
      paymentMethod: cleanPayment,
      paymentStatus: cleanPayment === 'cod' ? 'pending' : 'paid',
      status: 'placed',
      subtotal: verifiedSubtotal,
      shipping: verifiedShipping,
      tax: verifiedTax,
      total: verifiedTotal,
      trackingHistory: [{ status: 'placed', message: 'Order placed successfully', timestamp: new Date() }],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders — user's order history
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/:id — single order detail
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id/cancel — cancel an order (only if still placed/confirmed)
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!['placed', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel order after shipping' });
    }
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
