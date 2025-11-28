# Node.js Installation Guide for Windows

## ✅ Browser Opening Now

A browser window should have opened automatically to: **https://nodejs.org/**

If not, visit it manually.

---

## 📋 Installation Steps

### Step 1: Download
On the Node.js website, you'll see two buttons:
- **LTS** (Long Term Support) - **← CLICK THIS ONE** ✅
- Current

**Why LTS?** More stable, recommended for production.

### Step 2: Run Installer
1. The `.msi` file should download automatically
2. Double-click the downloaded file
3. Windows will ask for permission - click **Yes**

### Step 3: Installation Wizard
Follow the wizard (accept all defaults):
1. Read and accept the license agreement → **Next**
2. Accept the installation path → **Next**
3. Keep features as-is (all selected) → **Next**
4. Skip native modules installation → **Next**
5. Click **Install** → Wait for completion
6. Click **Finish**

### Step 4: Verify Installation
Open a **NEW** PowerShell window and run:

```powershell
node --version
npm --version
```

**You should see version numbers like:**
```
v20.10.0  (or higher)
10.2.0    (or higher)
```

---

## 🎯 What Gets Installed

Node.js includes:
- ✅ **node** - JavaScript runtime
- ✅ **npm** - Package manager (like app store for Node.js)
- ✅ **npx** - Execute npm packages

All three are needed for the BREWLUXE backend.

---

## ✨ After Installation

Once Node.js is installed, come back and run:

```powershell
cd "d:\zoomy project\brewluxe--web\server"
npm install
npm start
```

Then everything will work!

---

## 🚨 Troubleshooting Installation

### Issue: "Still says npm not recognized"
**Solution:** 
1. Close ALL PowerShell windows
2. Open a completely NEW PowerShell window
3. Try again: `node --version`

### Issue: Installer won't run
**Solution:**
1. Right-click the .msi file
2. Select "Run as Administrator"

### Issue: Installation freezes
**Solution:**
1. Cancel and restart
2. Ensure you have write permissions to C:\Program Files\
3. Disable antivirus temporarily

---

## 💡 Tips

- **LTS Version:** Choose the LTS (Long Term Support) version, not "Current"
- **Installation Path:** Accept the default (C:\Program Files\nodejs\)
- **PATH:** Node.js automatically adds itself to system PATH
- **New Terminal:** You MUST open a new PowerShell after installation for npm to work

---

## ⏱️ Estimated Time
About **3-5 minutes** for download and installation

---

## ✅ Next Steps After Installation

1. **Verify:** Run `node --version` in new PowerShell
2. **Install dependencies:** `npm install` in server folder
3. **Start backend:** `npm start`
4. **Continue with setup:** Follow README_SETUP.md

---

**Need help?** Check the troubleshooting section above, or see BACKEND_SETUP.md for more details.

**Let me know once Node.js is installed and I'll help you with the next steps! 🚀**
