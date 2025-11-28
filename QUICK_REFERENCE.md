# BREWLUXE - Quick Reference Guide

## 🚀 Installation & Startup (5 minutes)

### Required Software
```
✓ Node.js (download from nodejs.org)
✓ Python (likely already installed)
✓ Git (optional, for version control)
```

### Terminal Commands Cheat Sheet

#### Terminal 1 - Install & Start Backend
```powershell
cd "d:\zoomy project\brewluxe--web\server"
npm install
npm start
```

#### Terminal 2 - Seed Database
```powershell
curl -X POST http://localhost:3000/api/admin/seed
```

#### Terminal 3 - Start Frontend
```powershell
cd "d:\zoomy project\brewluxe--web"
python -m http.server 5520
```

#### Terminal 4 - Open Application
```
Browser: http://localhost:5520/coffee.html
```

---

## 🧪 API Testing Cheat Sheet

### Menu Endpoints
```bash
# Get all menu items
curl http://localhost:3000/api/menu

# Get single item
curl http://localhost:3000/api/menu/1

# Create item
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{"name":"Vanilla Latte","description":"Smooth vanilla with espresso","price":5.25,"category":"latte"}'

# Update item
curl -X PUT http://localhost:3000/api/menu/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Vanilla Latte","price":5.50}'

# Delete item
curl -X DELETE http://localhost:3000/api/menu/1
```

### Products Endpoints
```bash
# Get all products
curl http://localhost:3000/api/products

# Create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Brazilian Roast","description":"Smooth and nutty","price":17.99,"rating":5}'
```

### Admin Endpoints
```bash
# Reset database
curl -X POST http://localhost:3000/api/admin/seed

# View statistics
curl http://localhost:3000/api/admin/stats
```

---

## 🔍 Debugging Checklist

### Check Backend
```powershell
# Is Node.js installed?
node --version

# Is npm working?
npm --version

# Can you connect to backend?
curl http://localhost:3000/api/health
```

### Check Frontend
```
1. Open http://localhost:5520/coffee.html
2. Press F12 to open DevTools
3. Go to Console tab
4. Look for messages:
   - ✓ Fetched menu items from API: 8
   - ✓ Fetched products from API: 6
5. Check Network tab for failed requests
```

### Check Database
```powershell
# View all menu items
curl http://localhost:3000/api/menu

# Count should be: 8 items (after seed)
```

---

## 📊 Port Reference

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Frontend | 5520 | http://localhost:5520/coffee.html | Python HTTP Server |
| Backend API | 3000 | http://localhost:3000/api/menu | Express.js Server |
| Database | N/A | server/brewluxe.db | SQLite File |

---

## 📁 Important File Locations

```
d:\zoomy project\brewluxe--web\
├── coffee.html                      ← Frontend (updated!)
├── server/
│   ├── server.js                    ← Backend (new!)
│   ├── package.json                 ← Dependencies (new!)
│   └── brewluxe.db                  ← Database (created at runtime)
├── README_SETUP.md                  ← Start here for detailed setup
├── INTEGRATION_SUMMARY.md           ← Quick overview
└── ARCHITECTURE_DIAGRAMS.md         ← System diagrams
```

---

## 🎯 Feature Testing Checklist

- [ ] **Menu Display**
  - [ ] Visit http://localhost:5520/coffee.html
  - [ ] See 8 coffee drinks displayed
  - [ ] Each has name, price, image

- [ ] **Products Display**
  - [ ] See 6 premium coffee products
  - [ ] Each has rating (stars)
  - [ ] Each has price

- [ ] **Add to Cart**
  - [ ] Click cart icon on menu item
  - [ ] Cart counter increases
  - [ ] Item appears in cart

- [ ] **Checkout**
  - [ ] Click checkout button
  - [ ] Form opens with menu items in cart
  - [ ] Fill form and submit
  - [ ] Success message appears

- [ ] **API Updates**
  - [ ] Add new menu item via API
  - [ ] Refresh browser page
  - [ ] New item appears immediately

---

## 🚨 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "npm not recognized" | Node.js not installed | Install from nodejs.org |
| "Cannot connect to localhost:3000" | Backend not running | Run `npm start` in server directory |
| "Unable to load menu items" | API not responding | Check backend, check database seed |
| "CORS error" in console | Common, usually works anyway | Check Network tab in DevTools |
| "EADDRINUSE :::3000" | Port already in use | Kill other process or use different port |
| Database file not created | Server never started | Start backend, will auto-create |

---

## 📈 Data Flow (Simplified)

```
Browser loads coffee.html
    ↓
JavaScript fetch('http://localhost:3000/api/menu')
    ↓
Backend receives GET /api/menu
    ↓
Execute: SELECT * FROM menu_items
    ↓
Database returns 8 items
    ↓
Backend sends JSON response
    ↓
Browser renders menu items on page
    ↓
User sees: 8 coffee drinks with prices & images
```

---

## 🧑‍💻 Development Mode

### Watch for Backend Changes
```powershell
# Install nodemon globally (optional)
npm install -g nodemon

# Run in watch mode
nodemon server.js
```

### Hot Reload Frontend
- Just refresh browser (F5)
- Changes in coffee.html appear instantly

### Clear Data
```bash
# Reset database to original state
curl -X POST http://localhost:3000/api/admin/seed
```

---

## 🔐 Security Notes

⚠️ **Current State:**
- No authentication (anyone can access API)
- No authorization (no role-based access)
- No input validation on API (basic validation only)
- Database is local file (no backup)

### For Production Add:
- JWT authentication
- User roles & permissions
- Input validation & sanitization
- Database backups
- HTTPS/SSL certificates
- Rate limiting
- API key management

---

## 📚 Documentation Map

| Document | When to Read | Key Topics |
|----------|--------------|-----------|
| README_SETUP.md | First-time setup | Installation, Node.js setup |
| INTEGRATION_SUMMARY.md | Before troubleshooting | What was changed, overview |
| BACKEND_SETUP.md | Detailed reference | API endpoints, troubleshooting |
| ARCHITECTURE_DIAGRAMS.md | Understanding system | Data flow, architecture |
| API_INTEGRATION_COMPLETE.md | Deep dive | How integration works |
| quickstart.ps1 | Automation | Run all setup steps |

---

## ✨ Key Achievements

### ✅ Frontend (coffee.html)
- Converts hardcoded data to API-driven
- 3 API fetch calls on page load
- Loading indicators while fetching
- Error handling with fallback messages
- All existing features still work

### ✅ Backend (server.js)
- 15+ REST API endpoints
- Full CRUD operations
- SQLite database integration
- CORS enabled for cross-origin requests
- Admin endpoints for management

### ✅ Database (SQLite)
- Persistent storage for menu items
- Persistent storage for products
- Order tracking capability
- Automatic timestamps
- Auto-initialized on startup

---

## 🎓 Next Learning Steps

1. **API Testing**
   - Use curl or Postman to test endpoints
   - Try creating, updating, deleting items

2. **Database Exploration**
   - Download SQLite Browser
   - Open brewluxe.db to inspect data
   - Run SQL queries directly

3. **Code Understanding**
   - Read server.js comments
   - Follow the data flow
   - Study Express.js patterns

4. **Enhancements**
   - Add validation rules
   - Add error handling
   - Add logging
   - Add authentication

---

## 🎯 Success Criteria

You'll know it's working when:

```
✅ npm install completes without errors
✅ npm start shows "BREWLUXE API Server running on http://localhost:3000"
✅ curl http://localhost:3000/api/admin/stats returns JSON
✅ http://localhost:5520/coffee.html loads
✅ Browser console shows "✓ Fetched menu items from API: 8"
✅ Browser console shows "✓ Fetched products from API: 6"
✅ Menu items visible (8 drinks with images)
✅ Products visible (6 coffee beans with ratings)
✅ Can add items to cart
✅ Can complete checkout process
```

All 10 items = 🎉 **Full Integration Complete!**

---

## 📞 Need Help?

1. **Check browser console** (F12 > Console)
2. **Check Network tab** for failed API calls
3. **Check terminal output** for backend errors
4. **Read BACKEND_SETUP.md** for detailed troubleshooting
5. **Verify all 3 servers running** (backend, frontend, none on conflicting ports)

---

*Last Updated: November 28, 2025*  
*Version: 1.0 - API Integration Complete*
