const express = require('express');
const cors = require('cors');
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const OpenAI = require('openai');
const P = require('pino');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Global variables
let sock = null;
let isConnected = false;
let isActive = true;
let connectionData = null;

// Owner information
const OWNER_NUMBER = process.env.OWNER_NUMBER || '27847826044';
const OWNER_NAME = 'CraigeeX';

// Logger
const logger = P({ level: 'info' });

// Store message history for context (in production, use a database)
const messageHistory = new Map();

// Helper function to get recent messages for context
function getRecentMessages(chatId, limit = 10) {
  if (!messageHistory.has(chatId)) {
    return [];
  }
  const messages = messageHistory.get(chatId);
  return messages.slice(-limit);
}

// Helper function to add message to history
function addMessageToHistory(chatId, message) {
  if (!messageHistory.has(chatId)) {
    messageHistory.set(chatId, []);
  }
  const messages = messageHistory.get(chatId);
  messages.push(message);
  
  // Keep only last 50 messages per chat
  if (messages.length > 50) {
    messages.splice(0, messages.length - 50);
  }
}

// AI Response function with context awareness
async function generateAIResponse(message, chatId, senderName, isGroup = false) {
  try {
    const recentMessages = getRecentMessages(chatId);
    
    let contextPrompt = `You are CraigeeX's smart WhatsApp assistant. You are helpful, conversational, and context-aware.

Owner: CraigeeX (+${OWNER_NUMBER})
Current chat: ${isGroup ? 'Group Chat' : 'Private Chat'}
Sender: ${senderName}

`;

    // Add recent conversation context
    if (recentMessages.length > 0) {
      contextPrompt += `Recent conversation context:\n`;
      recentMessages.forEach(msg => {
        contextPrompt += `${msg.sender}: ${msg.text}\n`;
      });
      contextPrompt += `\n`;
    }

    contextPrompt += `Current message from ${senderName}: ${message}

Instructions:
- Be helpful and conversational
- Use the context above to give relevant responses
- If the sender is the owner (CraigeeX), be more personal and prioritize their requests
- For group chats, acknowledge the group dynamic
- Keep responses concise but informative
- You can analyze past messages to understand ongoing topics or provide advice

Respond naturally:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: contextPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    logger.error('OpenAI API error:', error);
    return "I'm having trouble processing your message right now. Please try again later.";
  }
}

// Initialize WhatsApp connection
async function initializeWhatsApp() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    
    sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      printQRInTerminal: false,
      logger,
      generateHighQualityLinkPreview: true,
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        logger.info('Connection closed due to', lastDisconnect?.error, ', reconnecting', shouldReconnect);
        
        if (shouldReconnect) {
          initializeWhatsApp();
        } else {
          isConnected = false;
        }
      } else if (connection === 'open') {
        logger.info('WhatsApp connection opened');
        isConnected = true;
      }
    });

    sock.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (m) => {
      if (!isActive) return;

      const message = m.messages[0];
      if (!message.message || message.key.fromMe) return;

      const chatId = message.key.remoteJid;
      const messageText = message.message.conversation || 
                         message.message.extendedTextMessage?.text || '';
      
      if (!messageText) return;

      // Get sender info
      const senderNumber = message.key.participant || message.key.remoteJid;
      const senderName = message.pushName || senderNumber.split('@')[0];
      const isGroup = chatId.includes('@g.us');
      const isOwner = senderNumber.includes(OWNER_NUMBER);

      // Add message to history
      addMessageToHistory(chatId, {
        sender: senderName,
        text: messageText,
        timestamp: new Date(),
        isOwner
      });

      logger.info(`Received message from ${senderName} in ${isGroup ? 'group' : 'private'}: ${messageText}`);

      try {
        // Generate AI response
        const aiResponse = await generateAIResponse(messageText, chatId, senderName, isGroup);
        
        // Send response
        await sock.sendMessage(chatId, { text: aiResponse });
        
        // Add bot response to history
        addMessageToHistory(chatId, {
          sender: 'CraigeeX Bot',
          text: aiResponse,
          timestamp: new Date(),
          isBot: true
        });

        logger.info(`Sent response to ${senderName}: ${aiResponse.substring(0, 100)}...`);
      } catch (error) {
        logger.error('Error processing message:', error);
      }
    });

  } catch (error) {
    logger.error('Error initializing WhatsApp:', error);
  }
}

// API Routes

// Generate pair code
app.post('/api/generate-pair', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Clean phone number
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (!sock) {
      await initializeWhatsApp();
    }

    // Generate pairing code
    const pairCode = await sock.requestPairingCode(cleanNumber);
    
    connectionData = { phoneNumber: cleanNumber, pairCode };
    
    logger.info(`Generated pair code ${pairCode} for ${cleanNumber}`);
    
    res.json({ 
      success: true, 
      pairCode,
      message: 'Pair code generated successfully' 
    });
  } catch (error) {
    logger.error('Error generating pair code:', error);
    res.status(500).json({ error: 'Failed to generate pair code' });
  }
});

// Check connection status
app.get('/api/status', (req, res) => {
  res.json({
    connected: isConnected,
    active: isActive,
    phoneNumber: connectionData?.phoneNumber || null
  });
});

// Toggle bot active mode
app.post('/api/toggle-mode', (req, res) => {
  const { active } = req.body;
  isActive = active;
  
  logger.info(`Bot mode changed to: ${active ? 'active' : 'silent'}`);
  
  res.json({ 
    success: true, 
    active: isActive,
    message: `Bot is now ${active ? 'active' : 'silent'}` 
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connected: isConnected,
    active: isActive,
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CraigeeX WhatsApp Bot Backend',
    status: 'running',
    connected: isConnected,
    active: isActive
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  
  // Initialize WhatsApp connection on startup
  initializeWhatsApp();
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
  if (sock) {
    sock.end();
  }
  process.exit(0);
});
