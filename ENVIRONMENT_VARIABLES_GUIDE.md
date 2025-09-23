# Environment Variables Setup Guide

## 🔧 **REQUIRED ENVIRONMENT VARIABLES**

### **Core Django Settings**
```bash
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DEBUG=0
ALLOWED_HOSTS=*
DJANGO_SETTINGS_MODULE=api.settings_railway
```

### **Database (Auto-provided by hosting platform)**
```bash
# These are automatically set by your hosting platform
DATABASE_URL=postgresql://user:password@host:port/database
```

### **Frontend Configuration**
```bash
FRONTEND_BASE_URL=https://your-app.onrender.com
```

### **CSRF Protection**
```bash
CSRF_TRUSTED_ORIGINS=https://your-app.onrender.com,https://your-frontend.vercel.app
```

## 🎯 **PLATFORM-SPECIFIC SETUP**

### **Render.com**
1. Go to your Render dashboard
2. Click on your web service
3. Go to "Environment" tab
4. Add these variables:

```bash
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DEBUG=0
ALLOWED_HOSTS=*
FRONTEND_BASE_URL=https://your-app.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-app.onrender.com
```

**Note**: `DATABASE_URL` is automatically provided by Render's PostgreSQL service.

### **DigitalOcean App Platform**
1. Go to your app in DigitalOcean dashboard
2. Click "Settings" → "App-Level Environment Variables"
3. Add these variables:

```bash
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DEBUG=0
ALLOWED_HOSTS=*
FRONTEND_BASE_URL=https://your-app.ondigitalocean.app
CSRF_TRUSTED_ORIGINS=https://your-app.ondigitalocean.app
```

### **Heroku**
1. Go to your Heroku app dashboard
2. Click "Settings" → "Config Vars"
3. Add these variables:

```bash
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DEBUG=0
ALLOWED_HOSTS=*
FRONTEND_BASE_URL=https://your-app.herokuapp.com
CSRF_TRUSTED_ORIGINS=https://your-app.herokuapp.com
```

### **Fly.io**
1. Use Fly CLI: `fly secrets set SECRET_KEY=your-key`
2. Or use Fly dashboard → Secrets tab

```bash
fly secrets set SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
fly secrets set DEBUG=0
fly secrets set ALLOWED_HOSTS=*
fly secrets set FRONTEND_BASE_URL=https://your-app.fly.dev
fly secrets set CSRF_TRUSTED_ORIGINS=https://your-app.fly.dev
```

## 🔐 **GENERATING A SECURE SECRET KEY**

### **Option 1: Python Script**
```python
import secrets
print(secrets.token_urlsafe(50))
```

### **Option 2: Online Generator**
- Go to [djecrety.ir](https://djecrety.ir/)
- Generate a new secret key
- Copy and use it

### **Option 3: Command Line**
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

## 📋 **COMPLETE ENVIRONMENT VARIABLES LIST**

### **Required (Must Set)**
```bash
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DEBUG=0
ALLOWED_HOSTS=*
FRONTEND_BASE_URL=https://your-app.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-app.onrender.com
```

### **Optional (Can Set Later)**
```bash
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3 (for file storage)
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Redis (for background tasks)
REDIS_URL=redis://localhost:6379/0

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## 🚀 **QUICK SETUP STEPS**

### **1. Generate Secret Key**
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### **2. Set Environment Variables**
Copy the generated secret key and set these variables in your hosting platform:

```bash
SECRET_KEY=[paste-your-generated-key-here]
DEBUG=0
ALLOWED_HOSTS=*
FRONTEND_BASE_URL=https://your-app.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-app.onrender.com
```

### **3. Deploy**
Your app should now deploy successfully with proper database connection!

## 🔍 **VERIFICATION**

After setting environment variables and deploying:

1. **Check logs** - Should show successful database connection
2. **Visit health endpoint** - `https://your-app.onrender.com/api/health/`
3. **Test registration** - Try creating a new account
4. **Check job listings** - Should see the 15 seeded jobs

## ❗ **IMPORTANT NOTES**

- **Never commit secret keys** to your repository
- **Use different keys** for development and production
- **Rotate keys regularly** for security
- **Keep keys secure** - don't share them publicly

---

**Which hosting platform are you using?** I can provide specific setup instructions for your chosen platform! 🚀
