#!/bin/bash

# Complete ICAN Academy Assessment Launcher
# Starts both API server and file server for full network access

echo "🚀 Starting ICAN Academy Assessment - Complete Setup"
echo "═══════════════════════════════════════════════════════════════════════"

# Change to script directory
cd "$(dirname "$0")"

# Load port from .env file
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

echo "📍 Configuration:"
echo "   API Port: $API_PORT"
echo "   File Server Port: $FILE_PORT"
echo "   Local IP: $LOCAL_IP"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "💡 Download from: https://nodejs.org/"
    exit 1
fi

# Check if Python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Cannot start file server."
    echo "💡 Install Python3 or use './launch.sh' for API server only"
    exit 1
fi

# Stop any existing servers
echo "🛑 Stopping any existing servers..."
lsof -ti:$API_PORT 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:$FILE_PORT 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

# Start API server in background
echo "🚀 Starting API server on port $API_PORT..."
node server.js > server.log 2>&1 &
API_SERVER_PID=$!
sleep 2

# Check if API server started
if ! ps -p $API_SERVER_PID > /dev/null; then
    echo "❌ Failed to start API server"
    echo "Check server.log for details"
    exit 1
fi

echo "✅ API server started (PID: $API_SERVER_PID)"

# Start file server in background
echo "🌐 Starting file server on port $FILE_PORT..."
python3 -m http.server $FILE_PORT > fileserver.log 2>&1 &
FILE_SERVER_PID=$!
sleep 2

# Check if file server started
if ! ps -p $FILE_SERVER_PID > /dev/null; then
    echo "❌ Failed to start file server"
    echo "Stopping API server..."
    kill $API_SERVER_PID 2>/dev/null
    exit 1
fi

echo "✅ File server started (PID: $FILE_SERVER_PID)"
echo ""

# Open browser
HTML_FILE="ICAN_Academy_Reading_Assessment_App.html"
if command -v open &> /dev/null; then
    echo "🌐 Opening browser..."
    open "http://localhost:$FILE_PORT/$HTML_FILE"
fi

# Display access information
echo "═══════════════════════════════════════════════════════════════════════"
echo "✅ ICAN Academy Assessment is FULLY RUNNING!"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "🏠 ACCESS FROM THIS COMPUTER:"
echo "   http://localhost:$FILE_PORT/$HTML_FILE"
echo ""
echo "🌐 ACCESS FROM OTHER COMPUTERS/DEVICES:"
echo "   http://$LOCAL_IP:$FILE_PORT/$HTML_FILE"
echo ""
echo "📱 MOBILE/TABLET ACCESS (same WiFi):"
echo "   http://$LOCAL_IP:$FILE_PORT/$HTML_FILE"
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo "📊 Server Details:"
echo "   • API Server: http://$LOCAL_IP:$API_PORT"
echo "   • File Server: http://$LOCAL_IP:$FILE_PORT"
echo "   • API Server PID: $API_SERVER_PID"
echo "   • File Server PID: $FILE_SERVER_PID"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "💡 INSTRUCTIONS FOR OTHER USERS:"
echo "   1. Connect to the same WiFi network"
echo "   2. Open a web browser"
echo "   3. Go to: http://$LOCAL_IP:$FILE_PORT/$HTML_FILE"
echo "   4. Bookmark it for easy access"
echo ""
echo "🛑 TO STOP: Press Ctrl+C or run ./stop-all.sh"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

# Save PIDs to file for stop script
echo "$API_SERVER_PID" > .server.pid
echo "$FILE_SERVER_PID" >> .server.pid

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $API_SERVER_PID 2>/dev/null
    kill $FILE_SERVER_PID 2>/dev/null
    rm -f .server.pid
    echo "✅ All servers stopped. Goodbye!"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Keep script running
echo "⏳ Servers running... Press Ctrl+C to stop"
wait
