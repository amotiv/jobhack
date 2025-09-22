#!/bin/bash

# JobHack Startup Script
set -e

echo "🚀 Starting JobHack..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy env.example to .env and configure it."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check required environment variables
required_vars=("SECRET_KEY" "DB_NAME" "DB_USER" "DB_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set."
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo "🔄 Running database migrations..."
docker-compose exec -T worker python manage.py migrate

# Create superuser if it doesn't exist
echo "👤 Creating superuser (if needed)..."
docker-compose exec -T worker python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"

# Seed job data
echo "📊 Seeding job data..."
docker-compose exec -T worker python manage.py seed_jobs

echo "✅ JobHack is ready!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo "   Admin Panel: http://localhost:8000/admin (admin/admin123)"
echo ""
echo "📝 To stop the application: docker-compose down"
echo "📋 To view logs: docker-compose logs -f"



