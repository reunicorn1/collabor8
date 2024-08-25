#!/bin/bash

# Remote server details
REMOTE_USER="ubuntu"
REMOTE_HOST="44.192.85.174"
REMOTE_PATH="/path/to/your/app"
DOMAIN="your_domain_or_ip"  # Replace with your actual domain or IP

# SSH into the remote server and execute the deployment steps
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'EOF'

# Update the system and install dependencies
echo "Updating the system and installing dependencies..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y git build-essential curl nginx

# Install Node.js (if not already installed)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone or update the application repository
echo "Pulling the latest code..."
if [ -d "${REMOTE_PATH}" ]; then
    cd ${REMOTE_PATH}
    git pull origin main
else
    git clone https://github.com/your-username/your-repo.git ${REMOTE_PATH}
    cd ${REMOTE_PATH}
fi

# Install application dependencies
echo "Installing application dependencies..."
npm install

# Set up environment variables
echo "Setting up environment variables..."
cat <<EOT > .env
# Add your environment variables here
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url
# ...
EOT

# Build the application
echo "Building the application..."
npm run build

# Set up the application as a service
SERVICE_NAME="nest-app"
echo "Setting up the application as a service..."
sudo bash -c "cat > /etc/systemd/system/${SERVICE_NAME}.service << EOL
[Unit]
Description=NestJS Application
After=network.target

[Service]
User=${REMOTE_USER}
WorkingDirectory=${REMOTE_PATH}
ExecStart=/usr/bin/npm run start:prod
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL"

# Reload systemd to recognize the new service and start it
sudo systemctl daemon-reload
sudo systemctl enable ${SERVICE_NAME}
sudo systemctl start ${SERVICE_NAME}

# Configure Nginx as a reverse proxy
echo "Configuring Nginx as a reverse proxy..."
sudo rm /etc/nginx/sites-enabled/default
sudo bash -c "cat > /etc/nginx/sites-available/${SERVICE_NAME} << EOL
server {
    listen 80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Optional: serve static files from /public directory
    location /public/ {
        alias ${REMOTE_PATH}/public/;
    }
}
EOL"

# Enable the Nginx site configuration and restart Nginx
sudo ln -s /etc/nginx/sites-available/${SERVICE_NAME} /etc/nginx/sites-enabled/
sudo systemctl restart nginx

echo "Deployment completed successfully!"

EOF
