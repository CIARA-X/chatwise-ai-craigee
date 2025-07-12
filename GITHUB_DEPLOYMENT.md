
# GitHub + Vercel + Railway Deployment Guide

## 🎯 Deployment Order (IMPORTANT!)

**Deploy in this exact order:**

1. **Backend to Railway FIRST** ← Start here
2. **Frontend to Vercel SECOND** ← After backend is live

## 📋 Prerequisites

- GitHub account
- Railway account ([railway.app](https://railway.app))
- Vercel account ([vercel.com](https://vercel.com))
- OpenAI API key ([platform.openai.com](https://platform.openai.com/api-keys))

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: CraigeeX WhatsApp Bot"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/craigeex-whatsapp-bot.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### Option A: GitHub Integration (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `backend` folder as the root directory
6. Railway will auto-detect Node.js and deploy

### Option B: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Navigate to backend
cd backend

# Login and deploy
railway login
railway new
railway up
```

### Set Environment Variables in Railway
In Railway Dashboard → Your Project → Variables:
```
OPENAI_API_KEY=sk-your-openai-key-here
OWNER_NUMBER=27847826044
OWNER_NAME=CraigeeX
```

### Get Your Railway URL
- Copy your Railway app URL: `https://your-project.railway.app`
- Save this URL - you'll need it for frontend deployment

## Step 3: Deploy Frontend to Vercel

### Option A: GitHub Integration (Recommended)
1. Go to [Vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. **Important**: Set Root Directory to `/` (project root, not backend)
5. Add environment variable:
   ```
   VITE_BACKEND_URL=https://your-railway-app.railway.app
   ```
6. Deploy

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# In project root (not backend folder)
vercel

# Set environment variables when prompted
# VITE_BACKEND_URL=https://your-railway-app.railway.app
```

## Step 4: Update Backend URL in Frontend

After deployment, you need to update the backend URL in your live frontend:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   ```
   VITE_BACKEND_URL=https://your-railway-app.railway.app
   ```
3. Redeploy the frontend

## Step 5: Test Complete System

1. **Visit your Vercel dashboard**: `https://your-project.vercel.app`
2. **Enter your WhatsApp number** (e.g., +27847826044)
3. **Generate pair code**
4. **Link WhatsApp**: 
   - Open WhatsApp → Settings → Linked Devices
   - "Link a Device" → "Link with phone number instead"
   - Enter the pair code
5. **Test bot**: Send yourself a message

## 🔧 Troubleshooting

### Backend Issues
```bash
# Check Railway logs
railway logs

# Common fixes:
# - Missing OpenAI API key
# - Wrong environment variables
# - Railway service not starting
```

### Frontend Issues
- Check Vercel deployment logs
- Verify `VITE_BACKEND_URL` is correct
- Test backend health: `https://your-railway-app.railway.app/health`

### Connection Issues
- Pair codes expire in 1 minute
- Generate new code if expired
- Check Railway backend is running
- Verify OpenAI API has credits

## 🎉 Success URLs

After successful deployment:
- **Dashboard**: `https://your-project.vercel.app`
- **Backend API**: `https://your-railway-app.railway.app`
- **Health Check**: `https://your-railway-app.railway.app/health`

## 💰 Costs

- **GitHub**: Free
- **Railway**: Free tier (500 hrs/month)
- **Vercel**: Free tier (100GB bandwidth)
- **OpenAI**: ~$10-20/month for moderate usage

## 🔄 Auto-Deploy Setup

Both platforms support auto-deploy from GitHub:
- **Railway**: Auto-deploys on push to main branch
- **Vercel**: Auto-deploys on push to main branch

Your bot will automatically update when you push code changes!

---

🚀 **Ready to deploy!** Start with Railway backend, then Vercel frontend.
