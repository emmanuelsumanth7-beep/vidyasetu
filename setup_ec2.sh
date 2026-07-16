#!/bin/bash
set -e

# Update and install dependencies
sudo apt-get update
sudo apt-get install -y curl wget git python3-pip python3-venv

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Setup Backend
cd ~/finalproto/backend
npm install
# Since we reverted to SQLite for this fast EC2 deploy (or if we still have the Postgres prisma file, we need to revert it back to SQLite so it works out of the box with the local dev.db)
# Wait, I changed schema.prisma to postgresql earlier! I must revert it to sqlite first!
