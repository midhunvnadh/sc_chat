#!/bin/bash

service nginx start

cd /app/backend
python3 app.py &

cd /app/medichat
npm start