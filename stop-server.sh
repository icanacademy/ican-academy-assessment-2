#!/bin/bash

# Stop ICAN Academy Assessment Server

# Load port from .env file if it exists
PORT=919
if [ -f ".env" ]; then
    ENV_PORT=$(grep "^PORT=" .env | cut -d '=' -f2)
    if [ ! -z "$ENV_PORT" ]; then
        PORT=$ENV_PORT
    fi
fi

echo "🔍 Looking for running servers on port $PORT..."

EXISTING_PID=$(lsof -ti:$PORT 2>/dev/null)
if [ ! -z "$EXISTING_PID" ]; then
    echo "🛑 Found server on port $PORT (PID: $EXISTING_PID)"
    echo "🔧 Stopping server..."
    kill $EXISTING_PID 2>/dev/null
    sleep 1

    # Check if it's still running
    if ps -p $EXISTING_PID > /dev/null 2>&1; then
        echo "⚠️  Server still running, force killing..."
        kill -9 $EXISTING_PID 2>/dev/null
    fi

    echo "✅ Server stopped successfully"
else
    echo "ℹ️  No server found running on port $PORT"
fi

echo "🎉 Done!"