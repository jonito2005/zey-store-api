const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/response');
const fs = require('fs');
const path = require('path');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['created_at', 'DESC']]
    });
    return successResponse(res, 'Products retrieved successfully', products);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve products');
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }
    return successResponse(res, 'Product retrieved successfully', product);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve product');
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !price || !stock) {
      return errorResponse(res, 'Name, price, and stock are required', 400);
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return errorResponse(res, 'Price must be a positive number', 400);
    }

    if (isNaN(numericStock) || numericStock < 0) {
      return errorResponse(res, 'Stock must be a non-negative number', 400);
    }

    const product = await Product.create({
      name,
      description,
      price: numericPrice,
      stock: numericStock,
      image
    });

    return successResponse(res, 'Product created successfully', product);
  } catch (error) {
    console.error('Create product error:', error);
    return errorResponse(res, 'Failed to create product');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.path : null;

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    if (price) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        return errorResponse(res, 'Price must be a positive number', 400);
      }
      product.price = numericPrice;
    }

    if (stock) {
      const numericStock = Number(stock);
      if (isNaN(numericStock) || numericStock < 0) {
        return errorResponse(res, 'Stock must be a non-negative number', 400);
      }
      product.stock = numericStock;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    
    if (image) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.image = image;
    }

    await product.save();
    return successResponse(res, 'Product updated successfully', product);
  } catch (error) {
    console.error('Update product error:', error);
    return errorResponse(res, 'Failed to update product');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.destroy();
    return successResponse(res, 'Product deleted successfully');
  } catch (error) {
    console.error('Delete product error:', error);
    return errorResponse(res, 'Failed to delete product');
  }
};