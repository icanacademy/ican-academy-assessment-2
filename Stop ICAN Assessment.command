#!/bin/bash

# ICAN Academy Assessment - Stop Servers
# Double-click this file to stop all running servers

cd "$(dirname "$0")"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     ICAN Academy Assessment - Stopping Servers...             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Load port configuration
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

echo "🔍 Looking for servers on ports $API_PORT and $FILE_PORT..."
echo ""

STOPPED=0

# Stop servers by PID if available
if [ -f ".server.pid" ]; then
    echo "📋 Found server PID file, stopping servers..."
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo "   🛑 Stopping server (PID: $pid)..."
            kill $pid 2>/dev/null
            STOPPED=1
        fi
    done < .server.pid
    rm -f .server.pid
    echo ""
fi

# Stop API server by port (fallback)
API_PID=$(lsof -ti:$API_PORT 2>/dev/null)
if [ ! -z "$API_PID" ]; then
    echo "🛑 Stopping API server on port $API_PORT (PID: $API_PID)..."
    kill $API_PID 2>/dev/null
    sleep 1
    if ps -p $API_PID > /dev/null 2>&1; then
        echo "   ⚠️  Force killing..."
        kill -9 $API_PID 2>/dev/null
    fi
    STOPPED=1
fi

# Stop file server by port (fallback)
FILE_PID=$(lsof -ti:$FILE_PORT 2>/dev/null)
if [ ! -z "$FILE_PID" ]; then
    echo "🛑 Stopping file server on port $FILE_PORT (PID: $FILE_PID)..."
    kill $FILE_PID 2>/dev/null
    sleep 1
    if ps -p $FILE_PID > /dev/null 2>&1; then
        echo "   ⚠️  Force killing..."
        kill -9 $FILE_PID 2>/dev/null
    fi
    STOPPED=1
fi

# Clean up log files
rm -f server.log fileserver.log

echo ""
if [ $STOPPED -eq 1 ]; then
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║          ✅ All servers stopped successfully!                 ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
else
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║          ℹ️  No servers were running                          ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
fi

echo ""
echo "🎉 Done!"
echo ""
read -p "Press Enter to close this window..."
