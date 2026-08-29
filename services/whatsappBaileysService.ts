import QRCode from 'qrcode';
import pino from 'pino';
import fs from 'fs';
import path from 'path';

// Use CJS require for Baileys to avoid TSX/Node ESM export resolution quirks
const baileys = require('@whiskeysockets/baileys');
const makeWASocket = baileys.default || baileys;
const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers
} = baileys;

export interface WhatsAppMessage {
  id: string;
  leadId?: string;
  phone: string;
  leadName?: string;
  direction: 'outbound' | 'inbound';
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  timestamp: string;
  error?: string;
}

export interface Conversation {
  phone: string;
  leadId?: string;
  leadName?: string;
  businessName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  messages: WhatsAppMessage[];
}

export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  let clean = phone.trim().replace(/[^\d+]/g, '');
  if (clean.startsWith('+')) clean = clean.substring(1);
  if (clean.startsWith('00')) clean = clean.substring(2);
  
  // Local French/European numbers starting with 0 (e.g. 0612345678 -> 33612345678)
  if (clean.startsWith('0') && clean.length === 10) {
    clean = '33' + clean.substring(1);
  }
  return clean;
}

export interface WhatsAppStatus {
  status: 'DISCONNECTED' | 'INITIALIZING' | 'QR_READY' | 'AUTHENTICATING' | 'CONNECTED';
  qrCodeDataUrl: string | null;
  pairingCode: string | null;
  userPhone: string | null;
  userName: string | null;
  error: string | null;
  stats: {
    totalSent: number;
    totalFailed: number;
    activeConversations: number;
  };
}

const AUTH_DIR = path.join(process.cwd(), 'whatsapp_auth');
const CONVERSATIONS_FILE = path.join(process.cwd(), 'whatsapp_conversations.json');

class WhatsAppBaileysManager {
  private sock: any = null;
  private currentStatus: WhatsAppStatus['status'] = 'DISCONNECTED';
  private currentQrCodeDataUrl: string | null = null;
  private currentPairingCode: string | null = null;
  private userPhone: string | null = null;
  private userName: string | null = null;
  private connectionError: string | null = null;
  private conversations: Map<string, Conversation> = new Map();
  private stats = { totalSent: 0, totalFailed: 0 };
  private isConnecting = false;

  constructor() {
    this.loadConversations();
  }

  private loadConversations() {
    try {
      if (fs.existsSync(CONVERSATIONS_FILE)) {
        const raw = fs.readFileSync(CONVERSATIONS_FILE, 'utf-8');
        const data: Conversation[] = JSON.parse(raw);
        if (Array.isArray(data)) {
          data.forEach(c => this.conversations.set(c.phone, c));
        }
      }
    } catch (err) {
      console.error('Failed to load whatsapp conversations:', err);
    }
  }

  private saveConversations() {
    try {
      const array = Array.from(this.conversations.values());
      fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify(array, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save whatsapp conversations:', err);
    }
  }

  public getStatus(): WhatsAppStatus {
    return {
      status: this.currentStatus,
      qrCodeDataUrl: this.currentQrCodeDataUrl,
      pairingCode: this.currentPairingCode,
      userPhone: this.userPhone,
      userName: this.userName,
      error: this.connectionError,
      stats: {
        totalSent: this.stats.totalSent,
        totalFailed: this.stats.totalFailed,
        activeConversations: this.conversations.size
      }
    };
  }

  public getConversations(): Conversation[] {
    return Array.from(this.conversations.values()).sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return timeB - timeA;
    });
  }

  public async requestPairingCode(phoneNumber: string): Promise<{ success: boolean; pairingCode?: string; error?: string }> {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      return { success: false, error: 'Please enter a valid phone number with country code (e.g. 14155552671).' };
    }

    try {
      if (this.currentStatus === 'CONNECTED' && this.userPhone) {
        return { success: false, error: 'WhatsApp account is already connected.' };
      }

      console.log(`[Baileys] Starting fresh pairing session for +${cleanPhone}...`);
      
      // Clean previous socket and force fresh auth state to prevent stale QR keys from blocking pairing code
      await this.connect(true);

      // Wait briefly for socket initialization and WS open
      let attempts = 0;
      while ((!this.sock || !this.sock.requestPairingCode) && attempts < 25) {
        await new Promise(r => setTimeout(r, 200));
        attempts++;
      }

      if (!this.sock || typeof this.sock.requestPairingCode !== 'function') {
        return { success: false, error: 'WhatsApp engine socket was unable to initialize. Please try again.' };
      }

      // Pause to allow WebSocket connection to establish
      await new Promise(r => setTimeout(r, 1000));

      console.log(`[Baileys] Requesting 8-digit pairing code for phone number +${cleanPhone}...`);
      let rawCode: string | null = null;
      let lastErr: any = null;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          rawCode = await this.sock.requestPairingCode(cleanPhone);
          if (rawCode) break;
        } catch (err: any) {
          lastErr = err;
          console.warn(`[Baileys] Pairing code attempt ${attempt + 1} error:`, err?.message || err);
          await new Promise(r => setTimeout(r, 1200));
        }
      }

      if (!rawCode) {
        const errMsg = lastErr?.message || 'WhatsApp did not return a pairing code. Ensure phone number includes country code without + or spaces.';
        return { success: false, error: errMsg };
      }

      // Format 8-character pairing code nicely e.g., ABCD-1234
      const formattedCode = rawCode.length === 8 ? `${rawCode.slice(0, 4)}-${rawCode.slice(4)}` : rawCode;
      this.currentPairingCode = formattedCode;
      this.currentStatus = 'QR_READY';

      return { success: true, pairingCode: formattedCode };
    } catch (err: any) {
      console.error('[Baileys] Error requesting pairing code:', err);
      return { success: false, error: err.message || 'Failed to generate WhatsApp pairing code. Ensure phone number includes country code.' };
    }
  }

  public async connect(forceFresh: boolean = false): Promise<void> {
    if (this.sock && this.currentStatus === 'CONNECTED') {
      return;
    }
    if (this.isConnecting && !forceFresh) return;

    this.isConnecting = true;
    this.currentStatus = 'INITIALIZING';
    this.connectionError = null;

    try {
      if (forceFresh) {
        console.log('[Baileys] Force fresh requested. Cleaning active socket & auth credentials...');
        if (this.sock) {
          try {
            if (this.sock.ws) this.sock.ws.close();
          } catch (e) {}
          this.sock = null;
        }
        try {
          fs.rmSync(AUTH_DIR, { recursive: true, force: true });
        } catch (e) {}
      }

      if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
      }

      const logger = pino({ level: 'silent' });
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
      const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1015901307] }));

      // Setting standard browser tuple is MANDATORY for Baileys pairing code & QR reliability
      const browserTuple = Browsers ? Browsers.ubuntu('Chrome') : ['Ubuntu', 'Chrome', '20.0.04'];

      this.sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        browser: browserTuple,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        generateHighQualityLinkPreview: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 30000,
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            const dataUrl = await QRCode.toDataURL(qr, { margin: 2, scale: 6 });
            this.currentQrCodeDataUrl = dataUrl;
            this.currentStatus = 'QR_READY';
            console.log('[Baileys] WhatsApp QR Code generated and ready for scan.');
          } catch (err) {
            console.error('[Baileys] Failed to encode QR code:', err);
          }
        }

        if (connection === 'close') {
          this.isConnecting = false;
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const isLoggedOut = statusCode === DisconnectReason?.loggedOut || statusCode === 401 || statusCode === 403;
          const isRestartRequired = statusCode === DisconnectReason?.restartRequired || statusCode === 515;

          console.log(`[Baileys] Connection closed. StatusCode: ${statusCode}, isLoggedOut: ${isLoggedOut}, isRestartRequired: ${isRestartRequired}`);

          this.currentStatus = 'DISCONNECTED';
          this.currentQrCodeDataUrl = null;
          this.sock = null;

          if (isRestartRequired) {
            console.log('[Baileys] Restart required by WhatsApp. Reconnecting immediately...');
            setTimeout(() => {
              if (this.currentStatus === 'DISCONNECTED') {
                this.connect(false);
              }
            }, 1000);
          } else if (isLoggedOut) {
            this.userPhone = null;
            this.userName = null;
            this.connectionError = 'Logged out from mobile phone. Please connect again to generate a new QR Code.';
            try {
              fs.rmSync(AUTH_DIR, { recursive: true, force: true });
            } catch (e) {
              console.error('[Baileys] Error clearing auth folder:', e);
            }
          } else {
            // Unregistered transient disconnect (e.g. expired QR code or 408 timeout)
            if (!state.creds?.registered) {
              console.log('[Baileys] Unregistered connection closed/timed out. Cleaning stale auth state so next scan works instantly.');
              try {
                fs.rmSync(AUTH_DIR, { recursive: true, force: true });
              } catch (e) {}
            } else {
              // Registered auto-reconnect
              setTimeout(() => {
                if (this.currentStatus === 'DISCONNECTED') {
                  this.connect(false);
                }
              }, 3000);
            }
          }
        } else if (connection === 'open') {
          this.isConnecting = false;
          this.currentStatus = 'CONNECTED';
          this.currentQrCodeDataUrl = null;
          this.currentPairingCode = null;
          this.connectionError = null;

          if (this.sock?.user) {
            const rawId = this.sock.user.id || '';
            this.userPhone = rawId.split(':')[0].replace(/\D/g, '');
            this.userName = this.sock.user.name || this.sock.user.notify || 'WhatsApp User';
          }
          console.log(`[Baileys] WhatsApp connected successfully as +${this.userPhone}`);
        }
      });

      // Handle real-time incoming and outgoing messages
      this.sock.ev.on('messages.upsert', async (m: any) => {
        if (m.type !== 'notify') return;

        for (const msg of m.messages) {
          if (!msg.message || msg.key.remoteJid === 'status@broadcast') continue;

          const remoteJid = msg.key.remoteJid || '';
          if (!remoteJid.endsWith('@s.whatsapp.net')) continue;

          const cleanPhone = remoteJid.split('@')[0].replace(/\D/g, '');
          const isFromMe = Boolean(msg.key.fromMe);

          // Text content extraction
          const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            msg.message.imageMessage?.caption ||
            msg.message.videoMessage?.caption ||
            '[Media Message]';

          this.recordMessage({
            id: msg.key.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            phone: cleanPhone,
            direction: isFromMe ? 'outbound' : 'inbound',
            message: text,
            status: 'delivered',
            timestamp: new Date((msg.messageTimestamp as number || Date.now() / 1000) * 1000).toISOString()
          });
        }
      });
    } catch (err: any) {
      this.isConnecting = false;
      this.currentStatus = 'DISCONNECTED';
      this.connectionError = err.message || 'Failed to initialize Baileys connection.';
      console.error('[Baileys] Initialization error:', err);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.sock) {
        await this.sock.logout().catch(() => {});
        this.sock.end(new Error('User disconnected session'));
        this.sock = null;
      }
    } catch (err) {
      console.error('[Baileys] Disconnect error:', err);
    } finally {
      this.currentStatus = 'DISCONNECTED';
      this.currentQrCodeDataUrl = null;
      this.currentPairingCode = null;
      this.userPhone = null;
      this.userName = null;
      try {
        fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      } catch (e) {}
    }
  }

  public recordMessage(msg: WhatsAppMessage, leadInfo?: { leadId?: string; leadName?: string; businessName?: string }) {
    const existingConv = this.conversations.get(msg.phone) || {
      phone: msg.phone,
      leadId: leadInfo?.leadId,
      leadName: leadInfo?.leadName,
      businessName: leadInfo?.businessName,
      messages: []
    };

    if (leadInfo?.leadId) existingConv.leadId = leadInfo.leadId;
    if (leadInfo?.leadName) existingConv.leadName = leadInfo.leadName;
    if (leadInfo?.businessName) existingConv.businessName = leadInfo.businessName;

    // Check if message already exists
    const msgExists = existingConv.messages.some(m => m.id === msg.id);
    if (!msgExists) {
      existingConv.messages.push(msg);
    }

    existingConv.lastMessage = msg.message;
    existingConv.lastMessageAt = msg.timestamp;

    this.conversations.set(msg.phone, existingConv);
    this.saveConversations();
  }

  public async sendMessage(params: {
    phone: string;
    message: string;
    imageUrl?: string;
    leadId?: string;
    leadName?: string;
    businessName?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.sock || this.currentStatus !== 'CONNECTED') {
      return { success: false, error: 'WhatsApp is not connected. Please scan QR Code first.' };
    }

    const cleanPhone = params.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      return { success: false, error: 'Invalid phone number format.' };
    }

    const jid = `${cleanPhone}@s.whatsapp.net`;

    try {
      let sentMsg: any = null;

      if (params.imageUrl && typeof params.imageUrl === 'string' && params.imageUrl.trim()) {
        try {
          const imgUrl = params.imageUrl.trim();
          if (imgUrl.startsWith('data:image/')) {
            const base64Data = imgUrl.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            sentMsg = await this.sock.sendMessage(jid, { image: buffer, caption: params.message });
          } else if (imgUrl.startsWith('http')) {
            sentMsg = await this.sock.sendMessage(jid, { image: { url: imgUrl }, caption: params.message });
          } else {
            sentMsg = await this.sock.sendMessage(jid, { text: params.message });
          }
        } catch (imgErr) {
          console.warn(`[Baileys] Media send failed for ${cleanPhone}, falling back to text:`, imgErr);
          sentMsg = await this.sock.sendMessage(jid, { text: params.message });
        }
      } else {
        sentMsg = await this.sock.sendMessage(jid, { text: params.message });
      }

      const msgId = sentMsg?.key.id || `sent_${Date.now()}`;

      this.stats.totalSent++;

      this.recordMessage(
        {
          id: msgId,
          phone: cleanPhone,
          leadId: params.leadId,
          leadName: params.leadName,
          direction: 'outbound',
          message: params.imageUrl ? `[Image Attached] ${params.message}` : params.message,
          status: 'sent',
          timestamp: new Date().toISOString()
        },
        {
          leadId: params.leadId,
          leadName: params.leadName,
          businessName: params.businessName
        }
      );

      return { success: true, messageId: msgId };
    } catch (err: any) {
      this.stats.totalFailed++;
      console.error(`[Baileys] Error sending message to ${cleanPhone}:`, err);

      this.recordMessage(
        {
          id: `fail_${Date.now()}`,
          phone: cleanPhone,
          leadId: params.leadId,
          leadName: params.leadName,
          direction: 'outbound',
          message: params.message,
          status: 'failed',
          timestamp: new Date().toISOString(),
          error: err.message
        },
        {
          leadId: params.leadId,
          leadName: params.leadName,
          businessName: params.businessName
        }
      );

      return { success: false, error: err.message || 'Failed to deliver message via Baileys WhatsApp.' };
    }
  }

  public async checkWhatsAppNumber(phone: string): Promise<{
    phone: string;
    cleanPhone: string;
    exists: boolean;
    jid?: string;
    status: 'whatsapp' | 'non_whatsapp' | 'not_connected' | 'invalid';
    error?: string;
  }> {
    const rawClean = phone ? phone.replace(/\D/g, '') : '';
    const cleanPhone = normalizePhoneNumber(phone || '');

    if (!cleanPhone || cleanPhone.length < 8 || cleanPhone.length > 15) {
      return {
        phone,
        cleanPhone: cleanPhone || rawClean,
        exists: false,
        status: 'invalid',
        error: 'Invalid phone number format (must be 8-15 digits with country code).'
      };
    }

    if (!this.sock || this.currentStatus !== 'CONNECTED') {
      // Heuristic fallback when WhatsApp isn't connected
      const isMobileStructure = cleanPhone.length >= 8 && cleanPhone.length <= 15;
      return {
        phone,
        cleanPhone,
        exists: isMobileStructure,
        status: 'not_connected',
        error: 'WhatsApp session not connected. Connect your WhatsApp QR in Outreach tab to perform live server verification.'
      };
    }

    try {
      let result: any[] = [];
      if (typeof this.sock.onWhatsApp === 'function') {
        result = await this.sock.onWhatsApp(cleanPhone);
        if ((!Array.isArray(result) || result.length === 0 || !result[0]?.exists) && rawClean !== cleanPhone) {
          // Fallback check with rawClean if different
          const rawResult = await this.sock.onWhatsApp(rawClean).catch(() => []);
          if (Array.isArray(rawResult) && rawResult.length > 0 && rawResult[0]?.exists) {
            result = rawResult;
          }
        }
      }

      if (Array.isArray(result) && result.length > 0 && result[0]?.exists) {
        return {
          phone,
          cleanPhone,
          exists: true,
          jid: result[0].jid || `${cleanPhone}@s.whatsapp.net`,
          status: 'whatsapp'
        };
      } else {
        return {
          phone,
          cleanPhone,
          exists: false,
          status: 'non_whatsapp'
        };
      }
    } catch (err: any) {
      console.warn(`[Baileys] checkWhatsAppNumber failed for ${cleanPhone}:`, err?.message || err);
      return {
        phone,
        cleanPhone,
        exists: false,
        status: 'non_whatsapp',
        error: err?.message || 'Verification lookup failed'
      };
    }
  }

  public async checkWhatsAppNumbersBatch(phones: string[]): Promise<Array<{
    phone: string;
    cleanPhone: string;
    exists: boolean;
    jid?: string;
    status: 'whatsapp' | 'non_whatsapp' | 'not_connected' | 'invalid';
  }>> {
    const results: Array<{
      phone: string;
      cleanPhone: string;
      exists: boolean;
      jid?: string;
      status: 'whatsapp' | 'non_whatsapp' | 'not_connected' | 'invalid';
    }> = [];

    for (const p of phones) {
      const res = await this.checkWhatsAppNumber(p);
      results.push(res);
      // Brief delay to prevent rate limits
      await new Promise(r => setTimeout(r, 150));
    }

    return results;
  }
}

export const whatsappBaileysManager = new WhatsAppBaileysManager();
