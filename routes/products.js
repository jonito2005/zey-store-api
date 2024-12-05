const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', authenticateToken, isAdmin, upload.single('image'), createProduct);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

module.exports = router;