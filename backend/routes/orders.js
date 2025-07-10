const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getRow, runQuery, getAll } = require('../config/database');
const { authenticateToken, requireWaiterOrAdmin, requireCashierOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ORD${timestamp}${random}`;
}

// Get all orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, tableId, date } = req.query;
    let whereClause = '1=1';
    let params = [];

    if (status) {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }

    if (tableId) {
      whereClause += ' AND o.table_id = ?';
      params.push(tableId);
    }

    if (date) {
      whereClause += ' AND DATE(o.created_at) = ?';
      params.push(date);
    }

    const orders = await getAll(`
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.subtotal,
        o.gst_amount,
        o.total_amount,
        o.payment_status,
        o.payment_method,
        o.notes,
        o.created_at,
        o.updated_at,
        t.number as table_number,
        t.zone as table_zone,
        u.name as user_name,
        u.employee_id as user_employee_id
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      JOIN users u ON o.user_id = u.id
      WHERE ${whereClause}
      ORDER BY o.created_at DESC
    `, params);

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order by ID with items
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order details
    const order = await getRow(`
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.subtotal,
        o.gst_amount,
        o.total_amount,
        o.payment_status,
        o.payment_method,
        o.notes,
        o.created_at,
        o.updated_at,
        t.id as table_id,
        t.number as table_number,
        t.zone as table_zone,
        t.seats as table_seats,
        u.name as user_name,
        u.employee_id as user_employee_id
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items
    const orderItems = await getAll(`
      SELECT 
        oi.id,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        oi.modifiers,
        oi.notes,
        mi.id as menu_item_id,
        mi.name as menu_item_name,
        mi.icon as menu_item_icon,
        mc.name as menu_item_category
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE oi.order_id = ?
      ORDER BY oi.created_at
    `, [id]);

    res.json({ 
      order: {
        ...order,
        items: orderItems
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new order
router.post('/', authenticateToken, requireWaiterOrAdmin, async (req, res) => {
  try {
    const { tableId, items, notes } = req.body;

    if (!tableId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Table ID and items are required' });
    }

    // Check if table exists and is available
    const table = await getRow('SELECT id, status FROM tables WHERE id = ?', [tableId]);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    if (table.status === 'Full') {
      return res.status(400).json({ error: 'Table is full' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await getRow('SELECT id, price FROM menu_items WHERE id = ? AND is_available = 1', [item.menuItemId]);
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item ${item.menuItemId} not found or unavailable` });
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItemId: menuItem.id,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        totalPrice: itemTotal,
        modifiers: item.modifiers || null,
        notes: item.notes || null
      });
    }

    const gstAmount = subtotal * 0.1; // 10% GST
    const totalAmount = subtotal + gstAmount;
    const orderNumber = generateOrderNumber();

    // Create order
    const orderResult = await runQuery(`
      INSERT INTO orders (order_number, table_id, user_id, subtotal, gst_amount, total_amount, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [orderNumber, tableId, req.user.id, subtotal, gstAmount, totalAmount, notes || null]);

    // Create order items
    for (const item of orderItems) {
      await runQuery(`
        INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, modifiers, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [orderResult.id, item.menuItemId, item.quantity, item.unitPrice, item.totalPrice, item.modifiers, item.notes]);
    }

    // Update table status
    await runQuery('UPDATE tables SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['Ordering', tableId]);

    // Get created order with items
    const createdOrder = await getRow(`
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.subtotal,
        o.gst_amount,
        o.total_amount,
        o.payment_status,
        o.notes,
        o.created_at,
        t.number as table_number,
        t.zone as table_zone,
        u.name as user_name
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [orderResult.id]);

    res.status(201).json({
      message: 'Order created successfully',
      order: createdOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/:id/status', authenticateToken, requireWaiterOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if order exists
    const order = await getRow('SELECT id, table_id FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    await runQuery(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    // Update table status based on order status
    let tableStatus = 'Ordering';
    if (status === 'Completed' || status === 'Cancelled') {
      tableStatus = 'Available';
    } else if (status === 'Served') {
      tableStatus = 'Full';
    }

    await runQuery(
      'UPDATE tables SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [tableStatus, order.table_id]
    );

    res.json({ message: 'Order status updated successfully' });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process payment
router.post('/:id/payment', authenticateToken, requireCashierOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, amount, transactionId } = req.body;

    if (!paymentMethod || !amount) {
      return res.status(400).json({ error: 'Payment method and amount are required' });
    }

    // Check if order exists
    const order = await getRow('SELECT id, total_amount, payment_status FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.payment_status === 'Paid') {
      return res.status(400).json({ error: 'Order is already paid' });
    }

    // Create transaction record
    await runQuery(`
      INSERT INTO transactions (order_id, amount, payment_method, transaction_id, status)
      VALUES (?, ?, ?, ?, ?)
    `, [id, amount, paymentMethod, transactionId || null, 'Completed']);

    // Update order payment status
    const newPaymentStatus = amount >= order.total_amount ? 'Paid' : 'Partially Paid';
    await runQuery(
      'UPDATE orders SET payment_status = ?, payment_method = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPaymentStatus, paymentMethod, id]
    );

    // If fully paid, update order status to completed
    if (newPaymentStatus === 'Paid') {
      await runQuery(
        'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['Completed', id]
      );
    }

    res.json({ 
      message: 'Payment processed successfully',
      paymentStatus: newPaymentStatus
    });

  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let whereClause = '1=1';
    let params = [];

    if (startDate && endDate) {
      whereClause += ' AND DATE(created_at) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // Get total orders
    const totalOrders = await getRow(`
      SELECT COUNT(*) as count FROM orders WHERE ${whereClause}
    `, params);

    // Get total revenue
    const totalRevenue = await getRow(`
      SELECT SUM(total_amount) as total FROM orders WHERE ${whereClause} AND payment_status = 'Paid'
    `, params);

    // Get orders by status
    const ordersByStatus = await getAll(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      WHERE ${whereClause}
      GROUP BY status
    `, params);

    // Get top selling items
    const topItems = await getAll(`
      SELECT 
        mi.name,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.total_price) as total_revenue
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'Paid' ${startDate && endDate ? 'AND DATE(o.created_at) BETWEEN ? AND ?' : ''}
      GROUP BY mi.id, mi.name
      ORDER BY total_quantity DESC
      LIMIT 10
    `, startDate && endDate ? [startDate, endDate] : []);

    res.json({
      summary: {
        totalOrders: totalOrders.count,
        totalRevenue: totalRevenue.total || 0,
        ordersByStatus,
        topItems
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 