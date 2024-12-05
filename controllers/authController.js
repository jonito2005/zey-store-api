const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

// Validasi email dengan regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validasi password
const isValidPassword = (password) => {
  // Minimal 6 karakter, harus mengandung huruf dan angka
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};

// Validasi nomor telepon
const isValidPhone = (phone) => {
  // Format nomor telepon Indonesia
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
  return phoneRegex.test(phone);
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validasi field yang required
    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required', 400);
    }

    // Validasi panjang nama
    if (name.length < 3 || name.length > 50) {
      return errorResponse(res, 'Name must be between 3 and 50 characters', 400);
    }

    // Validasi format email
    if (!isValidEmail(email)) {
      return errorResponse(res, 'Invalid email format', 400);
    }

    // Validasi password
    if (!isValidPassword(password)) {
      return errorResponse(res, 'Password must be at least 6 characters and contain both letters and numbers', 400);
    }

    // Validasi nomor telepon jika ada
    if (phone && !isValidPhone(phone)) {
      return errorResponse(res, 'Invalid phone number format. Use Indonesian format (e.g., 081234567890)', 400);
    }

    // Cek email duplikat
    const existingUser = await User.findOne({ 
      where: { 
        email: email.toLowerCase() // Konversi email ke lowercase
      } 
    });
    
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }

    // Cek nomor telepon duplikat jika ada
    if (phone) {
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) {
        return errorResponse(res, 'Phone number already registered', 400);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      name: name.trim(), // Hapus spasi di awal dan akhir
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone ? phone.trim() : null,
      role: 'user'
    });

    const token = generateToken(user);
    
    return successResponse(res, 'Registration successful', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(res, 'Registration failed. Please try again later.', 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi field yang required
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }
    
    // Find user
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim() 
      } 
    });

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user);
    
    return successResponse(res, 'Login successful', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Login failed. Please try again later.', 500);
  }
};