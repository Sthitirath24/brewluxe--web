# 🔍 Menu Not Working - Troubleshooting Guide

## Diagnosis Checklist

Let me help you fix the menu issue. Follow these steps:

---

## 📋 Step 1: Verify Backend is Running

Open a **NEW** PowerShell terminal and run:

```powershell
curl http://localhost:3000/api/health
```

**You should see:**
```json
{"status":"ok","timestamp":"2025-11-28T...","database":"connected"}
```

**If you get an error:**
- Backend is NOT running
- Go to Step 2

---

## 🚀 Step 2: Start Backend Server (if not running)

```powershell
cd "d:\zoomy project\brewluxe--web\server"
npm start
```

**Wait for this message:**
```
🚀 BREWLUXE API Server running on http://localhost:3000
✓ Connected to SQLite database
```

**Don't close this terminal!**

---

## 🌱 Step 3: Seed Database

Open a **NEW** PowerShell terminal and run:

```powershell
curl -X POST http://localhost:3000/api/admin/seed
```

**You should see:**
```json
{"message":"Database seeded with sample data","menuItems":8,"products":6}
```

**If you get an error:**
- Backend not running (go back to Step 2)
- or database corruption

---

## ✅ Step 4: Test API Endpoints

In the same terminal, test these:

```powershell
# Get all menu items
curl http://localhost:3000/api/menu

# Get all products
curl http://localhost:3000/api/products

# Get statistics
curl http://localhost:3000/api/admin/stats
```

**You should see JSON data for each.**

---

## 🌐 Step 5: Start Frontend Server

Open a **THIRD** PowerShell terminal and run:

```powershell
cd "d:\zoomy project\brewluxe--web"
python -m http.server 5520
```

**You should see:**
```
Serving HTTP on 0.0.0.0 port 5520
```

---

## 🎯 Step 6: Test in Browser

1. Open: **http://localhost:5520/coffee.html**
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. You should see:
   ```
   ✓ Fetched menu items from API: 8
   ✓ Fetched products from API: 6
   ```

**If you see these messages = Working! ✅**

---

## 🚨 Troubleshooting

### "Cannot reach http://localhost:3000"
**Solution:**
1. Make sure backend is running (Step 2)
2. Check if port 3000 is free: `netstat -ano | findstr :3000`
3. If port in use, kill it or use different port

### "Backend responds but menu empty"
**Solution:**
1. Seed database: `curl -X POST http://localhost:3000/api/admin/seed`
2. Check if seeding worked: `curl http://localhost:3000/api/menu`

### "Browser shows 'Unable to load menu items'"
**Solution:**
1. Check browser console (F12 > Console)
2. Look for error messages (red text)
3. Check Network tab to see if API calls succeed

### "Still not working"
**Try these:**

```powershell
# Check if servers running on correct ports
netstat -ano | findstr :3000
netstat -ano | findstr :5520

# Restart backend
# 1. Press Ctrl+C in backend terminal
# 2. Run: npm start again

# Clear browser cache
# Ctrl+Shift+Delete to open cache clear dialog
# Clear all data
# Reload page: http://localhost:5520/coffee.html
```

---

## 📊 Expected Output

### Frontend (coffee.html) should show:
- ✅ 8 menu items (Espresso, Cappuccino, etc.)
- ✅ 6 products (Ethiopian, Colombian, etc.)
- ✅ All with prices and images
- ✅ Add to cart buttons working

### Backend logs should show:
- ✅ "Connected to SQLite database"
- ✅ "Menu items table ready"
- ✅ "Products table ready"
- ✅ GET requests logged

### Browser console should show:
- ✅ "✓ Fetched menu items from API: 8"
- ✅ "✓ Fetched products from API: 6"
- ✅ No red error messages

---

## 🎯 Quick Checklist

- [ ] Backend server running on port 3000 (`npm start`)
- [ ] Database seeded (`curl -X POST .../seed`)
- [ ] Frontend server running on port 5520 (`python -m http.server 5520`)
- [ ] Page loads at http://localhost:5520/coffee.html
- [ ] 8 menu items visible
- [ ] 6 products visible
- [ ] Console shows fetch success messages
- [ ] Add to cart works

**All checked = Menu working! ✅**

---

## 💡 Still Having Issues?

Try this complete reset:

```powershell
# Terminal 1: Backend
cd "d:\zoomy project\brewluxe--web\server"
del brewluxe.db                    # Delete old database
npm start                          # Start fresh

# Terminal 2: Seed (wait 2 seconds after backend starts)
curl -X POST http://localhost:3000/api/admin/seed

# Terminal 3: Frontend
cd "d:\zoomy project\brewluxe--web"
python -m http.server 5520

# Browser
http://localhost:5520/coffee.html
```

---

## 🔧 Technical Details

### Architecture
```
Browser (Port 5520)
    ↓ Fetch API
    ↓ http://localhost:3000/api/menu
Express Server (Port 3000)
    ↓ SQL Query
    ↓ SELECT * FROM menu_items
SQLite Database
    ↓ Returns data
```

### Data Flow
1. coffee.html loads
2. `initApp()` called (async)
3. `await fetchMenuItems()` → HTTP GET to port 3000
4. Backend returns JSON
5. Frontend stores in `menuItems = [...]`
6. `renderMenu()` builds HTML
7. User sees menu items

---

**Still stuck? Tell me:**
1. Does `curl http://localhost:3000/api/health` work?
2. Does `curl http://localhost:3000/api/menu` return data?
3. What error appears in browser console (F12)?

Then I can help more specifically! 🚀**
