#!/bin/bash

# Restart ICAN Academy Assessment Server
echo "🔄 Restarting ICAN Academy Assessment Server..."

# First stop any existing servers
./stop-server.sh

echo ""
echo "⏳ Waiting 2 seconds..."
sleep 2

echo ""
echo "🚀 Starting fresh server..."
cd "$(dirname "$0")"
node server.js