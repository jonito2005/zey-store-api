const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');
const sequelize = require('../config/database');
const GuestOrder = require('../models/GuestOrder');

exports.createOrder = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const customer_id = req.user.id;

    // Cek ketersediaan produk
    const product = await Product.findByPk(product_id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const order = await Order.create({
      customer_id,
      product_id,
      quantity,
      status: 'pending'
    });

    return successResponse(res, 'Order created successfully', order);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: {
        customer_id: userId
      },
      attributes: [
        'id', 'customer_id', 'product_id', 'quantity', 
        'total_price', 'status', 'payment_status', 
        'shipping_address', 'created_at', 'updated_at'
      ],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, 'Orders retrieved successfully', orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    return errorResponse(res, 'Failed to retrieve orders');
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    order.status = status;
    await order.save();

    return successResponse(res, 'Order status updated successfully', order);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
          foreignKey: 'user_id'
        }
      ]
    });
    return successResponse(res, 'Orders retrieved successfully', orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    return errorResponse(res, error.message);
  }
};

exports.checkout = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const userId = req.user.id;
    const { shipping_address, items } = req.body;

    if (!shipping_address || !items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 'Invalid input data', 400);
    }

    // Karena ini single item checkout, kita ambil item pertama
    const { product_id, quantity } = items[0];
    
    // Cek produk
    const product = await Product.findByPk(product_id);
    if (!product) {
      await t.rollback();
      return errorResponse(res, `Product not found`, 404);
    }

    // Cek stok
    if (product.stock < quantity) {
      await t.rollback();
      return errorResponse(res, `Insufficient stock for ${product.name}`, 400);
    }

    const total_price = product.price * quantity;

    // Buat order
    const order = await Order.create({
      customer_id: userId,
      product_id,
      quantity,
      total_price,
      shipping_address,
      status: 'pending',
      payment_status: 'unpaid'
    }, { transaction: t });

    // Update stok
    await product.update({
      stock: product.stock - quantity
    }, { transaction: t });

    // Format pesan WhatsApp
    const whatsappMessage = 
      `Halo Admin ZeyStore! 🛍️\n\n` +
      `Saya ingin melakukan pembayaran untuk order:\n\n` +
      `📋 *Order ID:* ${order.id}\n` +
      `🏷️ *Produk:* ${product.name}\n` +
      `📦 *Jumlah:* ${quantity}\n` +
      `💰 *Total Pembayaran:* Rp ${total_price.toLocaleString('id-ID')}\n` +
      `📍 *Alamat Pengiriman:* ${shipping_address}\n\n` +
      `Mohon konfirmasi metode pembayarannya. Terima kasih! 🙏`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/6281234567890?text=${encodedMessage}`;

    await t.commit();

    // Format response
    return successResponse(res, 'Order created successfully', {
      order: {
        id: order.id,
        product: {
          name: product.name,
          price: product.price
        },
        quantity: order.quantity,
        total_price: order.total_price,
        shipping_address: order.shipping_address,
        status: order.status,
        payment_status: order.payment_status
      },
      whatsapp_link: whatsappLink
    });

  } catch (error) {
    await t.rollback();
    console.error('Checkout error:', error);
    return errorResponse(res, 'Failed to process checkout');
  }
};

// Tambah fungsi untuk update payment status (admin only)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    // Validasi input
    if (!payment_status || !['paid', 'unpaid'].includes(payment_status)) {
      return errorResponse(res, 'Invalid payment status', 400);
    }

    // Cek order exists
    const order = await Order.findByPk(id);
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Update payment status
    await order.update({ 
      payment_status,
      // Jika pembayaran sukses, update status order
      status: payment_status === 'paid' ? 'processing' : order.status 
    });

    return successResponse(res, 'Payment status updated successfully', order);
  } catch (error) {
    console.error('Update payment status error:', error);
    return errorResponse(res, 'Failed to update payment status');
  }
};

exports.guestCheckout = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { guest_name, guest_email, guest_phone, shipping_address, items } = req.body;

    // Validasi input yang lebih detail
    if (!guest_name || !guest_email || !guest_phone || !shipping_address || !items || !Array.isArray(items) || items.length === 0) {
      console.log('Received payload:', req.body); // Untuk debugging
      return errorResponse(res, 'All fields are required', 400);
    }

    // Ambil item pertama karena ini single item checkout
    const { product_id, quantity } = items[0];
    
    // Cek produk
    const product = await Product.findByPk(product_id);
    if (!product) {
      await t.rollback();
      return errorResponse(res, `Product not found`, 404);
    }

    // Cek stok
    if (product.stock < quantity) {
      await t.rollback();
      return errorResponse(res, `Insufficient stock for ${product.name}`, 400);
    }

    const total_price = product.price * quantity;

    // Buat guest order
    const order = await GuestOrder.create({
      guest_name,
      guest_email,
      guest_phone,
      product_id,
      quantity,
      total_price,
      shipping_address,
      status: 'pending',
      payment_status: 'unpaid'
    }, { transaction: t });

    // Update stok
    await product.update({
      stock: product.stock - quantity
    }, { transaction: t });

    // Format pesan WhatsApp dengan emoji yang benar
    const whatsappMessage = 
      `Halo Admin ZeyStore! 🛍️\n\n` +
      `Saya ingin melakukan pembayaran untuk order:\n\n` +
      `📋 *Order ID:* ${order.id}\n` +
      `👤 *Nama:* ${guest_name}\n` +
      `📧 *Email:* ${guest_email}\n` +
      `📱 *Phone:* ${guest_phone}\n` +
      `🏷️ *Produk:* ${product.name}\n` +
      `📦 *Jumlah:* ${quantity}\n` +
      `💰 *Total Pembayaran:* Rp ${total_price.toLocaleString('id-ID')}\n` +
      `📍 *Alamat Pengiriman:* ${shipping_address}\n\n` +
      `Mohon konfirmasi metode pembayarannya. Terima kasih! 🙏`;

    // Pastikan encoding yang benar untuk emoji
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/6281234567890?text=${encodedMessage}`;

    await t.commit();

    // Format response
    return successResponse(res, 'Order created successfully', {
      order: {
        id: order.id,
        guest_name: order.guest_name,
        guest_email: order.guest_email,
        guest_phone: order.guest_phone,
        product: {
          name: product.name,
          price: product.price
        },
        quantity: order.quantity,
        total_price: order.total_price,
        shipping_address: order.shipping_address,
        status: order.status,
        payment_status: order.payment_status
      },
      whatsapp_link: whatsappLink
    });

  } catch (error) {
    await t.rollback();
    console.error('Guest checkout error:', error);
    return errorResponse(res, 'Failed to process checkout');
  }
};

// Tambahkan fungsi untuk mendapatkan semua guest orders (admin only)
exports.getAllGuestOrders = async (req, res) => {
  try {
    const orders = await GuestOrder.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, 'Guest orders retrieved successfully', orders);
  } catch (error) {
    console.error('Error fetching guest orders:', error);
    return errorResponse(res, 'Failed to retrieve guest orders');
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: {
        customer_id: userId
      },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return successResponse(res, 'Orders retrieved successfully', orders);
  } catch (error) {
    console.error('Error getting my orders:', error);
    return errorResponse(res, 'Failed to retrieve orders');
  }
};