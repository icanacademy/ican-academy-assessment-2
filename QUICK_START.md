# 🚀 ICAN Academy Assessment - Quick Start Guide

## ⚡ Fastest Way to Get Started

### Option 1: Complete Setup (Recommended for Network Access)

**One command to start everything:**
```bash
cd "/Users/icanacademy/ICAN_Academy_Assessment 2"
./start-complete.sh
```

This will:
- ✅ Start the API server on port 919
- ✅ Start the file server on port 1230
- ✅ Open your browser automatically
- ✅ Show the URL for other computers to access

**Access URLs:**
- **This Computer:** http://localhost:1230/ICAN_Academy_Reading_Assessment_App.html
- **Other Computers:** http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html

**To Stop:**
```bash
./stop-all.sh
```
or press `Ctrl+C`

---

### Option 2: API Server Only (Local Use)

**Start the API server:**
```bash
cd "/Users/icanacademy/ICAN_Academy_Assessment 2"
./launch.sh
```

Then **open the HTML file** directly in your browser:
- File location: `/Users/icanacademy/ICAN_Academy_Assessment 2/ICAN_Academy_Reading_Assessment_App.html`

**To Stop:**
```bash
./stop-server.sh
```
or press `Ctrl+C`

---

## 📱 Share with Other Users

### Your Network URLs:

**For Other Computers/Tablets/Phones on the Same WiFi:**

1. Make sure they're connected to the same WiFi network
2. Share this URL: **http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html**
3. They open it in their browser
4. Done! ✅

---

## 🔧 Configuration

### Server Settings
- **API Port:** 919
- **File Server Port:** 1230 (when using start-complete.sh)
- **Your Local IP:** 192.168.68.106

### To Change Port
Edit the `.env` file:
```bash
PORT=919  # Change this number
```

---

## 🛠️ Troubleshooting

### Can't connect from other computers?

**Check:**
1. Both computers on same WiFi? ✓
2. Server running? Run: `lsof -ti:919`
3. Firewall blocking? Try: `sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate`

**Quick Test:**
```bash
curl http://192.168.68.106:919/students
```
Should show JSON with student list.

### Port already in use?

**Solution:**
```bash
./stop-all.sh
```

### IP Address Changed?

**Get New IP:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Update URLs with the new IP address.

---

## 📊 What Each Script Does

| Script | Purpose |
|--------|---------|
| `./start-complete.sh` | Start API + file server (full network access) |
| `./launch.sh` | Start API server only |
| `./stop-all.sh` | Stop all servers |
| `./stop-server.sh` | Stop API server only |
| `./restart-server.sh` | Restart API server |

---

## 💡 Tips

**Want to bookmark it?**
- Share this URL with teachers: http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html

**Running on startup?**
- Add to macOS Login Items or create a LaunchAgent

**Check if server is running:**
```bash
lsof -ti:919
```
If it returns a number, server is running!

---

## 📚 Full Documentation

For detailed information, see:
- `NETWORK_ACCESS_GUIDE.md` - Complete network setup guide
- `NOTION_SETUP_INSTRUCTIONS.md` - Notion database setup
- `README.md` - App overview and features

---

**Need Help?** Check the console output (F12 in browser) for detailed error messages.

**Last Updated:** November 2024
