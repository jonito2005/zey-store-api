const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');

// Definisi relasi tambahan jika diperlukan
User.hasMany(Order, {
  foreignKey: 'customer_id',
  as: 'orders'
});

Product.hasMany(Order, {
  foreignKey: 'product_id',
  as: 'orders'
});

module.exports = {
  User,
  Product,
  Order
};