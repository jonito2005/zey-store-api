const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
  checkout,
  updatePaymentStatus,
  guestCheckout,
  getAllGuestOrders,
  getMyOrders
} = require('../controllers/orderController');

// Create new order
router.post('/', authenticateToken, createOrder);

// Get user orders
router.get('/my-orders', authenticateToken, getUserOrders);

// Update order status (admin only)
router.patch('/:id/status', authenticateToken, isAdmin, updateOrderStatus);

// Get all orders (admin only)
router.get('/', authenticateToken, isAdmin, getAllOrders);

// Checkout route (user only)
router.post('/checkout', authenticateToken, checkout);

// Update payment status (admin only)
router.patch('/:id/payment', authenticateToken, isAdmin, updatePaymentStatus);

// Guest checkout (no auth required)
router.post('/guest-checkout', guestCheckout);

// Get all guest orders (admin only)
router.get('/guest-orders', authenticateToken, isAdmin, getAllGuestOrders);

// Route untuk mendapatkan order user yang login
router.get('/my-orders', authenticateToken, getMyOrders);

module.exports = router;