#!/usr/bin/env bash
set -e

echo "Updating TANVEER PRIME..."
git pull origin main
npm install --production
node -e "require('./src/database'); console.log('Database migrated successfully.');"
echo "Update Complete!"
