#!/bin/bash

apt-get update

# install nginx
apt-get install -y nginx &

# Navigate to the backend directory and install dependencies
cd /app/backend && pip install -r requirements.txt &

# Navigate to the frontend directory and install dependencies
cd /app/frontend && npm install &

# Wait for all processes to finish
wait

# configure nginx
cd /etc/nginx/sites-enabled && echo "include "/app/nginx/*.conf";" > default

# Build the frontend
echo "VITE_API_BASE=$VITE_API_BASE" > /app/frontend/.env.production
cd /app/frontend && npm run build &

# download the model
cd /app/backend && python3 download_model.py &

# generate medicine rs
cd /app/backend && python3 gen_medicine_data.py &

# clean apt
apt-get clean &

# Wait for all processes to finish
wait

rm -rf /var/lib/apt/lists/*
