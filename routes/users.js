const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');

// Get user profile (self)
router.get('/profile', authenticateToken, getUserProfile);

// Update user profile (self)
router.put('/profile', authenticateToken, updateUserProfile);

// Admin routes
router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, isAdmin, getUserById);
router.put('/:id', authenticateToken, isAdmin, updateUser);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router;