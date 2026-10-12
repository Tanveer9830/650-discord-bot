#!/usr/bin/env bash
set -e

echo "=========================================="
echo " TANVEER PRIME — ONE COMMAND INSTALLER"
echo "=========================================="

if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo."
  exit 1
fi

echo "[1/5] Checking environment..."
node -v || { echo "Node.js is required."; exit 1; }

echo "[2/5] Creating service user and directory..."
mkdir -p /opt/tanveer-prime
cd /opt/tanveer-prime

echo "[3/5] Installing dependencies..."
npm install --production

echo "[4/5] Initializing database..."
node -e "require('./src/database'); console.log('Database initialized successfully.');"

echo "[5/5] Setup Complete!"
echo "Start the bot using: npm start"
