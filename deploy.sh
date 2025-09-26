#!/bin/bash
# One-click deployment script for JobHack

echo "🚀 Deploying JobHack..."

# Update system
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create environment file
cat > .env << EOF
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")
DEBUG=0
ALLOWED_HOSTS=*
FRONTEND_BASE_URL=http://$(curl -s ifconfig.me)
CSRF_TRUSTED_ORIGINS=http://$(curl -s ifconfig.me)
EOF

# Start the application
docker-compose up -d

echo "✅ JobHack deployed successfully!"
echo "🌐 Access your app at: http://$(curl -s ifconfig.me)"
