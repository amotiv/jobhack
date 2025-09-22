# JobHack Deployment Guide

## Quick Start (Development)

1. **Clone and setup environment:**
   ```bash
   git clone <repository-url>
   cd jobhack
   cp env.example .env
   # Edit .env with your configuration
   ```

2. **Start with Docker:**
   ```bash
   ./start.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Admin: http://localhost:8000/admin (admin/admin123)

## Production Deployment

### Prerequisites
- Docker and Docker Compose
- Domain name and SSL certificate
- Environment variables configured

### 1. Environment Configuration
```bash
# Copy and configure environment
cp env.example .env

# Required variables for production:
SECRET_KEY=your-secure-secret-key
DEBUG=0
DB_PASSWORD=secure-database-password
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_BASE_URL=https://yourdomain.com
```

### 2. SSL Configuration
```bash
# Create SSL directory
mkdir ssl

# Copy your SSL certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem
```

### 3. Deploy
```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Post-Deployment
```bash
# Create superuser
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# Seed job data
docker-compose -f docker-compose.prod.yml exec backend python manage.py seed_jobs
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SECRET_KEY` | Yes | Django secret key | `django-insecure-...` |
| `DEBUG` | Yes | Debug mode (0 for production) | `0` |
| `DB_NAME` | Yes | Database name | `jobhack` |
| `DB_USER` | Yes | Database user | `jobhack` |
| `DB_PASSWORD` | Yes | Database password | `secure-password` |
| `DB_HOST` | Yes | Database host | `db` |
| `DB_PORT` | Yes | Database port | `5432` |
| `REDIS_URL` | Yes | Redis connection URL | `redis://redis:6379/0` |
| `STRIPE_SECRET_KEY` | No | Stripe secret key | `sk_live_...` |
| `STRIPE_PRICE_ID` | No | Stripe price ID | `price_...` |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook secret | `whsec_...` |
| `FRONTEND_BASE_URL` | Yes | Frontend URL | `https://yourdomain.com` |
| `AWS_S3_BUCKET` | No | S3 bucket for file storage | `jobhack-files` |
| `AWS_REGION` | No | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | No | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | No | AWS secret key | `...` |

## Monitoring and Maintenance

### Health Checks
- Application: `curl http://yourdomain.com/health`
- Database: `docker-compose exec db pg_isready`
- Redis: `docker-compose exec redis redis-cli ping`

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f worker
```

### Backup
```bash
# Database backup
docker-compose exec db pg_dump -U jobhack jobhack > backup.sql

# Restore database
docker-compose exec -T db psql -U jobhack jobhack < backup.sql
```

### Updates
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

## Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Check DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
   - Ensure database container is running

2. **Static files not loading:**
   - Run `python manage.py collectstatic --noinput`
   - Check nginx configuration

3. **Celery tasks not processing:**
   - Check Redis connection
   - Verify worker container is running

4. **File uploads failing:**
   - Check file size limits
   - Verify media directory permissions

### Performance Optimization

1. **Database:**
   - Add database indexes for frequently queried fields
   - Use connection pooling

2. **Caching:**
   - Enable Redis caching for job listings
   - Use CDN for static files

3. **Background Tasks:**
   - Scale Celery workers based on load
   - Use task prioritization

## Security Checklist

- [ ] Set `DEBUG=0` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure proper CORS settings
- [ ] Set up SSL/TLS certificates
- [ ] Use secure database passwords
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup data regularly

## Scaling

### Horizontal Scaling
- Use load balancer for multiple backend instances
- Scale Celery workers based on queue length
- Use Redis Cluster for high availability

### Vertical Scaling
- Increase container resources
- Optimize database queries
- Use caching strategies

## Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Test individual services
4. Check network connectivity
5. Review security settings



