#!/bin/bash

apt-get update

# install nginx
apt-get install -y nginx coreutils &

# Navigate to the backend directory and install dependencies
cd /app/backend && pip install -r requirements.txt &

# Navigate to the medichat directory and install dependencies
cd /app/medichat && npm install &

# Wait for all processes to finish
wait

# configure nginx
cd /etc/nginx/sites-enabled && echo "include "/app/nginx/*.conf";" > default

# Build the nextjs app
echo "NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE" > /app/medichat/.env.production
echo "$CA_CERT" | base64 -d > /app/medichat/src/database/ca-certificate.crt
echo "DB_URL=$DB_URL" >> /app/medichat/.env.production
cd /app/medichat && npm run build &

# download the model
cd /app/backend && python3 download_model.py &

# generate medicine rs
cd /app/backend && python3 gen_medicine_data.py &

# clean apt
apt-get clean &

# Wait for all processes to finish
wait

rm -rf /var/lib/apt/lists/*
