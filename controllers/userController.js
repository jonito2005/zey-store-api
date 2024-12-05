const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');
const bcrypt = require('bcryptjs');

// Get All Users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
    return successResponse(res, 'Users retrieved successfully', users);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve users');
  }
};

// Get User by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    return successResponse(res, 'User retrieved successfully', user);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve user');
  }
};

// Update User (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Validasi email jika diubah
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse(res, 'Email already in use', 400);
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    await user.save();

    return successResponse(res, 'User updated successfully', {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  } catch (error) {
    console.error('Update user error:', error);
    return errorResponse(res, 'Failed to update user');
  }
};

// Delete User (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    await user.destroy();
    return successResponse(res, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    return errorResponse(res, 'Failed to delete user');
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    return successResponse(res, 'User profile retrieved successfully', user);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    return successResponse(res, 'Profile updated successfully', {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};