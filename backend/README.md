
# CraigeeX WhatsApp Bot Backend

A smart WhatsApp ChatGPT bot backend built with Baileys and OpenAI, designed to run on Railway.

## Features

- 🤖 Context-aware ChatGPT responses
- 📱 Pair code authentication (no QR codes needed)
- 👥 Supports both group and private chats
- 🧠 Message history analysis for better context
- 🎯 Owner recognition and prioritization
- 🔄 Real-time status monitoring
- 🎚️ Active/Silent mode toggle

## Setup Instructions

### 1. Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
# - Add your OpenAI API key
# - Set your phone number
# - Configure other settings

# Start development server
npm run dev
```

### 2. Railway Deployment

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Create new project
   railway new
   ```

2. **Set Environment Variables**
   In Railway dashboard, go to Variables and add:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   OWNER_NUMBER=27847826044
   OWNER_NAME=CraigeeX
   ```

3. **Deploy**
   ```bash
   # Connect to Railway project
   railway link
   
   # Deploy
   railway up
   ```

4. **Get Your Railway URL**
   - Copy your Railway app URL (e.g., `https://your-app.railway.app`)
   - Update the frontend `BACKEND_URL` variable

### 3. Frontend Integration

Update your Vercel frontend environment:
```bash
# In your frontend .env.local
NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.railway.app
```

## API Endpoints

- `POST /api/generate-pair` - Generate WhatsApp pair code
- `GET /api/status` - Check bot connection status
- `POST /api/toggle-mode` - Toggle active/silent mode
- `GET /health` - Health check endpoint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `OWNER_NUMBER` | Your WhatsApp number (digits only) | Yes |
| `OWNER_NAME` | Your display name | No |
| `PORT` | Server port (Railway sets automatically) | No |

## How It Works

1. User enters phone number on dashboard
2. Backend generates WhatsApp pair code
3. User enters code in WhatsApp to link
4. Bot starts responding to messages with AI
5. Context-aware responses using conversation history
6. Owner gets prioritized, personalized responses

## File Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── railway.json       # Railway config
├── .env.example       # Environment template
├── auth_info/         # WhatsApp session (auto-created)
└── README.md          # This file
```

## Support

For issues:
1. Check Railway logs: `railway logs`
2. Verify environment variables
3. Ensure OpenAI API key has credits
4. Check WhatsApp connection status

## Security Notes

- Never commit .env files
- Keep your OpenAI API key secure
- Auth files are automatically created and should be persistent
- Railway handles HTTPS automatically
