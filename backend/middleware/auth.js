const jwt = require('jsonwebtoken');
const { getRow } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database to ensure they still exist and are active
    const user = await getRow(
      'SELECT id, name, email, employee_id, role, status FROM users WHERE id = ? AND status = ?',
      [decoded.userId, 'Active']
    );

    if (!user) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

const requireAdmin = requireRole(['Admin']);
const requireWaiterOrAdmin = requireRole(['Waiter', 'Admin']);
const requireCashierOrAdmin = requireRole(['Cashier', 'Admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireWaiterOrAdmin,
  requireCashierOrAdmin,
  JWT_SECRET
}; 