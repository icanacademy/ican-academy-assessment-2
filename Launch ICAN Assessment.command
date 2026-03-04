#!/bin/bash

# ICAN Academy Assessment Launcher (.command file for easy double-click on macOS)
# This script starts the server and opens the assessment app

echo "🚀 Starting ICAN Academy Assessment..."

# Change to the directory where this script is located
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "💡 Please install Node.js from: https://nodejs.org/"
    echo "Press Enter to exit..."
    read
    exit 1
fi

# Check if required files exist
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found in current directory"
    echo "📍 Current directory: $(pwd)"
    echo "Press Enter to exit..."
    read
    exit 1
fi

if [ ! -f "ICAN_Academy_Reading_Assessment_App.html" ]; then
    echo "❌ ICAN_Academy_Reading_Assessment_App.html not found"
    echo "Press Enter to exit..."
    read
    exit 1
fi

# Check if port 3000 is already in use and kill existing processes
echo "🔍 Checking for existing servers on port 3000..."
EXISTING_PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$EXISTING_PID" ]; then
    echo "🛑 Found existing server on port 3000 (PID: $EXISTING_PID)"
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
    echo "✅ Server started successfully!"
    
    # Get the absolute path to the HTML file
    HTML_PATH="$(pwd)/ICAN_Academy_Reading_Assessment_App.html"
    
    # Open the assessment app in default browser
    echo "🌐 Opening assessment app in browser..."
    open "file://$HTML_PATH" 2>/dev/null || {
        echo "📋 Please open this file manually in your browser:"
        echo "   file://$HTML_PATH"
    }
    
    echo ""
    echo "🎉 ICAN Academy Assessment is now running!"
    echo "📊 Server: http://localhost:3000"
    echo "🌐 App: file://$HTML_PATH"
    echo ""
    echo "💡 Press Enter to stop the server and exit"
    echo ""
    
    # Wait for user input to stop
    read -p "Press Enter to stop..."
    
    # Stop the server
    echo "🛑 Stopping server..."
    kill $SERVER_PID 2>/dev/null
    echo "✅ Server stopped. Goodbye!"
    
else
    echo "❌ Failed to start server"
    echo "Press Enter to exit..."
    read
    exit 1
fi