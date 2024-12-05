const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');

const GuestOrder = sequelize.define('GuestOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  guest_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guest_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guest_phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shipping_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'failed'),
    defaultValue: 'unpaid'
  }
}, {
  tableName: 'guest_orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

GuestOrder.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });

module.exports = GuestOrder; 