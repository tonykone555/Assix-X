const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

let client = null;
let qrCodeDataUrl = null;
let isReady = false;
let initError = null;

function initClient() {
  try {
    console.log('Initializing WhatsApp Client...');
    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      }
    });

    client.on('qr', async (qr) => {
      try {
        qrCodeDataUrl = await qrcode.toDataURL(qr);
        isReady = false;
        initError = null;
        console.log('WhatsApp QR Code generated and updated');
      } catch (err) {
        console.error('Failed to generate QR Data URL:', err);
      }
    });

    client.on('ready', () => {
      isReady = true;
      qrCodeDataUrl = null;
      initError = null;
      console.log('WhatsApp client ready');
    });

    client.on('auth_failure', (msg) => {
      console.error('WhatsApp authentication failure:', msg);
      isReady = false;
      initError = `Auth failure: ${msg}`;
    });

    client.on('disconnected', (reason) => {
      console.log('WhatsApp client disconnected:', reason);
      isReady = false;
      qrCodeDataUrl = null;
      setTimeout(() => {
        initClient(); // attempt to re-init on disconnect
      }, 5000);
    });

    client.initialize().catch(err => {
      console.error('Failed to initialize client:', err);
      initError = err.message;
    });
  } catch (err) {
    console.error('Error during WhatsApp init:', err);
    initError = err.message;
  }
}

initClient();

app.get('/api/status', (req, res) => {
  res.json({ ready: isReady, qrCode: qrCodeDataUrl, error: initError });
});

// Send the SAME message to a list of phone numbers, one at a time, with real delays
app.all('/api/send-bulk', async (req, res) => {
  // Support both GET (for EventSource) and POST
  let message = req.body?.message || req.query?.message;
  let rawPhoneNumbers = req.body?.phoneNumbers || req.query?.phoneNumbers;
  let phoneNumbers = [];

  if (rawPhoneNumbers) {
    if (typeof rawPhoneNumbers === 'string') {
      try {
        phoneNumbers = JSON.parse(rawPhoneNumbers);
      } catch (e) {
        // Fallback to splitting by comma if it's not JSON
        phoneNumbers = rawPhoneNumbers.split(',').map(s => s.trim());
      }
    } else if (Array.isArray(rawPhoneNumbers)) {
      phoneNumbers = rawPhoneNumbers;
    }
  }

  // Clean the phone numbers list
  phoneNumbers = phoneNumbers.filter(Boolean);

  if (!isReady) {
    return res.status(400).json({ error: 'WhatsApp not connected - scan QR code first' });
  }
  if (!message || !phoneNumbers.length) {
    return res.status(400).json({ error: 'message and phoneNumbers are required' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    if (typeof res.flush === 'function') {
      res.flush();
    }
  };

  console.log(`Starting bulk send of ${phoneNumbers.length} messages...`);

  for (let i = 0; i < phoneNumbers.length; i++) {
    const number = phoneNumbers[i];
    // Strip everything except digits
    const cleanNum = number.replace(/\D/g, '');
    const chatId = `${cleanNum}@c.us`;

    try {
      console.log(`Sending message to ${chatId}...`);
      await client.sendMessage(chatId, message);
      send('sent', { index: i + 1, total: phoneNumbers.length, number, success: true });
    } catch (err) {
      console.error(`Failed to send message to ${number}:`, err);
      send('sent', { index: i + 1, total: phoneNumbers.length, number, success: false, error: err.message });
    }

    // Real, deliberate pacing - randomized delay between 20-45 seconds, not instant blasting
    if (i < phoneNumbers.length - 1) {
      const delay = 20000 + Math.random() * 25000;
      send('waiting', { message: `Waiting ${Math.round(delay / 1000)}s before next message...` });
      await new Promise(r => setTimeout(r, delay));
    }
  }

  send('done', { totalSent: phoneNumbers.length });
  res.end();
});

const PORT = process.env.PORT || 5310;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`WhatsApp service running on port ${PORT}`);
});
