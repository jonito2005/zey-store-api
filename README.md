# 🛍️ ZeyStore API

ZeyStore API adalah backend service untuk aplikasi e-commerce ZeyStore yang dibangun menggunakan Node.js, Express, dan MySQL dengan Sequelize ORM.

## ✨ Fitur

- 🔐 Autentikasi User (Register/Login)
- 📦 Manajemen Produk  
- 🛒 Order System (User & Guest)
- 📸 File Upload untuk Gambar Produk

## 🛠️ Teknologi

- 💻 Node.js
- ⚡ Express.js 
- 🗄️ MySQL
- 🔄 Sequelize ORM
- 🔑 JWT Authentication
- 📤 Multer (File Upload)
- 🔒 Bcrypt (Password Hashing)

## 📋 Persyaratan

- Node.js (v14+ recommended)
- MySQL Server
- npm atau yarn

## 📁 Struktur Proyek
ZeyStore API
├── config
│   ├── config.js
│   └── database.js
├── controllers
│   ├── authController.js
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── middleware
│   ├── auth.js
│   └── upload.js
├── models
│   ├── GuestOrder.js
│   ├── Order.js
│   ├── Product.js
│   ├── User.js
│   └── index.js
├── routes
│   ├── auth.js
│   ├── orders.js
│   ├── products.js
│   └── users.js
├── utils
│   ├── jwt.js
│   └── response.js
├── uploads
│   └── products
├── .env
├── package.json
├── package-lock.json
├── README.md
├── seeders.js
└── server.js

## 🚀 Instalasi
1. Clone repository
   ```bash
   git clone <repository-url>
   cd zey-store-api
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Konfigurasi environment ⚙️
   Buat file .env di root proyek dan isi dengan konfigurasi berikut:
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   DB_NAME=zeystore-api
   DB_USER=root
   DB_PASS=
   DB_HOST=localhost
   ```
   
4. 🖥️ Jalankan server

   Untuk menjalankan server dalam mode produksi:
   ```bash
   npm start
   ```

   Untuk menjalankan server dalam mode pengembangan:
   ```bash
   npm run dev
   ```

## 📚 Dokumentasi API

### 🔐 Autentikasi

#### Register User
```http
POST /api/auth/register
```
Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "081234567890"
}
```
Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "081234567890",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
```
Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "081234567890",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 📦 Produk

#### Get All Products
```http
GET /api/products
```
Response:
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Smartphone XYZ",
      "description": "Smartphone terbaru dengan spesifikasi tinggi",
      "price": 3499000,
      "stock": 50,
      "image": "uploads/products/phone1.jpg",
      "created_at": "2024-01-20T07:00:00.000Z",
      "updated_at": "2024-01-20T07:00:00.000Z"
    }
  ]
}
```

#### Get Product by ID
```http
GET /api/products/:id
```
Response:
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Smartphone XYZ",
    "description": "Smartphone terbaru dengan spesifikasi tinggi",
    "price": 3499000,
    "stock": 50,
    "image": "uploads/products/phone1.jpg",
    "created_at": "2024-01-20T07:00:00.000Z",
    "updated_at": "2024-01-20T07:00:00.000Z"
  }
}
```

#### Create Product (Admin Only)
```http
POST /api/products
```
Request:
```json
{
  "name": "Smartphone XYZ",
  "description": "Smartphone terbaru dengan spesifikasi tinggi",
  "price": 3499000,
  "stock": 50,
  "image": [FILE]
}
```
Response:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Smartphone XYZ",
    "description": "Smartphone terbaru dengan spesifikasi tinggi",
    "price": 3499000,
    "stock": 50,
    "image": "uploads/products/phone1.jpg",
    "created_at": "2024-01-20T07:00:00.000Z",
    "updated_at": "2024-01-20T07:00:00.000Z"
  }
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
```
Request:
```json
{
  "name": "Smartphone XYZ Updated",
  "price": 3299000,
  "stock": 45,
  "image": [FILE]
}
```
Response:
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Smartphone XYZ Updated",
    "description": "Smartphone terbaru dengan spesifikasi tinggi",
    "price": 3299000,
    "stock": 45,
    "image": "uploads/products/phone1-updated.jpg",
    "created_at": "2024-01-20T07:00:00.000Z",
    "updated_at": "2024-01-20T07:00:00.000Z"
  }
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
```
Response:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### 🛒 Pesanan

#### Create Order
```http
POST /api/orders
```
Request:
```json
{
  "product_id": 1,
  "quantity": 2
}
```
Response:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "product_id": 1,
    "quantity": 2,
    "total_price": 6998000,
    "status": "pending",
    "payment_status": "unpaid",
    "created_at": "2024-01-20T07:00:00.000Z",
    "updated_at": "2024-01-20T07:00:00.000Z"
  }
}
```

#### Get User Orders
```http
GET /api/orders/my-orders
```
Response:
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "product": {
        "id": 1,
        "name": "Smartphone XYZ",
        "price": 3499000,
        "image": "uploads/products/phone1.jpg"
      },
      "quantity": 2,
      "total_price": 6998000,
      "status": "pending",
      "payment_status": "unpaid",
      "created_at": "2024-01-20T07:00:00.000Z",
      "updated_at": "2024-01-20T07:00:00.000Z"
    }
  ]
}
```

#### Update Order Status (Admin Only)
```http
PATCH /api/orders/:id/status
```
Request:
```json
{
  "status": "processing"
}
```
Response:
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "status": "processing",
    "updated_at": "2024-01-20T07:00:00.000Z"
  }
}
```

#### Checkout Order
```http
POST /api/orders/checkout
```
Request:
```json
{
  "product_id": 1,
  "quantity": 2,
  "shipping_address": "Jl. Contoh No. 123, Jakarta"
}
```
Response:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "product": {
        "name": "Smartphone XYZ",
        "price": 3499000
      },
      "quantity": 2,
      "total_price": 6998000,
      "shipping_address": "Jl. Contoh No. 123, Jakarta",
      "status": "pending",
      "payment_status": "unpaid"
    },
    "whatsapp_link": "https://wa.me/6281234567890?text=..."
  }
}
```

#### Guest Checkout
```http
POST /api/orders/guest-checkout
```
Request:
```json
{
  "product_id": 1,
  "quantity": 1,
  "guest_name": "John Doe",
  "guest_email": "john@example.com",
  "guest_phone": "081234567890",
  "shipping_address": "Jl. Contoh No. 123, Jakarta"
}
```
Response:
```json
{
  "success": true,
  "message": "Guest order created successfully",
  "data": {
    "order": {
      "id": 1,
      "guest_name": "John Doe",
      "guest_email": "john@example.com",
      "guest_phone": "081234567890",
      "product": {
        "name": "Smartphone XYZ",
        "price": 3499000
      },
      "quantity": 1,
      "total_price": 3499000,
      "shipping_address": "Jl. Contoh No. 123, Jakarta",
      "status": "pending",
      "payment_status": "unpaid"
    },
    "whatsapp_link": "https://wa.me/6281234567890?text=..."
  }
}
```

#### Update Payment Status (Admin Only)
```http
PATCH /api/orders/:id/payment
```
Request:
```json
{
  "payment_status": "paid"
}
```
Response:
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "id": 1,
    "payment_status": "paid",
    "status": "processing",
    "updated_at": "2024-01-20T07:00:00.000Z"
  }
}
```

#### Get All Orders (Admin Only)
```http
GET /api/orders
```
Response:
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "product": {
        "id": 1,
        "name": "Smartphone XYZ",
        "price": 3499000
      },
      "quantity": 2,
      "total_price": 6998000,
      "status": "processing",
      "payment_status": "paid",
      "shipping_address": "Jl. Contoh No. 123, Jakarta",
      "created_at": "2024-01-20T07:00:00.000Z",
      "updated_at": "2024-01-20T07:00:00.000Z"
    }
  ]
}
```

#### Get All Guest Orders (Admin Only)
```http
GET /api/orders/guest-orders
```
Response:
```json
{
  "success": true,
  "message": "Guest orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "guest_name": "John Doe",
      "guest_email": "john@example.com",
      "guest_phone": "081234567890",
      "product": {
        "id": 1,
        "name": "Smartphone XYZ",
        "price": 3499000,
        "image": "uploads/products/phone1.jpg"
      },
      "quantity": 1,
      "total_price": 3499000,
      "shipping_address": "Jl. Contoh No. 123, Jakarta",
      "status": "pending",
      "payment_status": "unpaid",
      "created_at": "2024-01-20T07:00:00.000Z",
      "updated_at": "2024-01-20T07:00:00.000Z"
    }
  ]
}
```

### 👥 Pengguna

#### Get All Users (Admin Only)
```http
GET /api/users
```
Response:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "081234567890",
      "role": "user",
      "created_at": "2024-01-20T07:00:00.000Z",
      "updated_at": "2024-01-20T07:00:00.000Z"
    }
  ]
}
```

#### Get User by ID (Admin Only)
```http
GET /api/users/:id
```
Response:
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "081234567890",
    "role": "user",
    "created_at": "2024-01-20T07:00:00.000Z",
    "updated_at": "2024-01-20T07:00:00.000Z"
  }
}
```

#### Update User (Admin Only)
```http
PUT /api/users/:id
```
Request:
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "081234567891",
  "role": "admin"
}
```
Response:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "081234567891",
    "role": "admin"
  }
}
```

#### Delete User (Admin Only)
```http
DELETE /api/users/:id
```
Response:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### Get User Profile
```http
GET /api/users/profile
```
Response:
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "081234567890",
    "role": "user",
    "created_at": "2024-01-20T07:00:00.000Z",
    "updated_at": "2024-01-20T07:00:00.000Z"
  }
}
```

#### Update User Profile
```http
PUT /api/users/profile
```
Request:
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "081234567891"
}
```
Response:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "081234567891"
  }
}
```

## ⚠️ Catatan Penting
- Pastikan MySQL server berjalan dan database sudah dibuat sesuai dengan konfigurasi di file .env
- Folder uploads/products harus ada untuk menyimpan gambar produk yang diunggah
