#!/bin/bash

echo "NEXT_PUBLIC_API_BASE:$NEXT_PUBLIC_API_BASE" > /app/medichat/.env.production

service nginx start

cd /app/backend
python3 app.py &

cd /app/medichat
npm start