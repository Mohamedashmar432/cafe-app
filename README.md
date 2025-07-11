# 🍽️ Cafe Billing Application

A comprehensive, production-ready cafe billing and management system built with React, Node.js, and SQLite.

## ✨ Features

### 🔐 Authentication & User Management
- **JWT-based authentication** with role-based access control
- **Admin, Waiter, and Cashier roles** with different permissions
- **Secure password hashing** with bcryptjs
- **Employee registration** through admin panel only

### 🍽️ Menu Management
- **Complete menu system** with categories and subcategories
- **Real-time menu updates** from database
- **Item modifiers** (extra sugar, less sugar, etc.)
- **Admin can add/remove/edit** menu items and categories

### 📋 Order Management
- **Complete order lifecycle** from creation to payment
- **Real-time order status tracking** (Pending, Confirmed, Preparing, Ready, Served, Completed)
- **GST calculation** (10% tax)
- **Order modifiers and notes**
- **Payment processing** with multiple payment methods

### 🪑 Table Management
- **Restaurant table management** with status tracking
- **Zone-based organization** (Section 1, 2, 3)
- **Real-time table availability**
- **Table capacity management**

### 📊 Admin Dashboard
- **Comprehensive financial reports**
- **Sales analytics and statistics**
- **Real-time business metrics**
- **Employee management**
- **System monitoring**

### 💳 Payment Processing
- **Multiple payment methods** support
- **Transaction tracking**
- **Payment status management**
- **Receipt generation**

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **SQLite3** database (PostgreSQL/MySQL for production)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** and security middleware

### Database
- **SQLite** for development
- **Comprehensive schema** with relationships
- **Sample data** included
- **Migration scripts** for production

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd cafe-app
```

### 2. Quick Start (Development)
```bash
# Start both frontend and backend
./start.sh
```

### 3. Manual Setup (Development)
```bash
# Install frontend dependencies
npm install

# Setup backend
cd backend
./setup.sh
cd ..

# Start backend
cd backend && npm start &

# Start frontend
npm run dev
```

### 4. Production Build
```bash
# Build for production
./build.sh

# Start production servers
./start.sh
```

## 🔑 Default Login Credentials

- **Employee ID**: `0001`
- **Password**: `admin123`
- **Role**: Admin

**⚠️ Important**: Change the default password immediately after first login!

## 📱 Application URLs

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🏗️ Project Structure

```
cafe-app/
├── src/                    # Frontend React source
│   ├── components/         # React components
│   │   ├── admin/         # Admin dashboard components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Main dashboard components
│   │   ├── menu/          # Menu and ordering components
│   │   ├── theme/         # Theme management
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utilities and API client
│   ├── pages/             # Page components
│   └── hooks/             # Custom React hooks
├── backend/               # Backend Node.js application
│   ├── config/           # Database configuration
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── scripts/          # Database scripts
│   └── data/             # SQLite database
├── public/               # Static assets
├── dist/                 # Production build (generated)
├── start.sh             # Development startup script
├── build.sh             # Production build script
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
JWT_SECRET=your-secret-key-change-in-production
DB_PATH=./data/cafe.db
```

## 📊 Database Schema

### Core Tables
- **users** - Employee management
- **tables** - Restaurant table management
- **menu_categories** - Food categories
- **menu_items** - Menu items with prices
- **orders** - Order management
- **order_items** - Individual items in orders
- **transactions** - Payment records

## 🔒 Security Features

- **JWT Authentication** with role-based access
- **Password Hashing** with bcryptjs
- **CORS Protection** configured for frontend
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **Helmet Security Headers**
- **SQL Injection Prevention**

## 📈 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Change password

### User Management (Admin)
- `GET /api/auth/users` - Get all users
- `POST /api/auth/users` - Create user
- `PUT /api/auth/users/:id` - Update user
- `DELETE /api/auth/users/:id` - Delete user

### Menu Management
- `GET /api/menu/categories` - Get categories
- `GET /api/menu/items` - Get menu items
- `POST /api/menu/items` - Create menu item
- `PUT /api/menu/items/:id` - Update menu item
- `DELETE /api/menu/items/:id` - Delete menu item

### Order Management
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/payment` - Process payment

### Table Management
- `GET /api/tables` - Get tables
- `POST /api/tables` - Create table
- `PUT /api/tables/:id` - Update table
- `DELETE /api/tables/:id` - Delete table

### Admin Dashboard
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/reports/financial` - Financial reports
- `GET /api/admin/reports/sales` - Sales reports

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Set production environment
export NODE_ENV=production

# Set strong JWT secret
export JWT_SECRET=your-super-secure-jwt-secret

# Set production database
export DB_PATH=/path/to/production/database
```

### 2. Database Migration
For production, consider migrating from SQLite to PostgreSQL or MySQL:

```bash
# Install PostgreSQL client
npm install pg

# Update database configuration
# See backend/config/database.js
```

### 3. Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/cafe-app/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL/TLS Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### 5. Process Management (PM2)
```bash
# Install PM2
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start server.js --name "cafe-backend"

# Start frontend with PM2 (if needed)
pm2 start "npm run dev" --name "cafe-frontend"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🧪 Testing

### API Testing
```bash
# Test backend health
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"0001","password":"admin123"}'
```

### Frontend Testing
```bash
# Run tests (if configured)
npm test

# Build test
npm run build
```

## 📝 Development

### Adding New Features
1. **Backend**: Add routes in `backend/routes/`
2. **Frontend**: Add components in `src/components/`
3. **Database**: Update schema in `backend/scripts/init-database.js`
4. **API**: Update API client in `src/lib/api.ts`

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: Standard JavaScript
- **Database**: SQLite with proper relationships

## 🐛 Troubleshooting

### Common Issues

#### Frontend Not Loading
```bash
# Check if Vite is running
curl http://localhost:8080

# Restart frontend
npm run dev
```

#### Backend Connection Issues
```bash
# Check backend health
curl http://localhost:5000/health

# Check database
ls -la backend/data/cafe.db

# Restart backend
cd backend && npm start
```

#### Database Issues
```bash
# Reinitialize database
cd backend && npm run init-db
```

#### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL matches backend CORS configuration

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for frontend errors
4. Check backend server logs
5. Verify database connectivity

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**🎉 Enjoy your fully integrated, production-ready Cafe Billing Application!**
