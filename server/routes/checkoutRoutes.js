const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');

router.post('/', async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    const totalAmount = cart.items.reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0);

    // Create new order
    const newOrder = new Order({
      userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      totalAmount,
      paymentStatus: 'Pending' // We’ll mark this as Paid later after Razorpay
    });

    await newOrder.save();

    // Optional: clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order placed', order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
