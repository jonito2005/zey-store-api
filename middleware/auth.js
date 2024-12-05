const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { errorResponse } = require('../utils/response');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, 'No token provided', 401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return errorResponse(res, 'Invalid token', 403);
    }
    req.user = user;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Admin access required', 403);
  }
  next();
};