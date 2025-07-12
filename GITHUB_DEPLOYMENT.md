
# GitHub + Vercel + Railway Deployment Guide

## 🎯 Deployment Order (IMPORTANT!)

**Deploy in this exact order:**

1. **Backend to Railway FIRST** ← Start here
2. **Frontend to Vercel SECOND** ← After backend is live

## 📋 Prerequisites

- ✅ GitHub account (you have this)
- ✅ Railway account (you're logged in)
- ✅ Vercel account 
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Step 1: Push to GitHub (If not done already)

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: CraigeeX WhatsApp Bot"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/CIARA-X/chatwise-ai-craigee.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### Quick Deploy Link
**[👉 CLICK HERE TO DEPLOY TO RAILWAY](https://railway.app/new/template)**

1. **Select "Deploy from GitHub repo"**
2. **Choose your repository:** `CIARA-X/chatwise-ai-craigee`
3. **IMPORTANT:** Set **Root Directory** to: `backend`
4. **Click "Deploy"**

### Direct Environment Variables Setup
After deployment starts, **[👉 CLICK HERE FOR VARIABLES](https://railway.app/dashboard)** then:

1. **Click your project name**
2. **Go to "Variables" tab**
3. **Add these variables:**

```
OPENAI_API_KEY=sk-your-openai-key-here
OWNER_NUMBER=27847826044
OWNER_NAME=CraigeeX
```

### Get Your Railway URL
- Your Railway URL will be: `https://[project-name].railway.app`
- **Copy this URL** - you need it for Vercel

## Step 3: Deploy Frontend to Vercel

### Quick Deploy Link
**[👉 CLICK HERE TO DEPLOY TO VERCEL](https://vercel.com/new)**

1. **Import your GitHub repository:** `CIARA-X/chatwise-ai-craigee`
2. **Root Directory:** Leave as `/` (project root)
3. **Add Environment Variable:**
   ```
   VITE_BACKEND_URL=https://your-railway-app.railway.app
   ```
4. **Click "Deploy"**

## Step 4: Test Complete System

1. **Visit your Vercel URL:** `https://your-project.vercel.app`
2. **Enter your WhatsApp number:** `+27847826044`
3. **Generate pair code**
4. **Link WhatsApp:**
   - WhatsApp → Settings → Linked Devices
   - "Link with phone number instead"
   - Enter the pair code
5. **Test bot:** Send yourself a message

## 🔧 Quick Links for Troubleshooting

- **Railway Dashboard:** [railway.app/dashboard](https://railway.app/dashboard)
- **Railway Logs:** Click your project → "Deployments" → View logs
- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Backend Health Check:** `https://your-railway-app.railway.app/health`

## 📊 Expected Results

✅ **Railway Backend:** Running at `https://[project].railway.app`
✅ **Vercel Frontend:** Running at `https://[project].vercel.app`
✅ **Health Check:** Returns `{"status":"ok"}`
✅ **WhatsApp Bot:** Responds to messages with AI

## 💡 Pro Tips

- **Railway auto-deploys** on GitHub pushes to main branch
- **Vercel auto-deploys** on GitHub pushes to main branch
- **Pair codes expire in 1 minute** - generate new ones if needed
- **Check Railway logs** if bot doesn't respond

---

🚀 **Ready to deploy!** Use the direct links above to skip setup steps.
