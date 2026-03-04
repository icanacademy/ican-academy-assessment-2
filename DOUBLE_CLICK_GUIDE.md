# 🖱️ Double-Click Quick Start Guide

## 🚀 Easiest Way to Start the App

### **Just Double-Click!**

1. **Find this file in Finder:**
   ```
   Start ICAN Assessment.command
   ```

2. **Double-click it**

3. **That's it!** ✅
   - Terminal window will open
   - Servers will start automatically
   - Browser will open to the app
   - You'll see all the access URLs

---

## 🛑 To Stop the App

### **Option 1: Double-Click to Stop**
1. **Find this file:**
   ```
   Stop ICAN Assessment.command
   ```

2. **Double-click it**

3. **Done!** All servers stopped ✅

### **Option 2: Press Ctrl+C**
- In the Terminal window that opened
- Press `Ctrl+C`
- Servers will stop automatically

### **Option 3: Close Terminal**
- Just close the Terminal window
- Servers will stop automatically

---

## 📂 Available Command Files

| File | What it Does |
|------|--------------|
| **Start ICAN Assessment.command** | ✅ Starts everything (NEW - RECOMMENDED) |
| **Stop ICAN Assessment.command** | 🛑 Stops all servers |
| Launch ICAN Assessment.command | Older version (still works) |
| start-server.command | Just API server (older) |

**Recommended:** Use the **new** "Start ICAN Assessment.command" file!

---

## 🎯 What Happens When You Double-Click?

### Start ICAN Assessment.command:

1. ✅ Checks Node.js and Python3 are installed
2. ✅ Stops any existing servers
3. ✅ Starts API server (port 919)
4. ✅ Starts file server (port 1230)
5. ✅ Opens your browser automatically
6. ✅ Shows you the network URL to share

### Terminal Output:
```
╔════════════════════════════════════════════════════════════════╗
║          ✅ ICAN Academy Assessment is RUNNING!               ║
╚════════════════════════════════════════════════════════════════╝

🏠 ACCESS FROM THIS COMPUTER:
   http://localhost:1230/ICAN_Academy_Reading_Assessment_App.html

🌐 ACCESS FROM OTHER COMPUTERS/DEVICES (same WiFi):
   http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html

📱 SHARE THIS URL WITH OTHERS:
   http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html
```

---

## 🔧 First Time Setup

### If macOS asks "Do you want to open this?"

1. Click **"Open"**
2. You might need to go to **System Preferences → Security & Privacy**
3. Click **"Open Anyway"**
4. This is normal for `.command` files!

### After First Time:
- Just double-click normally
- No more warnings!

---

## 📱 Sharing with Others

**After double-clicking to start:**

1. Look at the Terminal output
2. Find the line that says:
   ```
   🌐 ACCESS FROM OTHER COMPUTERS/DEVICES (same WiFi):
   http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html
   ```

3. **Share that URL** with teachers/staff
4. They open it in their browser
5. Done! ✅

**Requirements:**
- They must be on the **same WiFi network**
- Your computer must be **turned on** and **running the app**

---

## 🎓 Quick Tips

### Keep Terminal Open
- **Don't close** the Terminal window while using the app
- Closing it will stop the servers
- You can minimize it instead

### Bookmark the URL
- On other computers, bookmark:
  ```
  http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html
  ```
- Quick access anytime!

### Check if Running
- If Terminal window is open with server info = Running ✅
- If no Terminal window = Not running ❌

### Restart if Needed
1. Double-click "Stop ICAN Assessment.command"
2. Wait for it to finish
3. Double-click "Start ICAN Assessment.command"
4. Fresh start! ✅

---

## 🐛 Troubleshooting

### Double-Click Does Nothing?

**Fix:**
```bash
# Open Terminal (Applications → Utilities → Terminal)
# Run this command:
chmod +x "/Users/icanacademy/ICAN_Academy_Assessment 2/Start ICAN Assessment.command"
```

### Error: "Node.js not installed"

**Fix:**
1. Go to https://nodejs.org/
2. Download and install Node.js
3. Try double-clicking again

### Error: "Python3 not installed"

**Fix:**
- Python3 usually comes with macOS
- Try updating macOS
- Or install from https://www.python.org/

### Can't Stop Servers?

**Fix:**
```bash
# Open Terminal and run:
cd "/Users/icanacademy/ICAN_Academy_Assessment 2"
./stop-all.sh
```

---

## 📊 What's Running?

When you double-click "Start ICAN Assessment.command":

| Server | Port | Purpose |
|--------|------|---------|
| API Server | 919 | Notion database connection |
| File Server | 1230 | Serves the HTML app |

**Both are needed** for full functionality!

---

## ✨ Comparison: Command Files vs Scripts

| Method | Ease | Features |
|--------|------|----------|
| **Start ICAN Assessment.command** | 🌟🌟🌟 Double-click | Full setup + browser opens |
| ./start-complete.sh | 🌟🌟 Terminal only | Same features, manual |
| ./launch.sh | 🌟 Terminal only | API server only |

**Easiest:** Just double-click the `.command` file!

---

## 🎉 You're All Set!

### To Use the App:

1. **Double-click:** "Start ICAN Assessment.command"
2. **Wait** for browser to open (3-5 seconds)
3. **Start** using the app!
4. **Share** the URL with others on your WiFi

### When Done:

1. **Double-click:** "Stop ICAN Assessment.command"
2. **Or** press Ctrl+C in Terminal
3. **Or** just close the Terminal window

---

**That's it! Enjoy your assessment app! 🎊**

---

**Created:** November 13, 2024
**Port (API):** 919
**Port (File Server):** 1230
**Your IP:** 192.168.68.106
