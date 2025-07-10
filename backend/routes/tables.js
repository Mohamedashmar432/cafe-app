const express = require('express');
const { getRow, runQuery, getAll } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all tables
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tables = await getAll(`
      SELECT 
        t.id,
        t.number,
        t.zone,
        t.seats,
        t.status,
        t.created_at,
        t.updated_at,
        COALESCE(o.id, NULL) as current_order_id,
        COALESCE(o.order_number, NULL) as current_order_number,
        COALESCE(o.total_amount, 0) as current_order_total
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id AND o.status NOT IN ('Completed', 'Cancelled')
      ORDER BY t.zone, CAST(t.number AS INTEGER)
    `);

    res.json({ tables });
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get table by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const table = await getRow(`
      SELECT 
        t.id,
        t.number,
        t.zone,
        t.seats,
        t.status,
        t.created_at,
        t.updated_at,
        COALESCE(o.id, NULL) as current_order_id,
        COALESCE(o.order_number, NULL) as current_order_number,
        COALESCE(o.total_amount, 0) as current_order_total
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id AND o.status NOT IN ('Completed', 'Cancelled')
      WHERE t.id = ?
    `, [id]);

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json({ table });
  } catch (error) {
    console.error('Get table error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new table (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { number, zone, seats } = req.body;

    if (!number || !zone || !seats) {
      return res.status(400).json({ error: 'Table number, zone, and seats are required' });
    }

    // Check if table number already exists
    const existingTable = await getRow('SELECT id FROM tables WHERE number = ?', [number]);
    if (existingTable) {
      return res.status(400).json({ error: 'Table number already exists' });
    }

    // Insert new table
    const result = await runQuery(
      'INSERT INTO tables (number, zone, seats) VALUES (?, ?, ?)',
      [number, zone, seats]
    );

    // Get created table
    const newTable = await getRow('SELECT * FROM tables WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Table created successfully',
      table: newTable
    });

  } catch (error) {
    console.error('Create table error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update table
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { number, zone, seats, status } = req.body;

    if (!number || !zone || !seats) {
      return res.status(400).json({ error: 'Table number, zone, and seats are required' });
    }

    // Check if table exists
    const existingTable = await getRow('SELECT id FROM tables WHERE id = ?', [id]);
    if (!existingTable) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Check if table number already exists for other tables
    const duplicateTable = await getRow('SELECT id FROM tables WHERE number = ? AND id != ?', [number, id]);
    if (duplicateTable) {
      return res.status(400).json({ error: 'Table number already exists' });
    }

    // Update table
    await runQuery(
      'UPDATE tables SET number = ?, zone = ?, seats = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [number, zone, seats, status || 'Available', id]
    );

    // Get updated table
    const updatedTable = await getRow('SELECT * FROM tables WHERE id = ?', [id]);

    res.json({
      message: 'Table updated successfully',
      table: updatedTable
    });

  } catch (error) {
    console.error('Update table error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete table (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if table exists
    const table = await getRow('SELECT id FROM tables WHERE id = ?', [id]);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Check if table has active orders
    const activeOrder = await getRow('SELECT id FROM orders WHERE table_id = ? AND status NOT IN (?, ?)', [id, 'Completed', 'Cancelled']);
    if (activeOrder) {
      return res.status(400).json({ error: 'Cannot delete table with active orders' });
    }

    // Delete table
    await runQuery('DELETE FROM tables WHERE id = ?', [id]);

    res.json({ message: 'Table deleted successfully' });

  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get table status summary
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    // Get tables by status
    const tablesByStatus = await getAll(`
      SELECT status, COUNT(*) as count 
      FROM tables 
      GROUP BY status
    `);

    // Get tables by zone
    const tablesByZone = await getAll(`
      SELECT zone, COUNT(*) as count 
      FROM tables 
      GROUP BY zone
    `);

    // Get total tables
    const totalTables = await getRow('SELECT COUNT(*) as count FROM tables');

    // Get occupied tables
    const occupiedTables = await getRow(`
      SELECT COUNT(*) as count 
      FROM tables 
      WHERE status IN ('Ordering', 'Full')
    `);

    res.json({
      summary: {
        totalTables: totalTables.count,
        occupiedTables: occupiedTables.count,
        availableTables: totalTables.count - occupiedTables.count,
        tablesByStatus,
        tablesByZone
      }
    });

  } catch (error) {
    console.error('Get table stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 