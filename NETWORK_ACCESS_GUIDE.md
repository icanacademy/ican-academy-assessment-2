# 🌐 ICAN Academy Assessment - Network Access Guide

## 📋 Overview
This guide explains how to run the ICAN Academy Assessment app on your PC and allow other computers/devices on your network to access it.

---

## 🖥️ Server Computer Setup (Host PC)

### Your Computer Information
- **Local IP Address:** `192.168.68.106`
- **Server Port:** `919`
- **Server URL:** `http://192.168.68.106:919`

### Step 1: Start the Server

#### Option A: Using Launch Script (Recommended)
```bash
cd "/Users/icanacademy/ICAN_Academy_Assessment 2"
./launch.sh
```

#### Option B: Manual Start
```bash
cd "/Users/icanacademy/ICAN_Academy_Assessment 2"
node server.js
```

### Step 2: Note the Server Information
When the server starts, you'll see:
```
═══════════════════════════════════════════════════════════════════════
🚀 ICAN Academy Assessment Server Started Successfully!
═══════════════════════════════════════════════════════════════════════
📍 Port: 919
🏠 Local Access: http://localhost:919
🌐 Network Access: http://192.168.68.106:919
═══════════════════════════════════════════════════════════════════════
```

**IMPORTANT:** Copy the Network Access URL for sharing with others.

---

## 📱 Accessing from Other Devices

### From Other Computers on the Same Network

1. **Make sure both computers are on the same WiFi/network**
2. **Open a web browser** on the other computer
3. **Navigate to:** `http://192.168.68.106:919`
4. **Open the HTML file** by accessing:
   - Upload the HTML file to the other computer, OR
   - Host it via a simple file server (see Advanced Setup below)

### Recommended: Simple HTTP File Server Setup

On the host computer, run this in the app directory:

```bash
# Install Python's HTTP server (usually pre-installed on Mac)
cd "/Users/icanacademy/ICAN_Academy_Assessment 2"
python3 -m http.server 1230
```

Then from other computers, access:
- **Web App:** `http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html`
- The app will automatically connect to the API server on port 919

---

## 🔧 Configuration Files

### .env File
Location: `/Users/icanacademy/ICAN_Academy_Assessment 2/.env`

```bash
# Port configuration
PORT=919

# Notion API Configuration
NOTION_API_KEY=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
NOTION_STUDENTS_DB_ID=1abd37d666308071bfe1e37d1d155035
NOTION_ASSESSMENT_DB_ID=2a2d37d6663080c39fb5c34639b33114

# Server Configuration (0.0.0.0 allows network access)
SERVER_HOST=0.0.0.0
```

**To change the port:** Edit the `PORT=` line in `.env` file.

---

## 🔥 Firewall Configuration

### macOS Firewall Settings

If other computers cannot connect, you may need to allow incoming connections:

1. **Open System Preferences** → **Security & Privacy** → **Firewall**
2. Click **Firewall Options**
3. Make sure Node.js is allowed to accept incoming connections
4. Alternatively, temporarily disable the firewall for testing

### Allow Port 919 Through Firewall

```bash
# Check if firewall is active
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Allow Node.js
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

---

## 📊 Network Access Testing

### Test Server from Host Computer
```bash
curl http://localhost:919/students
```

### Test Server from Another Computer
```bash
curl http://192.168.68.106:919/students
```

Both should return JSON data with student information.

---

## 🚀 Complete Workflow

### On Host Computer (192.168.68.106)

1. **Start the API server:**
   ```bash
   cd "/Users/icanacademy/ICAN_Academy_Assessment 2"
   ./launch.sh
   ```

2. **Start the file server (optional but recommended):**
   ```bash
   # In a new terminal window
   cd "/Users/icanacademy/ICAN_Academy_Assessment 2"
   python3 -m http.server 1230
   ```

3. **Access locally:** Open browser to `http://localhost:1230/ICAN_Academy_Reading_Assessment_App.html`

### On Client Computers (Other Devices)

1. **Ensure on same network** as host computer
2. **Open browser** to: `http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html`
3. **App will automatically connect** to the API server at port 919

---

## 🎯 Quick Reference

| Purpose | URL/Command |
|---------|-------------|
| **API Server Port** | 919 |
| **File Server Port** | 1230 (optional) |
| **Host IP Address** | 192.168.68.106 |
| **Local API Access** | http://localhost:919 |
| **Network API Access** | http://192.168.68.106:919 |
| **Local App Access** | http://localhost:1230/ICAN_Academy_Reading_Assessment_App.html |
| **Network App Access** | http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html |
| **Start Server** | `./launch.sh` |
| **Stop Server** | `./stop-server.sh` or Ctrl+C |

---

## 🛠️ Troubleshooting

### Problem: Cannot connect from other computers

**Solutions:**
1. ✅ Verify both computers are on the same network/WiFi
2. ✅ Check firewall settings (see Firewall Configuration above)
3. ✅ Confirm server is running: `lsof -ti:919`
4. ✅ Test with curl from client computer: `curl http://192.168.68.106:919/students`
5. ✅ Make sure IP hasn't changed: `ifconfig | grep "inet "`

### Problem: Port 919 already in use

**Solution:**
```bash
# Find and kill process using port 919
lsof -ti:919 | xargs kill -9

# Or use the stop script
./stop-server.sh
```

### Problem: IP address has changed

**Solution:**
```bash
# Get current IP address
ifconfig | grep "inet " | grep -v 127.0.0.1

# Update the network access URL accordingly
```

### Problem: Browser shows "Cannot connect"

**Check:**
1. Server is running: Look for console output
2. Correct URL: http://192.168.68.106:919 (not https)
3. Port is accessible: Test with `curl`
4. No VPN interfering with local network
5. Browser console for specific errors (F12)

---

## 📱 Mobile Device Access

### Same steps apply for tablets and phones:

1. **Connect to same WiFi** network as host computer
2. **Open mobile browser** (Safari, Chrome, etc.)
3. **Navigate to:** `http://192.168.68.106:1230/ICAN_Academy_Reading_Assessment_App.html`
4. **Bookmark for easy access**

**Note:** The app is responsive but optimized for desktop/tablet screens.

---

## 🔒 Security Considerations

### Important Security Notes:

⚠️ **Local Network Only** - This setup only works on your local network (WiFi/LAN)

⚠️ **No Authentication** - Anyone on your network can access the app

⚠️ **API Keys Exposed** - API keys are in the .env file (keep it secure)

⚠️ **Don't expose to Internet** - This is for local network use only

### For Production Use:
- Add user authentication
- Use HTTPS (SSL certificates)
- Move API keys to secure server
- Implement rate limiting
- Add input validation
- Use a proper web server (nginx, Apache)

---

## 💾 Backup & Recovery

### Save Your Configuration
```bash
# Backup .env file
cp .env .env.backup

# Backup entire folder
cd /Users/icanacademy
zip -r "ICAN_Assessment_Backup_$(date +%Y%m%d).zip" "ICAN_Academy_Assessment 2"
```

---

## 📞 Support Checklist

If you need help, gather this information:

- [ ] Server running? (check terminal output)
- [ ] Port number being used
- [ ] Host computer IP address (`ifconfig`)
- [ ] Client computer IP address
- [ ] Both on same network?
- [ ] Firewall status
- [ ] Browser console errors (F12)
- [ ] Server console errors

---

## 🎓 Additional Resources

- **Node.js Documentation:** https://nodejs.org/docs
- **Notion API:** https://developers.notion.com
- **Network Troubleshooting:** Check router settings, DHCP, subnet masks

---

**Last Updated:** November 2024
**Your IP:** 192.168.68.106
**Port:** 919
