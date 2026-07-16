#!/bin/bash
set -e

# Revert schema.prisma to sqlite
sed -i 's/provider = "postgresql"/provider = "sqlite"/g' ~/finalproto/backend/prisma/schema.prisma

# Generate Prisma Client and setup PM2
cd ~/finalproto/backend
npx prisma generate

cd ~/finalproto/ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install flask-cors

# Start PM2
cd ~/finalproto
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup | tail -n 1 > pm2_startup.sh
sudo bash pm2_startup.sh
pm2 save
