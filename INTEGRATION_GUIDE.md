# Frontend-Backend Integration Guide

This guide explains how to integrate the React frontend with the Node.js backend for the Cafe Billing Application.

## Prerequisites

- Node.js and npm installed
- Both frontend and backend code available
- Backend server running on port 5000

## Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run the setup script**
   ```bash
   ./setup.sh
   ```

3. **Start the backend server**
   ```bash
   npm run dev
   ```

4. **Verify the server is running**
   ```bash
   curl http://localhost:5000/health
   ```

## Frontend Configuration

1. **Create environment file**
   ```bash
   cd ..  # Go back to root directory
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

2. **Install additional dependencies (if needed)**
   ```bash
   npm install
   ```

## API Integration

The frontend now includes a comprehensive API client (`src/lib/api.ts`) that handles all communication with the backend.

### Authentication Flow

1. **Login Process**
   ```typescript
   import { api } from '@/lib/api';

   try {
     const response = await api.login(employeeId, password);
     // Token is automatically stored
     // User data is in response.user
   } catch (error) {
     // Handle login error
   }
   ```

2. **Token Management**
   - Tokens are automatically stored in localStorage
   - All API requests include the token in headers
   - Use `api.clearToken()` to logout

### Key Integration Points

#### 1. Login Page (`src/components/auth/LoginPage.tsx`)

Update the login handler to use the API:

```typescript
const handleLogin = async (employeeId: string, password: string) => {
  try {
    const response = await api.login(employeeId, password);
    onLogin(response.user);
  } catch (error) {
    // Show error message
    console.error('Login failed:', error);
  }
};
```

#### 2. Dashboard (`src/components/dashboard/Dashboard.tsx`)

Load tables from the API:

```typescript
const [tables, setTables] = useState<Table[]>([]);

useEffect(() => {
  const loadTables = async () => {
    try {
      const response = await api.getTables();
      setTables(response.tables);
    } catch (error) {
      console.error('Failed to load tables:', error);
    }
  };
  
  loadTables();
}, []);
```

#### 3. Menu View (`src/components/menu/MenuView.tsx`)

Load menu items from the API:

```typescript
const [menuData, setMenuData] = useState<any>({});

useEffect(() => {
  const loadMenu = async () => {
    try {
      const response = await api.getMenuItems();
      setMenuData(response.menu);
    } catch (error) {
      console.error('Failed to load menu:', error);
    }
  };
  
  loadMenu();
}, []);
```

#### 4. Order Summary (`src/components/menu/OrderSummary.tsx`)

Submit orders to the API:

```typescript
const handleConfirmOrder = async () => {
  try {
    const orderData = {
      tableId: parseInt(table.id),
      items: orderItems.map(item => ({
        menuItemId: parseInt(item.menuItem.id),
        quantity: item.quantity,
        modifiers: item.modifiers,
        notes: ''
      })),
      notes: ''
    };

    const response = await api.createOrder(orderData);
    // Handle successful order creation
    onClearOrder();
  } catch (error) {
    console.error('Failed to create order:', error);
  }
};
```

#### 5. Admin Dashboard (`src/components/admin/AdminDashboard.tsx`)

Load admin data from the API:

```typescript
const [employees, setEmployees] = useState<User[]>([]);
const [orders, setOrders] = useState<Order[]>([]);
const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

useEffect(() => {
  const loadAdminData = async () => {
    try {
      const [usersResponse, ordersResponse, menuResponse] = await Promise.all([
        api.getUsers(),
        api.getOrders(),
        api.getAllMenuItems()
      ]);
      
      setEmployees(usersResponse.users);
      setOrders(ordersResponse.orders);
      setMenuItems(menuResponse.items);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };
  
  loadAdminData();
}, []);
```

## Data Flow

### 1. User Authentication
```
Frontend → API Login → Backend → JWT Token → Frontend Storage
```

### 2. Menu Loading
```
Frontend → API Get Menu → Backend → Database → Menu Items → Frontend
```

### 3. Order Creation
```
Frontend → API Create Order → Backend → Database → Order Confirmation → Frontend
```

### 4. Payment Processing
```
Frontend → API Process Payment → Backend → Database → Payment Confirmation → Frontend
```

## Error Handling

The API client includes comprehensive error handling:

```typescript
try {
  const response = await api.someMethod();
  // Handle success
} catch (error) {
  if (error.message.includes('401')) {
    // Handle unauthorized - redirect to login
    api.clearToken();
    // Redirect to login
  } else if (error.message.includes('403')) {
    // Handle forbidden - insufficient permissions
  } else {
    // Handle other errors
    console.error('API Error:', error);
  }
}
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key
```

## Testing the Integration

1. **Start both servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Test login**
   - Open http://localhost:5173
   - Login with Employee ID: `0001`, Password: `admin123`

3. **Test menu loading**
   - Navigate to a table
   - Verify menu items load from the database

4. **Test order creation**
   - Add items to cart
   - Confirm order
   - Check backend logs for order creation

5. **Test admin functions**
   - Login as admin
   - Try creating/editing menu items
   - Check user management

## Common Issues and Solutions

### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: Ensure backend CORS is configured for frontend URL

### 2. Authentication Errors
**Problem**: 401 Unauthorized errors
**Solution**: Check JWT token storage and expiration

### 3. Database Connection Issues
**Problem**: Backend can't connect to database
**Solution**: Ensure database file exists and has proper permissions

### 4. Menu Items Not Loading
**Problem**: Empty menu in frontend
**Solution**: Check if database has menu items, run `npm run init-db`

## Production Deployment

1. **Backend**
   - Set `NODE_ENV=production`
   - Use production database (PostgreSQL/MySQL)
   - Set strong JWT secret
   - Configure proper CORS origins

2. **Frontend**
   - Set `VITE_API_URL` to production backend URL
   - Build with `npm run build`
   - Deploy to web server

## Security Considerations

1. **JWT Tokens**: Store securely, implement refresh tokens
2. **Password Security**: Use strong passwords, implement password policies
3. **API Security**: Rate limiting, input validation, SQL injection prevention
4. **CORS**: Configure properly for production domains
5. **HTTPS**: Use SSL/TLS in production

## Monitoring and Logging

1. **Backend Logs**: Monitor server logs for errors
2. **Database**: Monitor database performance and connections
3. **API Usage**: Track API endpoint usage and response times
4. **Error Tracking**: Implement error tracking (Sentry, etc.)

## Support

For integration issues:
1. Check browser console for frontend errors
2. Check backend server logs
3. Verify API endpoints with tools like Postman
4. Check database connectivity and data integrity 