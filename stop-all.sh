#!/bin/bash

# Stop all ICAN Academy Assessment servers

echo "🛑 Stopping ICAN Academy Assessment servers..."

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

# Stop servers by PID if available
if [ -f ".server.pid" ]; then
    echo "📋 Found server PID file, stopping servers..."
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo "   Stopping PID: $pid"
            kill $pid 2>/dev/null
        fi
    done < .server.pid
    rm -f .server.pid
fi

# Stop by port (fallback)
echo "🔍 Checking for servers on ports $API_PORT and $FILE_PORT..."

API_PID=$(lsof -ti:$API_PORT 2>/dev/null)
if [ ! -z "$API_PID" ]; then
    echo "🛑 Stopping API server (PID: $API_PID)"
    kill $API_PID 2>/dev/null
    sleep 1
    if ps -p $API_PID > /dev/null 2>&1; then
        kill -9 $API_PID 2>/dev/null
    fi
fi

FILE_PID=$(lsof -ti:$FILE_PORT 2>/dev/null)
if [ ! -z "$FILE_PID" ]; then
    echo "🛑 Stopping file server (PID: $FILE_PID)"
    kill $FILE_PID 2>/dev/null
    sleep 1
    if ps -p $FILE_PID > /dev/null 2>&1; then
        kill -9 $FILE_PID 2>/dev/null
    fi
fi

# Clean up log files
rm -f server.log fileserver.log

echo "✅ All servers stopped successfully!"
echo "🎉 Done!"
