# BREWLUXE Backend Setup & Integration Guide

## Overview
The BREWLUXE application now includes a complete Node.js/Express backend with SQLite database for menu and product management. The frontend (`coffee.html`) automatically fetches menu items and products from the backend APIs instead of using hardcoded data.

## Project Structure

```
brewluxe--web/
├── coffee.html                 # Frontend (now with API integration)
├── mock-server/
│   └── mock_server.py         # Python mock server (old - can be replaced)
└── server/
    ├── package.json           # Node.js dependencies
    ├── server.js              # Express server with SQLite
    ├── brewluxe.db            # SQLite database (auto-created)
    └── [future: models/, routes/, config/]
```

## Setup Instructions

### Step 1: Install Node.js Dependencies

```bash
cd "d:\zoomy project\brewluxe--web\server"
npm install
```

This will install:
- `express` - Web framework
- `sqlite3` - Database driver
- `cors` - Cross-Origin Resource Sharing
- `body-parser` - JSON/URL-encoded body parsing

### Step 2: Start the Backend Server

```bash
npm start
```

Expected output:
```
🚀 BREWLUXE API Server running on http://localhost:3000
📊 Database: d:\zoomy project\brewluxe--web\server\brewluxe.db

📝 Available endpoints:
  GET    http://localhost:3000/api/menu
  POST   http://localhost:3000/api/menu
  PUT    http://localhost:3000/api/menu/:id
  DELETE http://localhost:3000/api/menu/:id
  GET    http://localhost:3000/api/products
  POST   http://localhost:3000/api/products
  GET    http://localhost:3000/api/orders
  POST   http://localhost:3000/api/orders
  POST   http://localhost:3000/api/admin/seed (reset with sample data)
  GET    http://localhost:3000/api/admin/stats
  GET    http://localhost:3000/api/health
```

### Step 3: Seed the Database with Sample Data

Open a **new terminal** and run:

```bash
curl -X POST http://localhost:3000/api/admin/seed
```

Expected response:
```json
{
  "message": "Database seeded with sample data",
  "menuItems": 8,
  "products": 6
}
```

This creates 8 menu items and 6 premium coffee products in the database.

### Step 4: Start the Frontend Server

Open another **new terminal** and run:

```bash
cd "d:\zoomy project\brewluxe--web"
python -m http.server 5520
```

### Step 5: Access the Application

1. Open your browser
2. Navigate to: **http://localhost:5520/coffee.html**
3. The frontend will automatically fetch menu items and products from the backend API
4. Check the browser console (F12 > Console) for logs:
   - ✓ Fetched menu items from API: 8
   - ✓ Fetched products from API: 6

## API Endpoints

### Menu Items

**Get all menu items:**
```bash
curl http://localhost:3000/api/menu
```

**Get single menu item:**
```bash
curl http://localhost:3000/api/menu/1
```

**Create menu item:**
```bash
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vanilla Latte",
    "description": "Smooth vanilla with espresso",
    "price": 4.99,
    "image": "https://example.com/image.jpg",
    "category": "latte"
  }'
```

**Update menu item:**
```bash
curl -X PUT http://localhost:3000/api/menu/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Espresso",
    "description": "Extra strong Italian classic",
    "price": 4.00,
    "image": "https://example.com/image.jpg",
    "category": "espresso"
  }'
```

**Delete menu item:**
```bash
curl -X DELETE http://localhost:3000/api/menu/1
```

### Products (Coffee Beans)

Same pattern as menu items but use `/api/products` endpoint:

```bash
curl http://localhost:3000/api/products
curl http://localhost:3000/api/products/101
```

### Orders

**Get all orders:**
```bash
curl http://localhost:3000/api/orders
```

**Create order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "ORD-001",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "555-0123",
    "orderType": "pickup",
    "items": [{"id": 1, "name": "Espresso", "quantity": 2, "price": 3.50}],
    "total": 7.00
  }'
```

### Admin Endpoints

**Reset database with sample data:**
```bash
curl -X POST http://localhost:3000/api/admin/seed
```

**Get database statistics:**
```bash
curl http://localhost:3000/api/admin/stats
```

Example response:
```json
{
  "menuItemCount": 8,
  "productCount": 6,
  "orderCount": 0,
  "totalRevenue": 0
}
```

**Health check:**
```bash
curl http://localhost:3000/api/health
```

## Frontend Integration

The `coffee.html` file now includes API integration:

### API Configuration
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Fetch Functions
```javascript
// Fetch menu items from API
async function fetchMenuItems() { ... }

// Fetch products from API
async function fetchProducts() { ... }
```

### Modified Initialization
The `initApp()` function is now `async` and:
1. Fetches menu items and products from the APIs
2. Shows loading indicators while fetching
3. Renders data when loaded
4. Displays error messages if API is unavailable
5. Falls back gracefully if data can't be fetched

### How It Works
1. Page loads → `window.addEventListener('DOMContentLoaded', initApp)`
2. `initApp()` is called (now async)
3. Loading indicators appear
4. `fetchMenuItems()` and `fetchProducts()` are awaited
5. Data renders in the UI
6. User can browse menu, add items, and checkout

## Troubleshooting

### "Unable to load menu items" Error
- ✓ Backend server is running on http://localhost:3000?
  - Check terminal where you ran `npm start`
  - Check for any error messages
- ✓ Database seeded with sample data?
  - Run: `curl -X POST http://localhost:3000/api/admin/seed`
- ✓ Browser console shows API error?
  - Press F12 → Console tab
  - Look for CORS or fetch errors
  - Check network tab for failed requests

### Database File Not Created
The database is auto-created at `server/brewluxe.db` on first run. If missing:
1. Delete `brewluxe.db` if it exists
2. Restart server: `npm start`
3. Seed database: `curl -X POST http://localhost:3000/api/admin/seed`

### CORS Errors
- Ensure `cors` is enabled in `server.js` (it is by default)
- Check that frontend is accessing correct API URL: `http://localhost:3000/api`
- Browser console will show specific CORS errors

### Port Already in Use
- Backend uses **port 3000** (can be changed via `PORT` environment variable)
- Frontend uses **port 5520** (specify different port to `http.server`)
- Change frontend port: `python -m http.server 5521`

## Sample Data

### Menu Items (8 total)
1. Espresso - $3.50
2. Cappuccino - $4.50
3. Caramel Latte - $5.00
4. Mocha - $5.50
5. Flat White - $4.75
6. Cold Brew - $4.25
7. Macchiato - $3.75
8. Affogato - $6.00

### Products (6 total)
1. Ethiopian Blend - $18.99 (⭐⭐⭐⭐⭐)
2. Colombian Supreme - $16.99 (⭐⭐⭐⭐)
3. Italian Roast - $15.99 (⭐⭐⭐⭐⭐)
4. Brazilian Santos - $17.99 (⭐⭐⭐⭐)
5. Sumatra Mandheling - $19.99 (⭐⭐⭐⭐⭐)
6. Kenya AA - $20.99 (⭐⭐⭐⭐⭐)

## Next Steps

### Short-term
- [ ] Test all CRUD operations via API
- [ ] Verify client updates menu/products when API data changes
- [ ] Test checkout with database-backed menu
- [ ] Add order history tracking

### Medium-term
- [ ] Add authentication/authorization (JWT tokens)
- [ ] Create admin panel for menu management
- [ ] Add categories and filtering
- [ ] Implement real payment processing

### Long-term
- [ ] Add more product fields (inventory, tags, etc.)
- [ ] Customer accounts and order history
- [ ] Email notifications for orders
- [ ] Analytics dashboard

## Files Modified
- **coffee.html**: Added API fetch functions, updated initApp() to be async, uses API data instead of hardcoded arrays
- **server/server.js**: Complete Express backend with SQLite (NEW)
- **server/package.json**: Node.js project manifest with dependencies (NEW)

## Summary
The BREWLUXE app now has a production-ready backend! The frontend automatically fetches menu and product data from the database, enabling dynamic menu management through the API. All data persists in SQLite and can be queried/updated via REST endpoints.
