#!/bin/bash

setup_base(){
    apt-get update
    apt-get install -y nginx supervisor coreutils
    
    echo "include "/app/nginx/*.conf";" > /etc/nginx/sites-enabled/default

    rm -rf /var/lib/apt/lists/*
    mv /app/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
    
    apt-get clean

    echo "Base setup done"
}

setup_flask(){
    cd /app/backend && pip install -r requirements.txt
    cd /app/backend && python3 download_model.py &
    cd /app/backend && python3 gen_medicine_data.py &

    echo "Required python packages installed"
}

setup_next(){
    cd /app/medichat && npm install
    
    echo "NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE" > /app/medichat/.env.production
    echo "$CA_CERT" | base64 -d > /app/medichat/src/database/ca-certificate.crt
    echo "DB_URL=$DB_URL" >> /app/medichat/.env.production
    
    cd /app/medichat && npm run build

    echo "NEXT setup done"
}


setup_base &
setup_flask &
setup_next &

wait