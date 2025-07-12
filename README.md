
# CraigeeX WhatsApp ChatGPT Bot

A complete WhatsApp ChatGPT bot system with intelligent responses, context awareness, and easy deployment.

## 🚀 Features

- **Smart WhatsApp Bot** with ChatGPT integration
- **Context-Aware Responses** - Analyzes message history for better replies
- **Owner Recognition** - Prioritizes messages from CraigeeX
- **Group & Private Chat Support**
- **Real-time Dashboard** for bot management
- **Pair Code Authentication** - No QR codes needed
- **Active/Silent Mode Toggle**
- **Message History Analysis**

## 🏗️ Architecture

- **Frontend Dashboard**: React + Vite + Tailwind CSS (Vercel)
- **Backend Bot**: Node.js + Baileys + OpenAI API (Railway)

## 📱 Live Demo

- **Dashboard**: [Your Vercel URL]
- **Bot Status**: Active on WhatsApp

## 🚀 Quick Deploy

### Prerequisites
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))
- Railway Account ([Sign up](https://railway.app))
- Vercel Account ([Sign up](https://vercel.com))

### 1. Deploy Backend to Railway First
```bash
# Navigate to backend directory
cd backend

# Deploy to Railway
railway login
railway new
railway up
```

Set environment variables in Railway:
```
OPENAI_API_KEY=your_openai_key_here
OWNER_NUMBER=27847826044
OWNER_NAME=CraigeeX
```

### 2. Deploy Frontend to Vercel
```bash
# In project root
vercel --prod
```

Update the backend URL in the deployed frontend dashboard.

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start frontend
npm run dev

# Start backend (separate terminal)
cd backend
npm install
npm run dev
```

## 📋 Environment Variables

### Backend (.env)
```bash
OPENAI_API_KEY=your_openai_api_key
OWNER_NUMBER=27847826044
OWNER_NAME=CraigeeX
PORT=3001
```

### Frontend (optional)
```bash
VITE_BACKEND_URL=http://localhost:3001
```

## 🤖 How to Use

1. **Deploy Backend** to Railway
2. **Deploy Frontend** to Vercel
3. **Visit Dashboard** and enter your WhatsApp number
4. **Get Pair Code** from the dashboard
5. **Link WhatsApp**: Settings → Linked Devices → Link with Phone Number
6. **Enter Pair Code** in WhatsApp
7. **Bot is Live!** - Start chatting

## 📁 Project Structure

```
├── src/                    # Frontend dashboard
├── backend/               # WhatsApp bot backend
├── DEPLOYMENT_GUIDE.md    # Detailed deployment guide
└── README.md             # This file
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express, Baileys v6, OpenAI API
- **Deployment**: Vercel + Railway
- **Storage**: Local auth session (Railway persistent storage)

## 📞 Support

1. Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
2. Verify all environment variables are set
3. Check Railway logs: `railway logs`
4. Ensure OpenAI API has credits

## 🔒 Security

- API keys stored as environment variables
- No sensitive data in codebase
- WhatsApp session encrypted by Baileys
- CORS configured for dashboard only

## 📄 License

MIT License - Feel free to use and modify!

---

Built with ❤️ by CraigeeX
