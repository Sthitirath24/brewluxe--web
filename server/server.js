/**
 * BREWLUXE Backend Server
 * Express.js + SQLite database for menu and product management
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend static files from repository root (so coffee.html at project root is served)
const FRONTEND_ROOT = path.join(__dirname, '..');
app.use(express.static(FRONTEND_ROOT));
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_ROOT, 'coffee.html'));
});

// Database initialization
const DB_PATH = path.join(__dirname, 'brewluxe.db');
let db;

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Database connection failed:', err);
                reject(err);
            } else {
                console.log('✓ Connected to SQLite database');
                createTables();
                resolve(db);
            }
        });
    });
}

function createTables() {
    db.serialize(() => {
        // Menu items table
        db.run(`
            CREATE TABLE IF NOT EXISTS menu_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                image TEXT,
                category TEXT DEFAULT 'espresso',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('Menu items table error:', err);
            else console.log('✓ Menu items table ready');
        });

        // Products table (coffee beans)
        db.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                rating INTEGER DEFAULT 5,
                image TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('Products table error:', err);
            else console.log('✓ Products table ready');
        });

        // Orders table
        db.run(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                orderNumber TEXT UNIQUE NOT NULL,
                customerName TEXT NOT NULL,
                customerEmail TEXT NOT NULL,
                customerPhone TEXT,
                orderType TEXT DEFAULT 'pickup',
                items TEXT NOT NULL,
                total REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('Orders table error:', err);
            else console.log('✓ Orders table ready');
        });
    });
}

// ============ MENU ENDPOINTS ============

// GET all menu items
app.get('/api/menu', (req, res) => {
    db.all('SELECT * FROM menu_items ORDER BY category, name', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

// GET single menu item
app.get('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM menu_items WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Menu item not found' });
        } else {
            res.json(row);
        }
    });
});

// CREATE menu item
app.post('/api/menu', (req, res) => {
    const { name, description, price, image, category } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const stmt = db.prepare(`
        INSERT INTO menu_items (name, description, price, image, category)
        VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run([name, description || '', price, image || '', category || 'espresso'], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, name, description, price, image, category });
        }
    });
    stmt.finalize();
});

// UPDATE menu item
app.put('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, image, category } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const stmt = db.prepare(`
        UPDATE menu_items 
        SET name = ?, description = ?, price = ?, image = ?, category = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    stmt.run([name, description || '', price, image || '', category || 'espresso', id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Menu item not found' });
        } else {
            res.json({ id: parseInt(id), name, description, price, image, category });
        }
    });
    stmt.finalize();
});

// DELETE menu item
app.delete('/api/menu/:id', (req, res) => {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM menu_items WHERE id = ?');
    stmt.run([id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Menu item not found' });
        } else {
            res.json({ message: 'Menu item deleted', id });
        }
    });
    stmt.finalize();
});

// ============ PRODUCTS ENDPOINTS ============

// GET all products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products ORDER BY name', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(row);
        }
    });
});

// CREATE product
app.post('/api/products', (req, res) => {
    const { name, description, price, rating, image } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const stmt = db.prepare(`
        INSERT INTO products (name, description, price, rating, image)
        VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run([name, description || '', price, rating || 5, image || ''], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, name, description, price, rating, image });
        }
    });
    stmt.finalize();
});

// UPDATE product
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, rating, image } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const stmt = db.prepare(`
        UPDATE products 
        SET name = ?, description = ?, price = ?, rating = ?, image = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    stmt.run([name, description || '', price, rating || 5, image || '', id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json({ id: parseInt(id), name, description, price, rating, image });
        }
    });
    stmt.finalize();
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    stmt.run([id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json({ message: 'Product deleted', id });
        }
    });
    stmt.finalize();
});

// ============ ORDERS ENDPOINTS ============

// GET all orders
app.get('/api/orders', (req, res) => {
    db.all('SELECT * FROM orders ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

// CREATE order
app.post('/api/orders', (req, res) => {
    const { orderNumber, customerName, customerEmail, customerPhone, orderType, items, total } = req.body;

    if (!orderNumber || !customerName || !items || total === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare(`
        INSERT INTO orders (orderNumber, customerName, customerEmail, customerPhone, orderType, items, total, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([orderNumber, customerName, customerEmail || '', customerPhone || '', orderType, JSON.stringify(items), total, 'pending'], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, orderNumber });
        }
    });
    stmt.finalize();
});

// ============ ADMIN ENDPOINTS ============

// SEED database with sample data
app.post('/api/admin/seed', (req, res) => {
    // Clear existing data
    db.serialize(() => {
        db.run('DELETE FROM menu_items');
        db.run('DELETE FROM products');

        // Insert menu items
        const menuItems = [
            ['Espresso', 'Rich and bold Italian classic', 3.50, 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=400&h=300&fit=crop', 'espresso'],
            ['Cappuccino', 'Smooth espresso with steamed milk foam', 4.50, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', 'espresso'],
            ['Caramel Latte', 'Sweet caramel with creamy milk', 5.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', 'latte'],
            ['Mocha', 'Chocolate and espresso perfection', 5.50, 'https://images.unsplash.com/photo-1607260550778-aa9d29444ce1?w=400&h=300&fit=crop', 'mocha'],
            ['Flat White', 'Velvety microfoam with espresso', 4.75, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop', 'espresso'],
            ['Cold Brew', 'Smooth, refreshing cold-steeped coffee', 4.25, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop', 'cold'],
            ['Macchiato', 'Espresso marked with foam', 3.75, 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=400&h=300&fit=crop', 'espresso'],
            ['Affogato', 'Espresso over vanilla ice cream', 6.00, 'https://images.unsplash.com/photo-1563741451-a0f6a7624c95?w=400&h=300&fit=crop', 'dessert']
        ];

        menuItems.forEach(item => {
            const stmt = db.prepare('INSERT INTO menu_items (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)');
            stmt.run(item);
            stmt.finalize();
        });

        // Insert products
        const products = [
            ['Ethiopian Blend', 'Fruity and floral notes', 18.99, 5, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop'],
            ['Colombian Supreme', 'Rich and balanced', 16.99, 4, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop'],
            ['Italian Roast', 'Dark and intense', 15.99, 5, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop'],
            ['Brazilian Santos', 'Smooth and nutty', 17.99, 4, 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400&h=300&fit=crop'],
            ['Sumatra Mandheling', 'Full-bodied and earthy', 19.99, 5, 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=300&fit=crop'],
            ['Kenya AA', 'Bright and wine-like', 20.99, 5, 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=300&fit=crop']
        ];

        products.forEach(product => {
            const stmt = db.prepare('INSERT INTO products (name, description, price, rating, image) VALUES (?, ?, ?, ?, ?)');
            stmt.run(product);
            stmt.finalize();
        });
    });

    res.json({ message: 'Database seeded with sample data', menuItems: 8, products: 6 });
});

// GET admin stats
app.get('/api/admin/stats', (req, res) => {
    db.all(`
        SELECT 
            (SELECT COUNT(*) FROM menu_items) as menuItemCount,
            (SELECT COUNT(*) FROM products) as productCount,
            (SELECT COUNT(*) FROM orders) as orderCount,
            (SELECT COALESCE(SUM(total), 0) FROM orders) as totalRevenue
    `, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows[0] || {});
        }
    });
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'connected' });
});

// ============ START SERVER ============

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n🚀 BREWLUXE API Server running on http://localhost:${PORT}`);
            console.log(`📊 Database: ${DB_PATH}`);
            console.log(`\n📝 Available endpoints:`);
            console.log(`  GET    http://localhost:${PORT}/api/menu`);
            console.log(`  POST   http://localhost:${PORT}/api/menu`);
            console.log(`  PUT    http://localhost:${PORT}/api/menu/:id`);
            console.log(`  DELETE http://localhost:${PORT}/api/menu/:id`);
            console.log(`  GET    http://localhost:${PORT}/api/products`);
            console.log(`  POST   http://localhost:${PORT}/api/products`);
            console.log(`  GET    http://localhost:${PORT}/api/orders`);
            console.log(`  POST   http://localhost:${PORT}/api/orders`);
            console.log(`  POST   http://localhost:${PORT}/api/admin/seed (reset with sample data)`);
            console.log(`  GET    http://localhost:${PORT}/api/admin/stats`);
            console.log(`  GET    http://localhost:${PORT}/api/health\n`);
        });
    })
    .catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nShutting down server...');
    db.close((err) => {
        if (err) console.error(err);
        else console.log('Database connection closed');
        process.exit(0);
    });
});
