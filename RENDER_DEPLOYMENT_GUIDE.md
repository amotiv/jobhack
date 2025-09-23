# Render Deployment Guide for JobHack

## 🚀 **STEP-BY-STEP RENDER SETUP**

### **Step 1: Prepare Your Repository**
Your code is already ready! Just make sure you have:
- ✅ `requirements.txt` in the root directory
- ✅ `manage.py` in the `backend/` folder
- ✅ All your Django code in the `backend/` folder

### **Step 2: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### **Step 3: Create New Web Service**
1. Click "New +" → "Web Service"
2. Connect your `jobhack` repository
3. Render will auto-detect it's a Python/Django app

### **Step 4: Configure Your Service**
Fill in these settings:

**Basic Settings:**
- **Name**: `jobhack-backend`
- **Environment**: `Python 3`
- **Region**: Choose closest to your users
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `cd backend && python manage.py migrate && python manage.py seed_jobs && gunicorn --bind 0.0.0.0:$PORT api.wsgi:application`

### **Step 5: Add PostgreSQL Database**
1. Click "New +" → "PostgreSQL"
2. Name it: `jobhack-db`
3. Choose the same region as your web service
4. Click "Create Database"

### **Step 6: Link Database to Web Service**
1. Go back to your web service
2. Click "Environment" tab
3. You should see `DATABASE_URL` automatically added
4. If not, click "Link Resource" and select your PostgreSQL database

### **Step 7: Set Environment Variables**
In the "Environment" tab, add these variables:

```bash
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DEBUG=0
ALLOWED_HOSTS=*
FRONTEND_BASE_URL=https://your-app.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-app.onrender.com
```

### **Step 8: Generate Secret Key**
Run this command in your terminal to generate a secure secret key:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Copy the generated key and paste it as your `SECRET_KEY` value.

### **Step 9: Deploy**
1. Click "Create Web Service"
2. Render will start building and deploying your app
3. Wait 5-10 minutes for deployment to complete

## 🔍 **VERIFICATION STEPS**

### **Check Deployment Logs**
1. Go to your web service dashboard
2. Click "Logs" tab
3. Look for these success indicators:
   - ✅ "Build completed successfully"
   - ✅ "Starting gunicorn"
   - ✅ "Database migrations completed"
   - ✅ "Job data seeded successfully"

### **Test Your App**
1. **Health Check**: Visit `https://your-app.onrender.com/api/health/`
   - Should return: `{"ok": true, "status": "healthy"}`

2. **API Endpoints**: Test these URLs:
   - `https://your-app.onrender.com/api/jobs/` - Should show 15 jobs
   - `https://your-app.onrender.com/api/auth/register/` - Should work for registration

3. **Admin Panel**: Visit `https://your-app.onrender.com/admin/`
   - Create a superuser: `python manage.py createsuperuser`

## 🛠️ **TROUBLESHOOTING**

### **If Build Fails**
- Check that `requirements.txt` is in the root directory
- Verify all dependencies are listed correctly
- Check build logs for specific error messages

### **If Database Connection Fails**
- Ensure PostgreSQL service is created and linked
- Check that `DATABASE_URL` appears in environment variables
- Verify the database service is running

### **If App Won't Start**
- Check start command is correct
- Verify `manage.py` is in the `backend/` folder
- Check logs for Django errors

### **If Health Check Fails**
- Ensure `DEBUG=0` in environment variables
- Check that all required environment variables are set
- Verify the app is actually running

## 🎯 **EXPECTED RESULT**

After successful deployment:
- ✅ **App accessible** at your Render URL
- ✅ **Database connected** and migrations run
- ✅ **15 jobs seeded** and visible via API
- ✅ **Health check passes** at `/api/health/`
- ✅ **Registration works** for new users

## 🚀 **NEXT STEPS**

1. **Deploy your frontend** (React app) to Vercel or Netlify
2. **Update frontend API URL** to point to your Render backend
3. **Set up custom domain** (optional)
4. **Configure SSL** (automatic with Render)

## 📞 **NEED HELP?**

If you run into any issues:
1. Check the Render logs for error messages
2. Verify all environment variables are set correctly
3. Ensure your code is pushed to GitHub
4. Make sure the PostgreSQL service is linked

---

**Ready to deploy?** Follow these steps and your JobHack app will be live on Render! 🎉
