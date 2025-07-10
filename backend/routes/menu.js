const express = require('express');
const { getRow, runQuery, getAll } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all menu categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await getAll(
      'SELECT * FROM menu_categories ORDER BY display_order, name'
    );
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all menu items with categories
router.get('/items', async (req, res) => {
  try {
    const items = await getAll(`
      SELECT 
        mi.id,
        mi.name,
        mi.price,
        mi.subcategory,
        mi.icon,
        mi.is_available,
        mc.name as category_name,
        mc.id as category_id
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.is_available = 1
      ORDER BY mc.display_order, mc.name, mi.name
    `);

    // Group items by category
    const menuByCategory = items.reduce((acc, item) => {
      if (!acc[item.category_name]) {
        acc[item.category_name] = [];
      }
      acc[item.category_name].push({
        id: item.id.toString(),
        name: item.name,
        price: parseFloat(item.price),
        category: item.category_name,
        subcategory: item.subcategory,
        icon: item.icon
      });
      return acc;
    }, {});

    res.json({ menu: menuByCategory });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all menu items (admin view - includes unavailable items)
router.get('/items/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const items = await getAll(`
      SELECT 
        mi.id,
        mi.name,
        mi.price,
        mi.subcategory,
        mi.icon,
        mi.is_available,
        mc.name as category_name,
        mc.id as category_id,
        mi.created_at,
        mi.updated_at
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.id
      ORDER BY mc.display_order, mc.name, mi.name
    `);

    res.json({ items });
  } catch (error) {
    console.error('Get all menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create new menu item
router.post('/items', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, price, categoryId, subcategory, icon } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    // Check if category exists
    const category = await getRow('SELECT id FROM menu_categories WHERE id = ?', [categoryId]);
    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Insert new menu item
    const result = await runQuery(
      'INSERT INTO menu_items (name, price, category_id, subcategory, icon) VALUES (?, ?, ?, ?, ?)',
      [name, price, categoryId, subcategory || 'Normal', icon || '🍽️']
    );

    // Get the created item
    const newItem = await getRow(`
      SELECT 
        mi.id,
        mi.name,
        mi.price,
        mi.subcategory,
        mi.icon,
        mi.is_available,
        mc.name as category_name,
        mc.id as category_id
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.id = ?
    `, [result.id]);

    res.status(201).json({
      message: 'Menu item created successfully',
      item: newItem
    });

  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update menu item
router.put('/items/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, subcategory, icon, isAvailable } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    // Check if item exists
    const existingItem = await getRow('SELECT id FROM menu_items WHERE id = ?', [id]);
    if (!existingItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Check if category exists
    const category = await getRow('SELECT id FROM menu_categories WHERE id = ?', [categoryId]);
    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Update menu item
    await runQuery(
      'UPDATE menu_items SET name = ?, price = ?, category_id = ?, subcategory = ?, icon = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, price, categoryId, subcategory || 'Normal', icon || '🍽️', isAvailable !== undefined ? isAvailable : 1, id]
    );

    // Get updated item
    const updatedItem = await getRow(`
      SELECT 
        mi.id,
        mi.name,
        mi.price,
        mi.subcategory,
        mi.icon,
        mi.is_available,
        mc.name as category_name,
        mc.id as category_id
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.id = ?
    `, [id]);

    res.json({
      message: 'Menu item updated successfully',
      item: updatedItem
    });

  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete menu item
router.delete('/items/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const item = await getRow('SELECT id FROM menu_items WHERE id = ?', [id]);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Check if item is used in any orders
    const orderItem = await getRow('SELECT id FROM order_items WHERE menu_item_id = ? LIMIT 1', [id]);
    if (orderItem) {
      return res.status(400).json({ error: 'Cannot delete menu item that has been ordered' });
    }

    // Delete menu item
    await runQuery('DELETE FROM menu_items WHERE id = ?', [id]);

    res.json({ message: 'Menu item deleted successfully' });

  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create new category
router.post('/categories', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, displayOrder } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if category already exists
    const existingCategory = await getRow('SELECT id FROM menu_categories WHERE name = ?', [name]);
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Insert new category
    const result = await runQuery(
      'INSERT INTO menu_categories (name, display_order) VALUES (?, ?)',
      [name, displayOrder || 0]
    );

    // Get the created category
    const newCategory = await getRow('SELECT * FROM menu_categories WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update category
router.put('/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, displayOrder } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if category exists
    const existingCategory = await getRow('SELECT id FROM menu_categories WHERE id = ?', [id]);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if name already exists for other categories
    const duplicateCategory = await getRow('SELECT id FROM menu_categories WHERE name = ? AND id != ?', [name, id]);
    if (duplicateCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    // Update category
    await runQuery(
      'UPDATE menu_categories SET name = ?, display_order = ? WHERE id = ?',
      [name, displayOrder || 0, id]
    );

    // Get updated category
    const updatedCategory = await getRow('SELECT * FROM menu_categories WHERE id = ?', [id]);

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete category
router.delete('/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await getRow('SELECT id FROM menu_categories WHERE id = ?', [id]);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has menu items
    const menuItem = await getRow('SELECT id FROM menu_items WHERE category_id = ? LIMIT 1', [id]);
    if (menuItem) {
      return res.status(400).json({ error: 'Cannot delete category that has menu items' });
    }

    // Delete category
    await runQuery('DELETE FROM menu_categories WHERE id = ?', [id]);

    res.json({ message: 'Category deleted successfully' });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 