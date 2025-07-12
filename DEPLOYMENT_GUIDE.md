
# CraigeeX WhatsApp Bot - Complete Deployment Guide

## 🚀 Quick Deploy Links

- **[👉 Deploy Backend to Railway](https://railway.app/new/template)**
- **[👉 Deploy Frontend to Vercel](https://vercel.com/new)**
- **[👉 Railway Dashboard](https://railway.app/dashboard)**

## 📋 Prerequisites

1. **OpenAI API Key**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create new API key
   - Ensure you have credits available

## Part 1: Deploy Backend to Railway

### Step 1: Quick Deploy
1. **[Click here to deploy to Railway](https://railway.app/new/template)**
2. **Select "Deploy from GitHub repo"**
3. **Choose:** `CIARA-X/chatwise-ai-craigee`
4. **Set Root Directory:** `backend`
5. **Click Deploy**

### Step 2: Set Environment Variables
**[Go to Railway Dashboard](https://railway.app/dashboard)** → Your Project → Variables:

```
OPENAI_API_KEY=sk-your-openai-key-here
OWNER_NUMBER=27847826044
OWNER_NAME=CraigeeX
```

### Step 3: Copy Railway URL
- Format: `https://your-project-name.railway.app`
- Save this URL for Vercel setup

## Part 2: Deploy Frontend to Vercel

### Step 1: Quick Deploy
1. **[Click here to deploy to Vercel](https://vercel.com/new)**
2. **Import:** `CIARA-X/chatwise-ai-craigee`
3. **Root Directory:** `/` (project root)
4. **Add Environment Variable:**
   ```
   VITE_BACKEND_URL=https://your-railway-app.railway.app
   ```
5. **Deploy**

## Part 3: Test System

### Step 1: Access Dashboard
Visit your Vercel URL: `https://your-project.vercel.app`

### Step 2: Generate Pair Code
1. Enter your WhatsApp number: `+27847826044`
2. Click "Generate Code"
3. Copy the 8-character code

### Step 3: Link WhatsApp
1. WhatsApp → Settings → Linked Devices
2. "Link a Device" → "Link with phone number instead"
3. Enter pair code

### Step 4: Test Bot
Send yourself a message - bot should respond with AI!

## 🔧 Troubleshooting Links

- **Railway Logs:** [Dashboard](https://railway.app/dashboard) → Your Project → Deployments
- **Vercel Logs:** [Dashboard](https://vercel.com/dashboard) → Your Project → Functions
- **Health Check:** `https://your-railway-app.railway.app/health`

## 📊 Success Indicators

✅ Railway backend running
✅ Vercel frontend accessible  
✅ Health endpoint returns `{"status":"ok"}`
✅ Bot responds to WhatsApp messages

## 💰 Costs

- **Railway:** Free tier (500 hrs/month)
- **Vercel:** Free tier (100GB bandwidth)  
- **OpenAI:** ~$10-20/month for moderate usage

---

🎉 **Your CraigeeX WhatsApp Bot is ready!**
