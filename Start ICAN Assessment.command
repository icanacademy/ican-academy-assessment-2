#!/bin/bash

# ICAN Academy Assessment - Double-Click Launcher
# This file can be double-clicked in macOS to start the assessment app

# Change to the directory where this script is located
cd "$(dirname "$0")"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     ICAN Academy Assessment - Starting...                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo "1. Visit: https://nodejs.org/"
    echo "2. Download and install Node.js"
    echo "3. Try running this again"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if Python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ ERROR: Python3 is not installed!"
    echo ""
    echo "Python3 is required for the file server."
    echo "It usually comes pre-installed on macOS."
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Load configuration
API_PORT=919
FILE_PORT=1230

if [ -f ".env" ]; then
    ENV_PORT=$(grep "^PORT=" .env | cut -d '=' -f2)
    if [ ! -z "$ENV_PORT" ]; then
        API_PORT=$ENV_PORT
    fi

    ENV_FILE_PORT=$(grep "^FILE_SERVER_PORT=" .env | cut -d '=' -f2)
    if [ ! -z "$ENV_FILE_PORT" ]; then
        FILE_PORT=$ENV_FILE_PORT
    fi
fi

# Get local IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo "📋 Configuration:"
echo "   • API Port: $API_PORT"
echo "   • File Server Port: $FILE_PORT"
echo "   • Your IP: $LOCAL_IP"
echo ""

# Start Cloudflare tunnel if not already running
if ! pgrep -f "cloudflared tunnel run cosmodrive" > /dev/null 2>&1; then
    echo "🌐 Starting Cloudflare Tunnel..."
    cloudflared tunnel run cosmodrive &
    sleep 2
    echo "✅ Cloudflare Tunnel started"
else
    echo "🌐 Cloudflare Tunnel already running"
fi
echo "🌍 Public URL: https://assessment.icanacademy.work"
echo ""

# Stop any existing servers
echo "🧹 Cleaning up any existing servers..."
lsof -ti:$API_PORT 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:$FILE_PORT 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

# Start API server
echo "🚀 Starting API server on port $API_PORT..."
node server.js > server.log 2>&1 &
API_PID=$!
sleep 2

# Check if API server started
if ! ps -p $API_PID > /dev/null 2>&1; then
    echo "❌ ERROR: Failed to start API server!"
    echo "Check server.log for details"
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ API server started (PID: $API_PID)"

# Start file server
echo "🌐 Starting file server on port $FILE_PORT..."
python3 -m http.server $FILE_PORT > fileserver.log 2>&1 &
FILE_PID=$!
sleep 2

# Check if file server started
if ! ps -p $FILE_PID > /dev/null 2>&1; then
    echo "❌ ERROR: Failed to start file server!"
    echo "Stopping API server..."
    kill $API_PID 2>/dev/null
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ File server started (PID: $FILE_PID)"

# Save PIDs
echo "$API_PID" > .server.pid
echo "$FILE_PID" >> .server.pid

# Open browser
HTML_FILE="ICAN_Academy_Reading_Assessment_App.html"
echo ""
echo "🌐 Opening browser..."
open "http://localhost:$FILE_PORT/$HTML_FILE"

# Display access information
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          ✅ ICAN Academy Assessment is RUNNING!               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🏠 ACCESS FROM THIS COMPUTER:"
echo "   http://localhost:$FILE_PORT/$HTML_FILE"
echo ""
echo "🌐 ACCESS FROM OTHER COMPUTERS/DEVICES (same WiFi):"
echo "   http://$LOCAL_IP:$FILE_PORT/$HTML_FILE"
echo ""
echo "📱 SHARE THIS URL WITH OTHERS:"
echo "   http://$LOCAL_IP:$FILE_PORT/$HTML_FILE"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📊 Server Information:"
echo "   • API Server (PID $API_PID): http://$LOCAL_IP:$API_PORT"
echo "   • File Server (PID $FILE_PID): http://$LOCAL_IP:$FILE_PORT"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🛑 TO STOP THE SERVERS:"
echo "   1. Press Ctrl+C in this window, OR"
echo "   2. Double-click 'Stop ICAN Assessment.command', OR"
echo "   3. Close this Terminal window (servers will stop automatically)"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "⏳ Servers are running... Press Ctrl+C to stop"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $API_PID 2>/dev/null
    kill $FILE_PID 2>/dev/null
    rm -f .server.pid
    echo "✅ Servers stopped successfully!"
    echo "👋 Goodbye!"
    exit 0
}

# Trap Ctrl+C and window close
trap cleanup INT TERM EXIT

# Keep terminal open and wait
wait
