const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

async function seedDatabase() {
  try {
    // Seed Users
    const users = [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin', 10),
        phone: '081234567891',
        role: 'admin'
      },
      {
        name: 'Customer',
        email: 'customer@gmail.com',
        password: await bcrypt.hash('customer123', 10),
        phone: '081234567892',
        role: 'user'
      }
    ];

    for (const userData of users) {
      const userExists = await User.findOne({ where: { email: userData.email } });
      if (!userExists) {
        await User.create(userData);
        console.log(`User ${userData.email} seeded!`);
      }
    }

    // Seed Products
    const products = [
      {
        name: 'Smartphone XYZ',
        description: 'Smartphone terbaru dengan spesifikasi tinggi',
        price: 3499000,
        stock: 50,
        image: 'https://cdn.pixabay.com/photo/2016/11/29/05/08/apple-1867461_960_720.jpg'
      },
      {
        name: 'Laptop ABC',
        description: 'Laptop gaming dengan performa maksimal', 
        price: 12999000,
        stock: 25,
        image: 'https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_960_720.jpg'
      },
      {
        name: 'Headphone Pro',
        description: 'Headphone wireless dengan noise cancelling',
        price: 899000,
        stock: 100,
        image: 'https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_960_720.jpg'
      },
      {
        name: 'Smart Watch',
        description: 'Smartwatch dengan fitur kesehatan lengkap',
        price: 1499000,
        stock: 75,
        image: 'https://cdn.pixabay.com/photo/2015/06/25/17/21/smart-watch-821557_960_720.jpg'
      },
      {
        name: 'Wireless Mouse',
        description: 'Mouse gaming wireless dengan DPI tinggi',
        price: 299000,
        stock: 150,
        image: 'https://cdn.pixabay.com/photo/2017/05/24/21/33/workplace-2341642_960_720.jpg'
      },
      {
        name: 'Keyboard Mechanical',
        description: 'Keyboard gaming mechanical RGB',
        price: 799000,
        stock: 80,
        image: 'https://cdn.pixabay.com/photo/2016/11/29/09/41/computer-1868991_960_720.jpg'
      },
      {
        name: 'Power Bank 10000mAh',
        description: 'Power bank dengan fast charging',
        price: 249000,
        stock: 200,
        image: 'https://cdn.pixabay.com/photo/2014/04/05/11/40/power-316582_960_720.jpg'
      },
      {
        name: 'TWS Earbuds',
        description: 'True wireless earbuds dengan suara jernih',
        price: 599000,
        stock: 120,
        image: 'https://cdn.pixabay.com/photo/2020/04/09/13/27/headphones-5021000_960_720.jpg'
      },
      {
        name: 'USB Type-C Cable',
        description: 'Kabel USB Type-C premium 2 meter',
        price: 99000,
        stock: 300,
        image: 'https://cdn.pixabay.com/photo/2017/01/22/12/07/usb-cable-2000734_960_720.jpg'
      },
      {
        name: 'Phone Case',
        description: 'Casing handphone anti shock',
        price: 149000,
        stock: 250,
        image: 'https://cdn.pixabay.com/photo/2018/01/08/02/34/phone-3068617_960_720.jpg'
      }
    ];

    const productsCount = await Product.count();
    if (productsCount === 0) {
      await Product.bulkCreate(products);
      console.log('Products seeded!');
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = seedDatabase; 