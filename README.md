# JobHack - AI-Powered Job Matching Platform

JobHack is a modern web application that helps job seekers find their perfect match by analyzing their resume against job listings and providing intelligent scoring and recommendations.

## Features

- **Resume Upload & Analysis**: Upload PDF/DOCX resumes with ATS-friendly analysis
- **Smart Job Matching**: AI-powered matching algorithm based on keywords and skills
- **Premium Features**: Detailed match scores and advanced filtering for premium users
- **Modern UI**: Responsive design with dark/light theme support
- **Real-time Search**: Filter jobs by keywords, location, and match percentage
- **User Authentication**: Secure JWT-based authentication system
- **Subscription Management**: Stripe integration for premium upgrades

## Tech Stack

### Backend
- **Django 4.2+** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Primary database
- **Redis** - Caching and task queue
- **Celery** - Background task processing
- **Stripe** - Payment processing
- **AWS S3** - File storage (optional)

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data fetching
- **React Router** - Navigation

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development
- **PostgreSQL** - Database
- **Redis** - Cache and message broker

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ and pnpm (for frontend development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd jobhack
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
# At minimum, set a SECRET_KEY for Django
```

### 3. Start with Docker
```bash
# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec worker python manage.py migrate

# Create a superuser (optional)
docker-compose exec worker python manage.py createsuperuser

# Seed sample job data
docker-compose exec worker python manage.py seed_jobs
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## Development Setup

### Backend Development
```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp ../env.example .env
# Edit .env as needed

# Run migrations
python manage.py migrate

# Seed data
python manage.py seed_jobs

# Start development server
python manage.py runserver
```

### Frontend Development
```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | Required |
| `DEBUG` | Debug mode | `1` |
| `DB_NAME` | Database name | `jobhack` |
| `DB_USER` | Database user | `jobhack` |
| `DB_PASSWORD` | Database password | `jobhack` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `STRIPE_SECRET_KEY` | Stripe secret key | Optional |
| `STRIPE_PRICE_ID` | Stripe price ID for premium | Optional |
| `FRONTEND_BASE_URL` | Frontend URL for redirects | `http://localhost:5173` |

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token

### Jobs
- `GET /api/jobs/` - List jobs with optional filtering
- `GET /api/jobs/{id}/` - Get job details
- Query parameters: `keyword`, `location`, `sort`

### Resumes
- `POST /api/resumes/upload/` - Upload resume file

### Billing
- `POST /api/billing/checkout-session/` - Create Stripe checkout session
- `POST /api/billing/webhook/` - Stripe webhook handler

## Project Structure

```
jobhack/
├── backend/                 # Django backend
│   ├── core/               # Main app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # Data serializers
│   │   ├── scoring.py      # Job matching algorithm
│   │   ├── tasks.py        # Celery tasks
│   │   └── billing.py      # Stripe integration
│   ├── api/                # API configuration
│   └── manage.py           # Django management
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API client
│   │   └── main.tsx        # App entry point
│   └── package.json
├── docker-compose.yml      # Docker services
└── README.md
```

## Deployment

### Production Checklist
1. Set `DEBUG=0` in environment
2. Configure proper `SECRET_KEY`
3. Set up production database
4. Configure Redis for production
5. Set up AWS S3 for file storage
6. Configure Stripe webhooks
7. Set up SSL certificates
8. Configure proper CORS settings

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.


