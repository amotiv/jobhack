# Railway Deployment Error Report with Code Fixes

## 🚨 **CURRENT ERROR**

```
django.db.utils.OperationalError: connection failed: connection to server at "127.0.0.1", port 5432 failed: Connection refused
Is the server running on that host and accepting TCP/IP connections?
Multiple connection attempts failed. All failures are:
- host: 'localhost', port: '5432', hostaddr: '::1': connection failed: connection to server at "::1", port 5432 failed: Connection refused
- host: 'localhost', port: '5432', hostaddr: '127.0.0.1': connection failed: connection to server at "127.0.0.1", port 5432 failed: Connection refused
```

## 🔍 **ROOT CAUSE ANALYSIS**

**Problem**: Django is still trying to connect to `localhost:5432` instead of Railway's PostgreSQL database.

**Why This Happens**:
1. `DATABASE_URL` environment variable is not being set by Railway
2. Django falls back to default localhost database configuration
3. Railway's PostgreSQL service is not properly linked to the Django service

## 🛠️ **COMPLETE CODE FIXES**

### **1. Hard-Lock Database Configuration**

**File**: `backend/api/settings_railway.py`

```python
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
```

### **2. Updated Requirements**

**File**: `requirements.txt`

```txt
django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
django-storages
boto3
psycopg[binary]==3.*
python-dotenv
PyPDF2
python-docx
celery
kombu[sqs]
redis
stripe
gunicorn
dj-database-url==2.*
```

### **3. Railway Configuration**

**File**: `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && export DJANGO_SETTINGS_MODULE=api.settings_railway && python -c \"import os; print('DATABASE_URL present:', bool(os.getenv('DATABASE_URL')))\" && python manage.py migrate && python manage.py seed_jobs && gunicorn --bind 0.0.0.0:$PORT --timeout 120 --workers 1 api.wsgi:application",
    "healthcheckPath": "/api/health/",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**File**: `Procfile`

```
web: cd backend && export DJANGO_SETTINGS_MODULE=api.settings_railway && python -c "import os; print('DATABASE_URL present:', bool(os.getenv('DATABASE_URL')))" && python manage.py migrate && python manage.py seed_jobs && gunicorn --bind 0.0.0.0:$PORT --timeout 120 --workers 1 api.wsgi:application
```

### **4. Database Test Script**

**File**: `test_railway_db.py`

```python
#!/usr/bin/env python3
"""
Railway Database Connection Test Script
Run this in Railway shell to verify DATABASE_URL is working correctly.
"""

import os
import sys

def test_railway_database():
    """Test Railway database connection and configuration."""
    
    print("=== Railway Database Connection Test ===")
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings_railway')
    
    try:
        import dj_database_url
        
        # Check DATABASE_URL
        url = os.getenv("DATABASE_URL")
        print(f"DATABASE_URL set: {bool(url)}")
        
        if not url:
            print("❌ DATABASE_URL is not set!")
            print("   → Add/link PostgreSQL service in Railway dashboard")
            print("   → Ensure Django service inherits DATABASE_URL")
            return False
            
        # Parse and display config
        cfg = dj_database_url.parse(url, conn_max_age=0, ssl_require=True)
        print(f"✅ Parsed host: {cfg.get('HOST')}")
        print(f"✅ Parsed name: {cfg.get('NAME')}")
        print(f"✅ Parsed user: {cfg.get('USER')}")
        print(f"✅ Parsed port: {cfg.get('PORT')}")
        
        # Test actual connection
        try:
            import psycopg
            conn = psycopg.connect(
                host=cfg['HOST'],
                port=cfg['PORT'],
                database=cfg['NAME'],
                user=cfg['USER'],
                password=cfg['PASSWORD']
            )
            conn.close()
            print("✅ Database connection successful!")
            return True
            
        except ImportError:
            # Fallback to psycopg2
            try:
                import psycopg2
                conn = psycopg2.connect(
                    host=cfg['HOST'],
                    port=cfg['PORT'],
                    database=cfg['NAME'],
                    user=cfg['USER'],
                    password=cfg['PASSWORD']
                )
                conn.close()
                print("✅ Database connection successful!")
                return True
            except Exception as e:
                print(f"❌ Database connection failed: {e}")
                return False
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            return False
            
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_django_migration():
    """Test Django migration with Railway settings."""
    print("\n=== Django Migration Test ===")
    
    try:
        import django
        django.setup()
        
        from django.core.management import execute_from_command_line
        
        print("Running Django migrations...")
        execute_from_command_line(['manage.py', 'migrate', '--verbosity=2'])
        print("✅ Django migrations completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Django migration failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Railway database configuration...")
    
    db_ok = test_railway_database()
    migration_ok = test_django_migration() if db_ok else False
    
    print("\n=== Summary ===")
    if db_ok and migration_ok:
        print("✅ All tests passed! Railway database is working correctly.")
        sys.exit(0)
    else:
        print("❌ Tests failed. Check the errors above.")
        sys.exit(1)
```

## 🚀 **DEPLOYMENT STEPS**

### **1. Push Code Changes**
```bash
cd /Users/adamthomas/jobhack
git add .
git commit -m "Hard-lock Railway database config - prevent localhost fallback"
git push origin main
```

### **2. Railway Dashboard Configuration**

#### **A. Add PostgreSQL Service**
1. Go to Railway dashboard
2. Click "New Service" → "PostgreSQL"
3. Wait for service to be created

#### **B. Link Services**
1. Ensure Django service is connected to PostgreSQL service
2. Check that `DATABASE_URL` is automatically provided

#### **C. Set Environment Variables**
In Railway → Variables tab, add:
```bash
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DEBUG=0
ALLOWED_HOSTS=*
FRONTEND_BASE_URL=https://your-app.railway.app
```

### **3. Verify Deployment**

#### **Check Railway Logs**
Look for this line in the deployment logs:
```
DATABASE_URL present: True
```

If you see `DATABASE_URL present: False`, the PostgreSQL service isn't linked correctly.

#### **Test Database Connection**
Run in Railway shell:
```bash
python test_railway_db.py
```

#### **Check Health Endpoint**
Visit: `https://your-app.railway.app/api/health/`

Should return: `{"ok": true, "status": "healthy"}`

## 🔍 **TROUBLESHOOTING**

### **If DATABASE_URL is still missing:**
1. **Check service links**: Ensure PostgreSQL service is connected to Django service
2. **Redeploy**: Trigger a new deployment after linking services
3. **Check logs**: Look for "DATABASE_URL present:" message

### **If connection still fails:**
1. **Run test script**: `python test_railway_db.py`
2. **Check Railway variables**: Ensure all environment variables are set
3. **Verify service status**: Ensure PostgreSQL service is running

### **Expected Success Output:**
```
DATABASE_URL present: True
✅ Parsed host: [railway-postgres-host]
✅ Parsed name: [database-name]
✅ Database connection successful!
✅ Django migrations completed successfully!
```

## 🎯 **KEY FIXES EXPLAINED**

### **1. Hard-Lock Database Config**
- **Fail-fast**: Raises error if `DATABASE_URL` is missing
- **No fallback**: Removes all localhost fallback configurations
- **SSL required**: Forces secure connection to Railway's PostgreSQL

### **2. Enhanced Start Command**
- **Debug visibility**: Shows if `DATABASE_URL` is present
- **Clean environment**: Uses `export` for settings module
- **Simplified**: Removes redundant configuration

### **3. Updated Dependencies**
- **psycopg3**: Better Railway compatibility
- **dj-database-url**: Robust DATABASE_URL parsing

## 🎉 **EXPECTED RESULT**

After implementing these fixes:
- ✅ **No more localhost errors**: Django will never try to connect to `127.0.0.1:5432`
- ✅ **Clear error messages**: If `DATABASE_URL` is missing, you'll get a clear error
- ✅ **Successful deployment**: Railway will connect to PostgreSQL and run migrations
- ✅ **Working application**: Your JobHack app will be live and functional

---

**This comprehensive fix eliminates the localhost fallback completely and forces Railway's PostgreSQL usage!** 🚀
