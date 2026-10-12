#!/usr/bin/env bash
set -e

echo "Uninstalling TANVEER PRIME..."
systemctl stop tanveer-prime 2>/dev/null || true
systemctl disable tanveer-prime 2>/dev/null || true
echo "TANVEER PRIME service stopped and disabled."
