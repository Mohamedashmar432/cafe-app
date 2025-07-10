# Cafe Billing Backend

A comprehensive backend API for the Cafe Billing Application built with Node.js, Express, and SQLite.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Admin can create, update, and delete employees
- **Menu Management**: Full CRUD operations for menu items and categories
- **Order Management**: Complete order lifecycle from creation to payment
- **Table Management**: Restaurant table management with status tracking
- **Payment Processing**: Support for multiple payment methods
- **Reporting**: Comprehensive financial and sales reports
- **Real-time Statistics**: Dashboard with real-time business metrics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/change-password` - Change password

### User Management (Admin Only)
- `GET /api/auth/users` - Get all users
- `POST /api/auth/users` - Create new user
- `PUT /api/auth/users/:id` - Update user
- `DELETE /api/auth/users/:id` - Delete user

### Menu Management
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/items` - Get all menu items
- `GET /api/menu/items/all` - Get all items (admin view)
- `POST /api/menu/items` - Create menu item (admin)
- `PUT /api/menu/items/:id` - Update menu item (admin)
- `DELETE /api/menu/items/:id` - Delete menu item (admin)
- `POST /api/menu/categories` - Create category (admin)
- `PUT /api/menu/categories/:id` - Update category (admin)
- `DELETE /api/menu/categories/:id` - Delete category (admin)

### Order Management
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/payment` - Process payment
- `GET /api/orders/stats/summary` - Get order statistics

### Table Management
- `GET /api/tables` - Get all tables
- `GET /api/tables/:id` - Get table by ID
- `POST /api/tables` - Create new table
- `PUT /api/tables/:id` - Update table
- `DELETE /api/tables/:id` - Delete table
- `GET /api/tables/stats/summary` - Get table statistics

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/stats/system` - Get system statistics
- `GET /api/admin/reports/financial` - Get financial report
- `GET /api/admin/reports/sales` - Get sales report
- `GET /api/admin/export/data` - Export data

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Email address (unique)
- `employee_id` - Employee ID (unique)
- `password_hash` - Hashed password
- `role` - User role (Admin, Waiter, Cashier)
- `status` - Account status (Active, Inactive)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Tables Table
- `id` - Primary key
- `number` - Table number (unique)
- `zone` - Restaurant zone
- `seats` - Number of seats
- `status` - Table status (Available, Ordering, Full, Booked)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Menu Categories Table
- `id` - Primary key
- `name` - Category name (unique)
- `display_order` - Display order
- `created_at` - Creation timestamp

### Menu Items Table
- `id` - Primary key
- `name` - Item name
- `price` - Item price
- `category_id` - Foreign key to categories
- `subcategory` - Subcategory (Special, Strong, Less Sugar, Normal)
- `icon` - Item icon
- `is_available` - Availability status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Orders Table
- `id` - Primary key
- `order_number` - Unique order number
- `table_id` - Foreign key to tables
- `user_id` - Foreign key to users
- `status` - Order status
- `subtotal` - Order subtotal
- `gst_amount` - GST amount
- `total_amount` - Total amount
- `payment_status` - Payment status
- `payment_method` - Payment method
- `notes` - Order notes
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Order Items Table
- `id` - Primary key
- `order_id` - Foreign key to orders
- `menu_item_id` - Foreign key to menu items
- `quantity` - Item quantity
- `unit_price` - Unit price
- `total_price` - Total price
- `modifiers` - Item modifiers (JSON)
- `notes` - Item notes
- `created_at` - Creation timestamp

### Transactions Table
- `id` - Primary key
- `order_id` - Foreign key to orders
- `amount` - Transaction amount
- `payment_method` - Payment method
- `transaction_id` - External transaction ID
- `status` - Transaction status
- `created_at` - Creation timestamp

## Default Admin Account

After running the database initialization script, a default admin account is created:

- **Employee ID**: 0001
- **Email**: admin@cafe.com
- **Password**: admin123
- **Role**: Admin

**Important**: Change the default password immediately after first login!

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Role-based Access Control**: Different permissions for different user roles
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Configured for frontend communication
- **Helmet**: Security headers
- **Input Validation**: Request validation and sanitization

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## Development

### Running in Development Mode
```bash
npm run dev
```

### Database Reset
```bash
npm run init-db
```

### Health Check
```bash
curl http://localhost:5000/health
```

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Set up proper logging
5. Use a production database (PostgreSQL/MySQL recommended)
6. Set up SSL/TLS certificates
7. Configure reverse proxy (nginx)

## API Documentation

The API follows RESTful conventions and returns JSON responses. All timestamps are in ISO 8601 format.

### Authentication Headers
```javascript
headers: {
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

### Response Format
```javascript
{
  "message": "Success message",
  "data": { ... },
  "error": "Error message (if applicable)"
}
```

## Support

For issues and questions, please refer to the project documentation or create an issue in the repository. 