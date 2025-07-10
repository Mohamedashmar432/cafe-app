const { db, runQuery } = require('../config/database');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing database...');

    // Create tables
    await createTables();
    
    // Insert sample data
    await insertSampleData();
    
    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

async function createTables() {
  // Users table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      employee_id TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('Admin', 'Waiter', 'Cashier')) NOT NULL,
      status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tables table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT UNIQUE NOT NULL,
      zone TEXT NOT NULL,
      seats INTEGER NOT NULL,
      status TEXT DEFAULT 'Available' CHECK(status IN ('Available', 'Ordering', 'Full', 'Booked')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Menu categories table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS menu_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Menu items table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category_id INTEGER NOT NULL,
      subcategory TEXT DEFAULT 'Normal' CHECK(subcategory IN ('Special', 'Strong', 'Less Sugar', 'Normal')),
      icon TEXT DEFAULT '🍽️',
      is_available BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES menu_categories (id) ON DELETE CASCADE
    )
  `);

  // Orders table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      table_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Confirmed', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled')),
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      gst_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      payment_status TEXT DEFAULT 'Pending' CHECK(payment_status IN ('Pending', 'Paid', 'Partially Paid')),
      payment_method TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (table_id) REFERENCES tables (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Order items table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price DECIMAL(10,2) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      modifiers TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items (id) ON DELETE CASCADE
    )
  `);

  // Transactions table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      payment_method TEXT NOT NULL,
      transaction_id TEXT,
      status TEXT DEFAULT 'Completed' CHECK(status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
    )
  `);

  console.log('📋 Tables created successfully');
}

async function insertSampleData() {
  // Insert default admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await runQuery(`
    INSERT OR IGNORE INTO users (name, email, employee_id, password_hash, role, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, ['Admin User', 'admin@cafe.com', '0001', adminPassword, 'Admin', 'Active']);

  // Insert menu categories
  const categories = [
    'Famous Prata Items',
    'Goreng Items',
    'Biryani',
    'Thosai',
    'Coffees',
    'Cold Drinks',
    'Teas',
    'Desserts'
  ];

  for (let i = 0; i < categories.length; i++) {
    await runQuery(`
      INSERT OR IGNORE INTO menu_categories (name, display_order)
      VALUES (?, ?)
    `, [categories[i], i + 1]);
  }

  // Insert sample tables
  const tables = [
    { number: '1', zone: 'Section 1', seats: 4 },
    { number: '2', zone: 'Section 1', seats: 4 },
    { number: '3', zone: 'Section 1', seats: 6 },
    { number: '4', zone: 'Section 2', seats: 4 },
    { number: '5', zone: 'Section 2', seats: 4 },
    { number: '6', zone: 'Section 2', seats: 8 },
    { number: '7', zone: 'Section 3', seats: 4 },
    { number: '8', zone: 'Section 3', seats: 6 },
    { number: '9', zone: 'Section 3', seats: 4 },
    { number: '10', zone: 'Section 3', seats: 6 }
  ];

  for (const table of tables) {
    await runQuery(`
      INSERT OR IGNORE INTO tables (number, zone, seats)
      VALUES (?, ?, ?)
    `, [table.number, table.zone, table.seats]);
  }

  // Insert sample menu items
  const menuItems = [
    // Famous Prata Items
    { name: 'Prata Kosong', price: 1.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { name: 'Prata Egg', price: 2.00, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { name: 'Prata Onion', price: 2.00, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { name: 'Prata Egg Onion', price: 2.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { name: 'Prata Tissue', price: 3.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Milo Prata', price: 3.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Prata Chocolate', price: 3.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Prata Cheese', price: 3.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Prata Mushroom', price: 3.00, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { name: 'Prata Cheese Mushroom', price: 4.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Prata Egg Cheese', price: 3.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Coin Prata Chicken', price: 4.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Coin Prata Mutton', price: 5.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Planta Prata', price: 2.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { name: 'Prata Hot Dog', price: 3.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Kothu Prata', price: 4.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Roti John', price: 3.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { name: 'Roti John Chicken', price: 4.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Roti John Mutton', price: 5.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { name: 'Roti John Sardines', price: 4.00, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { name: 'Roti John Tuna', price: 4.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },

    // Goreng Items
    { name: 'Mee Goreng Chicken', price: 5.50, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { name: 'Mee Goreng Mutton', price: 6.00, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { name: 'Mee Hoon Goreng', price: 5.00, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { name: 'Mee Hoon Special', price: 6.50, category: 'Goreng Items', subcategory: 'Special', icon: '🍜' },
    { name: 'Keow Trow Goreng', price: 5.50, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { name: 'Maggi Goreng', price: 4.50, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { name: 'Maggi Goreng Double', price: 6.00, category: 'Goreng Items', subcategory: 'Special', icon: '🍜' },
    { name: 'Maggi Goreng Mutton', price: 6.00, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { name: 'Maggi Goreng Chicken', price: 5.50, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { name: 'Mee Kuah', price: 4.00, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { name: 'Nasi Goreng Meeran', price: 5.50, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { name: 'Nasi Goreng Ayam', price: 6.00, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { name: 'Nasi Goreng Combo', price: 7.50, category: 'Goreng Items', subcategory: 'Special', icon: '🍜' },

    // Biryani
    { name: 'Chicken Biryani', price: 8.50, category: 'Biryani', subcategory: 'Normal', icon: '🍛' },
    { name: 'Mutton Biryani', price: 10.00, category: 'Biryani', subcategory: 'Normal', icon: '🍛' },
    { name: 'Special Biryani', price: 12.00, category: 'Biryani', subcategory: 'Special', icon: '🍛' },

    // Thosai
    { name: 'Normal Thosai', price: 2.00, category: 'Thosai', subcategory: 'Normal', icon: '🥘' },
    { name: 'Roast Thosai', price: 2.50, category: 'Thosai', subcategory: 'Normal', icon: '🥘' },
    { name: 'Egg Thosai', price: 3.00, category: 'Thosai', subcategory: 'Normal', icon: '🥘' },
    { name: 'Chicken Thosai', price: 4.00, category: 'Thosai', subcategory: 'Special', icon: '🥘' },
    { name: 'Mutton Thosai', price: 4.50, category: 'Thosai', subcategory: 'Special', icon: '🥘' },
    { name: 'Onion Thosai', price: 3.00, category: 'Thosai', subcategory: 'Normal', icon: '🥘' },

    // Coffees
    { name: 'Kopi', price: 1.50, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
    { name: 'Kopi O', price: 1.30, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
    { name: 'Kopi C', price: 1.70, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
    { name: 'Kopi Peng', price: 1.80, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
    { name: 'Kopi O Peng', price: 1.60, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
    { name: 'Kopi C Peng', price: 2.00, category: 'Coffees', subcategory: 'Normal', icon: '☕' },

    // Cold Drinks
    { name: 'Milo', price: 2.00, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },
    { name: 'Milo Peng', price: 2.50, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },
    { name: 'Lime Juice', price: 2.50, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },
    { name: 'Orange Juice', price: 3.00, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },
    { name: 'Bandung', price: 2.50, category: 'Cold Drinks', subcategory: 'Special', icon: '🧊' },
    { name: 'Teh Tarik Peng', price: 2.00, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },

    // Teas
    { name: 'Teh', price: 1.50, category: 'Teas', subcategory: 'Normal', icon: '🍵' },
    { name: 'Teh O', price: 1.30, category: 'Teas', subcategory: 'Normal', icon: '🍵' },
    { name: 'Teh C', price: 1.70, category: 'Teas', subcategory: 'Normal', icon: '🍵' },
    { name: 'Teh Tarik', price: 2.00, category: 'Teas', subcategory: 'Special', icon: '🍵' },
    { name: 'Teh Halia', price: 2.00, category: 'Teas', subcategory: 'Special', icon: '🍵' },

    // Desserts
    { name: 'Ice Cream', price: 3.00, category: 'Desserts', subcategory: 'Normal', icon: '🍨' },
    { name: 'Cendol', price: 3.50, category: 'Desserts', subcategory: 'Special', icon: '🍨' },
    { name: 'Ice Kacang', price: 4.00, category: 'Desserts', subcategory: 'Special', icon: '🍨' },
    { name: 'Pulut Hitam', price: 3.50, category: 'Desserts', subcategory: 'Special', icon: '🍨' }
  ];

  for (const item of menuItems) {
    const categoryId = await getCategoryId(item.category);
    if (categoryId) {
      await runQuery(`
        INSERT OR IGNORE INTO menu_items (name, price, category_id, subcategory, icon)
        VALUES (?, ?, ?, ?, ?)
      `, [item.name, item.price, categoryId, item.subcategory, item.icon]);
    }
  }

  console.log('📊 Sample data inserted successfully');
}

async function getCategoryId(categoryName) {
  const { getRow } = require('../config/database');
  const category = await getRow('SELECT id FROM menu_categories WHERE name = ?', [categoryName]);
  return category ? category.id : null;
}

// Run initialization
initializeDatabase(); 