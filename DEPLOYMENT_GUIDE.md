
# CraigeeX WhatsApp Bot - Complete Deployment Guide

## 🚀 Quick Overview

This system consists of:
- **Frontend Dashboard** (Vercel) - User interface for pair code generation
- **Backend Bot** (Railway) - WhatsApp bot with ChatGPT integration

## 📋 Prerequisites

1. **OpenAI API Key**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create new API key
   - Ensure you have credits available

2. **Railway Account**
   - Sign up at [Railway.app](https://railway.app)
   - Free tier available

3. **Vercel Account**
   - Sign up at [Vercel.com](https://vercel.com)
   - Free tier available

## Part 1: Deploy Backend to Railway

### Step 1: Prepare Backend Files
The backend files are ready in the `backend/` directory:
- `server.js` - Main bot logic
- `package.json` - Dependencies
- `railway.json` - Railway configuration

### Step 2: Deploy to Railway

**Option A: Using Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend directory
cd backend

# Create new project
railway new

# Deploy
railway up
```

**Option B: Using Railway Web Interface**
1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo" or "Empty Project"
4. Upload the backend files
5. Railway will auto-detect Node.js and deploy

### Step 3: Set Environment Variables in Railway

In Railway Dashboard → Your Project → Variables, add:

```
OPENAI_API_KEY=sk-your-openai-key-here
OWNER_NUMBER=27847826044
OWNER_NAME=CraigeeX
```

### Step 4: Get Your Railway URL

After deployment, copy your Railway app URL:
- Format: `https://your-project-name.railway.app`
- Save this - you'll need it for the frontend

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Backend URL

In your current frontend code, update the `BACKEND_URL` in `src/pages/Index.tsx`:

```javascript
const BACKEND_URL = 'https://your-railway-app.railway.app';
```

Replace `your-railway-app.railway.app` with your actual Railway URL.

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# In your project root
vercel

# Follow prompts
```

**Option B: Using Vercel Web Interface**
1. Go to [Vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repo (or upload files)
4. Vercel will auto-detect React and deploy

### Step 3: Set Environment Variables (Optional)

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.railway.app
```

## Part 3: Test the Complete System

### Step 1: Access Your Dashboard
Visit your Vercel URL (e.g., `https://your-project.vercel.app`)

### Step 2: Generate Pair Code
1. Enter your WhatsApp number (e.g., +27847826044)
2. Click "Generate Code"
3. Copy the 8-character pair code

### Step 3: Link WhatsApp
1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Tap "Link a Device"
4. Choose "Link with phone number instead"
5. Enter the pair code from dashboard

### Step 4: Test Bot
1. Send a message to yourself or in a group
2. Bot should respond with AI-generated replies
3. Check dashboard for status updates

## 🔧 Troubleshooting

### Backend Issues

**Check Railway Logs:**
```bash
railway logs
```

**Common Issues:**
- Missing OpenAI API key
- Invalid phone number format
- Railway service not starting

**Health Check:**
Visit `https://your-railway-app.railway.app/health`

### Frontend Issues

**Check Vercel Deployment:**
- Build logs in Vercel dashboard
- Console errors in browser developer tools

**CORS Issues:**
- Ensure Railway backend has CORS enabled
- Check backend URL is correct

### WhatsApp Connection Issues

**Pair Code Problems:**
- Codes expire after 1 minute
- Generate new code if expired
- Ensure phone number format is correct

**Bot Not Responding:**
- Check if bot is in "Active" mode
- Verify OpenAI API has credits
- Check Railway logs for errors

## 📊 Monitoring & Maintenance

### Railway Monitoring
- Check uptime in Railway dashboard
- Monitor resource usage
- View real-time logs

### Vercel Monitoring
- Check deployment status
- Monitor function executions
- View analytics

### Bot Health
- Use `/health` endpoint for status
- Monitor OpenAI API usage
- Check WhatsApp connection status

## 💰 Costs

### Railway
- Free tier: 500 hours/month
- Paid plans start at $5/month

### Vercel
- Free tier: 100GB bandwidth
- Pro plan: $20/month if needed

### OpenAI
- Pay per token usage
- Approximately $0.002 per 1K tokens
- Budget ~$10-20/month for moderate usage

## 🔒 Security Best Practices

1. **Never commit .env files**
2. **Rotate API keys regularly**
3. **Monitor API usage**
4. **Use environment variables for all secrets**
5. **Keep dependencies updated**

## 📞 Support Checklist

Before seeking help:
- [ ] Railway backend is deployed and running
- [ ] Vercel frontend is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] OpenAI API key has credits
- [ ] Phone number format is correct
- [ ] Checked logs for errors

## 🎉 Success!

Once deployed, you'll have:
- ✅ Professional dashboard for bot management
- ✅ Smart WhatsApp bot with ChatGPT
- ✅ Context-aware responses
- ✅ Group and private chat support
- ✅ Owner recognition and prioritization
- ✅ Real-time status monitoring

Your CraigeeX WhatsApp Bot is now live and ready to assist!
