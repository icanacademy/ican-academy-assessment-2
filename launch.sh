#!/bin/bash

# ICAN Academy Assessment Launcher
# This script starts the server and opens the assessment app

echo "🚀 Starting ICAN Academy Assessment..."
echo "📍 Working directory: $(pwd)"

# Change to the correct directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "💡 Download from: https://nodejs.org/"
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found in current directory"
    echo "📍 Current directory: $(pwd)"
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if the HTML file exists
if [ ! -f "ICAN_Academy_Reading_Assessment_App.html" ]; then
    echo "❌ ICAN_Academy_Reading_Assessment_App.html not found"
    read -p "Press Enter to exit..."
    exit 1
fi

# Load port from .env file if it exists
PORT=919
if [ -f ".env" ]; then
    # Extract PORT from .env file
    ENV_PORT=$(grep "^PORT=" .env | cut -d '=' -f2)
    if [ ! -z "$ENV_PORT" ]; then
        PORT=$ENV_PORT
    fi
fi

echo "📍 Using port: $PORT"

# Check if port is already in use and kill existing processes
echo "🔍 Checking for existing servers on port $PORT..."
EXISTING_PID=$(lsof -ti:$PORT 2>/dev/null)
if [ ! -z "$EXISTING_PID" ]; then
    echo "🛑 Found existing server on port $PORT (PID: $EXISTING_PID)"
    echo "🔧 Stopping existing server..."
    kill $EXISTING_PID 2>/dev/null
    sleep 2
    echo "✅ Existing server stopped"
fi

# Start the server in the background
echo "🚀 Starting new Node.js server..."
node server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server started successfully
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server started successfully (PID: $SERVER_PID)"
    
    # Get the absolute path to the HTML file
    HTML_PATH="$(pwd)/ICAN_Academy_Reading_Assessment_App.html"
    
    # Open the assessment app in default browser
    echo "🌐 Opening assessment app in browser..."
    if command -v open &> /dev/null; then
        # macOS
        open "file://$HTML_PATH"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "file://$HTML_PATH"
    elif command -v start &> /dev/null; then
        # Windows (Git Bash)
        start "file://$HTML_PATH"
    else
        echo "📋 Please open this file manually in your browser:"
        echo "   file://$HTML_PATH"
    fi
    
    # Get local IP address
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

    echo ""
    echo "═══════════════════════════════════════════════════════════════════════"
    echo "🎉 ICAN Academy Assessment is now running!"
    echo "═══════════════════════════════════════════════════════════════════════"
    echo "📊 Server running on port: $PORT"
    echo ""
    echo "🏠 Access from THIS computer:"
    echo "   http://localhost:$PORT"
    echo ""
    echo "🌐 Access from OTHER computers on network:"
    echo "   http://$LOCAL_IP:$PORT"
    echo ""
    echo "📱 Share this URL with others to access from their devices:"
    echo "   http://$LOCAL_IP:$PORT"
    echo ""
    echo "📄 HTML file location:"
    echo "   file://$HTML_PATH"
    echo ""
    echo "═══════════════════════════════════════════════════════════════════════"
    echo "💡 To stop the server, press Ctrl+C"
    echo "═══════════════════════════════════════════════════════════════════════"
    echo ""
    
    # Keep the script running and wait for user to stop
    trap "echo ''; echo '🛑 Stopping server...'; kill $SERVER_PID 2>/dev/null; echo '✅ Server stopped. Goodbye!'; exit 0" INT
    
    # Wait for server process to end or user interrupt
    wait $SERVER_PID
    
else
    echo "❌ Failed to start server"
    exit 1
fi