import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import dj_database_url
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Fail fast if DATABASE_URL is missing
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. On Railway, add/link a PostgreSQL service "
        "and ensure the Django service inherits DATABASE_URL."
    )

# Force SSL and long-lived connections for Railway (psycopg3 compatible)
DATABASES = {
    "default": dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=600,
        ssl_require=True,  # implies options like sslmode=require
    )
}

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
DEBUG = os.getenv("DEBUG", "0") == "1"
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
    "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles",
    "rest_framework", "corsheaders", "storages", "core",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "api.urls"
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [], "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]
WSGI_APPLICATION = "api.wsgi.application"

# Database configuration is set at the top of this file

AUTH_USER_MODEL = "core.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=6),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

CORS_ALLOW_ALL_ORIGINS = True

STATIC_URL = "/static/"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Railway-specific settings
if os.getenv("RAILWAY_ENVIRONMENT"):
    # Use Railway's static file serving
    STATIC_ROOT = BASE_DIR / "staticfiles"
    STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"

# S3 optional (used if bucket is set)
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")
if AWS_S3_BUCKET:
    AWS_STORAGE_BUCKET_NAME = AWS_S3_BUCKET
    AWS_S3_REGION_NAME = os.getenv("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

# Celery Configuration
CELERY_BROKER = os.getenv("CELERY_BROKER", "redis")
if CELERY_BROKER == "sqs":
    CELERY_BROKER_URL = "sqs://"
    CELERY_BROKER_TRANSPORT_OPTIONS = {
        "region": os.getenv("AWS_REGION", "us-east-1"),
        "visibility_timeout": 3600,
        "polling_interval": 1,
        "queue_name_prefix": os.getenv("SQS_PREFIX", "jobhack-"),
    }
else:
    CELERY_BROKER_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

CELERY_RESULT_BACKEND = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CELERY_TASK_ALWAYS_EAGER = os.getenv("CELERY_EAGER", "0") == "1"

# Stripe Configuration
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")

# Optional: premium visibility toggle
SHOW_MATCH_TO_FREE = os.getenv("SHOW_MATCH_TO_FREE", "0") == "1"
