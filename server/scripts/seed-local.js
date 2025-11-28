const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'brewluxe.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open DB:', err);
    process.exit(1);
  }
});

function run() {
  db.serialize(() => {
    db.run('DELETE FROM menu_items');
    db.run('DELETE FROM products');

    const menuItems = [
      ['Espresso', 'Rich and bold Italian classic', 3.5, 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=400&h=300&fit=crop', 'espresso'],
      ['Cappuccino', 'Smooth espresso with steamed milk foam', 4.5, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', 'espresso'],
      ['Caramel Latte', 'Sweet caramel with creamy milk', 5.0, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', 'latte'],
      ['Mocha', 'Chocolate and espresso perfection', 5.5, 'https://images.unsplash.com/photo-1607260550778-aa9d29444ce1?w=400&h=300&fit=crop', 'mocha'],
      ['Flat White', 'Velvety microfoam with espresso', 4.75, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop', 'espresso'],
      ['Cold Brew', 'Smooth, refreshing cold-steeped coffee', 4.25, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop', 'cold'],
      ['Macchiato', 'Espresso marked with foam', 3.75, 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=400&h=300&fit=crop', 'espresso'],
      ['Affogato', 'Espresso over vanilla ice cream', 6.0, 'https://images.unsplash.com/photo-1563741451-a0f6a7624c95?w=400&h=300&fit=crop', 'dessert']
    ];

    const pStmt = db.prepare('INSERT INTO menu_items (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)');
    menuItems.forEach(m => pStmt.run(m));
    pStmt.finalize();

    const products = [
      ['Ethiopian Blend', 'Fruity and floral notes', 18.99, 5, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop'],
      ['Colombian Supreme', 'Rich and balanced', 16.99, 4, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop'],
      ['Italian Roast', 'Dark and intense', 15.99, 5, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop'],
      ['Brazilian Santos', 'Smooth and nutty', 17.99, 4, 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400&h=300&fit=crop'],
      ['Sumatra Mandheling', 'Full-bodied and earthy', 19.99, 5, 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=300&fit=crop'],
      ['Kenya AA', 'Bright and wine-like', 20.99, 5, 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=300&fit=crop']
    ];

    const prodStmt = db.prepare('INSERT INTO products (name, description, price, rating, image) VALUES (?, ?, ?, ?, ?)');
    products.forEach(p => prodStmt.run(p));
    prodStmt.finalize(() => {
      console.log('Database seeded (local script) with menuItems=8 products=6');
      db.close(() => process.exit(0));
    });
  });
}

run();
