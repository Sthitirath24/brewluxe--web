# Run BREWLUXE Locally (Without Docker)

If Docker is not installed on your machine, you can run the app using the local Node backend and browser.

## Quick Start

### Terminal 1: Start the backend server
```powershell
cd .\server
npm start
```

Expected output:
```
✓ Connected to SQLite database
🚀 BREWLUXE API Server running on http://localhost:3000
✓ Menu items table ready
✓ Products table ready
✓ Orders table ready
```

### Terminal 2 (optional): Seed the database if needed
If the database is empty, run:
```powershell
cd .\server
node scripts/seed-local.js
```

Expected output:
```
Database seeded (local script) with menuItems=8 products=6
```

### Open the app in your browser
- http://localhost:3000

The backend automatically serves the frontend (`coffee.html`) at the root.

## Test the API

From a PowerShell prompt:
```powershell
# Get menu items
Invoke-RestMethod -Uri "http://localhost:3000/api/menu" | ConvertTo-Json

# Get products
Invoke-RestMethod -Uri "http://localhost:3000/api/products" | ConvertTo-Json

# Check health
Invoke-RestMethod -Uri "http://localhost:3000/api/health" | ConvertTo-Json

# View stats
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/stats" | ConvertTo-Json
```

## Install Docker (Optional)

If you want to use Docker later:
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install and restart your machine
3. Then run:
   ```powershell
   docker compose -f docker-compose.single.yml up --build -d
   ```

