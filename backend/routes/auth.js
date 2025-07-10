const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getRow, runQuery, getAll } = require('../config/database');
const { authenticateToken, requireAdmin, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({ error: 'Employee ID and password are required' });
    }

    // Get user by employee ID
    const user = await getRow(
      'SELECT id, name, email, employee_id, password_hash, role, status FROM users WHERE employee_id = ?',
      [employeeId]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'Active') {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        employeeId: user.employee_id,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const { password_hash, ...userData } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { password_hash, ...userData } = req.user;
    res.json({ user: userData });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await getAll(
      'SELECT id, name, email, employee_id, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create new user
router.post('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, employeeId, password, role } = req.body;

    if (!name || !email || !employeeId || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email or employee ID already exists
    const existingUser = await getRow(
      'SELECT id FROM users WHERE email = ? OR employee_id = ?',
      [email, employeeId]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'Email or Employee ID already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await runQuery(
      'INSERT INTO users (name, email, employee_id, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, employeeId, passwordHash, role]
    );

    // Get the created user
    const newUser = await getRow(
      'SELECT id, name, email, employee_id, role, status, created_at FROM users WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update user
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, employeeId, role, status } = req.body;

    if (!name || !email || !employeeId || !role) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Check if email or employee ID already exists for other users
    const existingUser = await getRow(
      'SELECT id FROM users WHERE (email = ? OR employee_id = ?) AND id != ?',
      [email, employeeId, id]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'Email or Employee ID already exists' });
    }

    // Update user
    await runQuery(
      'UPDATE users SET name = ?, email = ?, employee_id = ?, role = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, employeeId, role, status || 'Active', id]
    );

    // Get updated user
    const updatedUser = await getRow(
      'SELECT id, name, email, employee_id, role, status, created_at FROM users WHERE id = ?',
      [id]
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete user
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await getRow('SELECT id FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await runQuery('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    // Get current user with password
    const user = await getRow(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await runQuery(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 