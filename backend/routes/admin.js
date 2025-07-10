const express = require('express');
const { getRow, runQuery, getAll } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'WHERE DATE(o.created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    // Total revenue
    const totalRevenue = await getRow(`
      SELECT COALESCE(SUM(total_amount), 0) as total 
      FROM orders 
      ${dateFilter} AND payment_status = 'Paid'
    `, params);

    // Total orders
    const totalOrders = await getRow(`
      SELECT COUNT(*) as count 
      FROM orders 
      ${dateFilter}
    `, params);

    // Pending orders
    const pendingOrders = await getRow(`
      SELECT COUNT(*) as count 
      FROM orders 
      ${dateFilter} AND status IN ('Pending', 'Confirmed', 'Preparing')
    `, params);

    // Completed orders
    const completedOrders = await getRow(`
      SELECT COUNT(*) as count 
      FROM orders 
      ${dateFilter} AND status = 'Completed'
    `, params);

    // Total users
    const totalUsers = await getRow('SELECT COUNT(*) as count FROM users WHERE status = ?', ['Active']);

    // Total tables
    const totalTables = await getRow('SELECT COUNT(*) as count FROM tables');

    // Available tables
    const availableTables = await getRow(`
      SELECT COUNT(*) as count 
      FROM tables 
      WHERE status = 'Available'
    `);

    // Recent orders
    const recentOrders = await getAll(`
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.total_amount,
        o.payment_status,
        o.created_at,
        t.number as table_number,
        u.name as user_name
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    // Top selling items
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
      LIMIT 5
    `, startDate && endDate ? [startDate, endDate] : []);

    // Revenue by day (last 7 days)
    const revenueByDay = await getAll(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as revenue,
        COUNT(*) as orders
      FROM orders 
      WHERE payment_status = 'Paid' 
        AND created_at >= DATE('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Orders by status
    const ordersByStatus = await getAll(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      ${dateFilter}
      GROUP BY status
    `, params);

    res.json({
      dashboard: {
        revenue: {
          total: totalRevenue.total,
          byDay: revenueByDay
        },
        orders: {
          total: totalOrders.count,
          pending: pendingOrders.count,
          completed: completedOrders.count,
          byStatus: ordersByStatus
        },
        users: {
          total: totalUsers.count
        },
        tables: {
          total: totalTables.count,
          available: availableTables.count
        },
        recentOrders,
        topItems
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system statistics
router.get('/stats/system', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Database size (approximate)
    const dbStats = await getRow(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM tables) as total_tables,
        (SELECT COUNT(*) FROM menu_items) as total_menu_items,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM transactions) as total_transactions
    `);

    // Recent activity
    const recentActivity = await getAll(`
      SELECT 
        'order' as type,
        o.order_number as identifier,
        o.created_at as timestamp,
        CONCAT('Order created by ', u.name) as description
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.created_at >= DATETIME('now', '-24 hours')
      
      UNION ALL
      
      SELECT 
        'payment' as type,
        t.transaction_id as identifier,
        t.created_at as timestamp,
        CONCAT('Payment of $', t.amount, ' processed') as description
      FROM transactions t
      WHERE t.created_at >= DATETIME('now', '-24 hours')
      
      ORDER BY timestamp DESC
      LIMIT 20
    `);

    res.json({
      system: {
        database: dbStats,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get financial report
router.get('/reports/financial', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    // Revenue summary
    const revenueSummary = await getRow(`
      SELECT 
        SUM(total_amount) as total_revenue,
        SUM(subtotal) as total_subtotal,
        SUM(gst_amount) as total_gst,
        COUNT(*) as total_orders,
        AVG(total_amount) as average_order_value
      FROM orders 
      WHERE payment_status = 'Paid' 
        AND DATE(created_at) BETWEEN ? AND ?
    `, [startDate, endDate]);

    // Revenue by payment method
    const revenueByPaymentMethod = await getAll(`
      SELECT 
        payment_method,
        SUM(amount) as total_amount,
        COUNT(*) as transaction_count
      FROM transactions 
      WHERE status = 'Completed'
        AND DATE(created_at) BETWEEN ? AND ?
      GROUP BY payment_method
    `, [startDate, endDate]);

    // Daily revenue breakdown
    const dailyRevenue = await getAll(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as revenue,
        COUNT(*) as orders,
        AVG(total_amount) as avg_order_value
      FROM orders 
      WHERE payment_status = 'Paid'
        AND DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [startDate, endDate]);

    // Top performing items
    const topItems = await getAll(`
      SELECT 
        mi.name,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.total_price) as total_revenue,
        AVG(oi.unit_price) as avg_price
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'Paid'
        AND DATE(o.created_at) BETWEEN ? AND ?
      GROUP BY mi.id, mi.name
      ORDER BY total_revenue DESC
      LIMIT 10
    `, [startDate, endDate]);

    res.json({
      financial: {
        summary: revenueSummary,
        byPaymentMethod: revenueByPaymentMethod,
        dailyBreakdown: dailyRevenue,
        topItems
      }
    });

  } catch (error) {
    console.error('Get financial report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sales report
router.get('/reports/sales', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    // Sales by category
    const salesByCategory = await getAll(`
      SELECT 
        mc.name as category,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.total_price) as total_revenue,
        COUNT(DISTINCT o.id) as order_count
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN menu_categories mc ON mi.category_id = mc.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'Paid'
        AND DATE(o.created_at) BETWEEN ? AND ?
      GROUP BY mc.id, mc.name
      ORDER BY total_revenue DESC
    `, [startDate, endDate]);

    // Sales by table
    const salesByTable = await getAll(`
      SELECT 
        t.number as table_number,
        t.zone as table_zone,
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as total_revenue,
        AVG(o.total_amount) as avg_order_value
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      WHERE o.payment_status = 'Paid'
        AND DATE(o.created_at) BETWEEN ? AND ?
      GROUP BY t.id, t.number, t.zone
      ORDER BY total_revenue DESC
    `, [startDate, endDate]);

    // Sales by employee
    const salesByEmployee = await getAll(`
      SELECT 
        u.name as employee_name,
        u.employee_id,
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as total_revenue,
        AVG(o.total_amount) as avg_order_value
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.payment_status = 'Paid'
        AND DATE(o.created_at) BETWEEN ? AND ?
      GROUP BY u.id, u.name, u.employee_id
      ORDER BY total_revenue DESC
    `, [startDate, endDate]);

    res.json({
      sales: {
        byCategory: salesByCategory,
        byTable: salesByTable,
        byEmployee: salesByEmployee
      }
    });

  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export data (for backup purposes)
router.get('/export/data', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { tables } = req.query;
    const exportTables = tables ? tables.split(',') : ['users', 'tables', 'menu_categories', 'menu_items', 'orders', 'order_items', 'transactions'];
    
    const data = {};

    for (const tableName of exportTables) {
      const tableData = await getAll(`SELECT * FROM ${tableName}`);
      data[tableName] = tableData;
    }

    res.json({
      export: {
        timestamp: new Date().toISOString(),
        tables: exportTables,
        data
      }
    });

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 