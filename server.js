const crypto = require('node:crypto');
const { promisify } = require('node:util');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const { DatabaseSync } = require('node:sqlite');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const { registerPortalRoutes, sendMail, normalizeMailPassword } = require('./lib/portal');

// SERVER AND SQLITE: initialize storage and shared application services.
const scrypt = promisify(crypto.scrypt);
const app = express();
const port = Number(process.env.PORT) || 3000;
const dataDirectory = path.join(__dirname, 'data');
fs.mkdirSync(dataDirectory, { recursive: true });

const db = new DatabaseSync(path.join(dataDirectory, 'kokhost.sqlite'));
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
  CREATE TABLE IF NOT EXISTS pending_registrations (
    email TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS pending_registrations_expiry_idx ON pending_registrations(expires_at);
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    monthly_price INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Talep alındı',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    public_id TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Normal',
    status TEXT NOT NULL DEFAULT 'new',
    tracking_token TEXT UNIQUE,
    company_email_opened_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS tickets_user_idx ON tickets(user_id, id DESC);
  CREATE TABLE IF NOT EXISTS ticket_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_type TEXT NOT NULL CHECK (author_type IN ('customer', 'staff', 'system')),
    body TEXT NOT NULL,
    tracking_token TEXT UNIQUE,
    email_opened_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    method TEXT NOT NULL,
    amount_kurus INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    provider_ref TEXT UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const plans = [
  { id: 'baslangic', name: 'Başlangıç', price: 49, storage: '10 GB NVMe', sites: '1 web sitesi', traffic: 'Limitsiz trafik', badge: '' },
  { id: 'performans', name: 'Performans', price: 119, storage: '30 GB NVMe', sites: '10 web sitesi', traffic: 'Limitsiz trafik', badge: 'En çok tercih edilen' },
  { id: 'sinirsiz', name: 'Sınırsız', price: 249, storage: '100 GB NVMe', sites: 'Limitsiz site', traffic: 'Limitsiz trafik', badge: '' }
];
const sessionCookie = 'kokhost_session';
const sessionLifetime = 14 * 24 * 60 * 60 * 1000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression({ threshold: 1024, level: 5 }));
if (process.env.TRUST_PROXY) app.set('trust proxy', process.env.TRUST_PROXY);
const liveServerOrigins = new Set([
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://[::1]:5500'
]);
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (!liveServerOrigins.has(origin)) return next();
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.vary('Origin');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  const token = req.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookie}=`))
    ?.slice(sessionCookie.length + 1);

  if (token) {
    const tokenHash = crypto.createHash('sha256').update(decodeURIComponent(token)).digest('hex');
    const session = db.prepare(`
      SELECT users.id, users.email, sessions.expires_at
      FROM sessions JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ?
    `).get(tokenHash);

    if (session && session.expires_at > Date.now()) {
      req.user = { id: session.id, email: session.email };
    } else {
      db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
      res.clearCookie(sessionCookie, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
    }
  }
  next();
});

function setSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + sessionLifetime;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(tokenHash, userId, expiresAt);
  res.cookie(sessionCookie, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: sessionLifetime,
    path: '/'
  });
}

function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Devam etmek için giriş yapın.' });
  next();
}

function validEmail(email) {
  return typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// PUBLIC CATALOG AND AUTHENTICATION: storefront data, registration, and sessions.
app.get('/api/plans', (req, res) => res.json(plans));
app.get('/api/auth/me', (req, res) => res.json({ user: req.user || null }));

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;
    if (!validEmail(email)) return res.status(400).json({ error: 'Geçerli bir e-posta adresi girin.' });
    if (typeof password !== 'string' || password.length < 10 || password.length > 128) {
      return res.status(400).json({ error: 'Şifreniz 10 ile 128 karakter arasında olmalı.' });
    }
    if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) return res.status(409).json({ error: 'Bu e-posta adresiyle zaten bir hesap var.' });
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.MAIL_FROM) {
      return res.status(503).json({ error: 'Hesap doğrulaması için SMTP e-posta ayarları tamamlanmalı.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await scrypt(password, salt, 64);
    const passwordHash = `${salt}:${hash.toString('hex')}`;
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    db.prepare('DELETE FROM pending_registrations WHERE expires_at <= ? OR email = ?').run(Date.now(), email);
    db.prepare(`INSERT INTO pending_registrations (email, password_hash, token_hash, expires_at)
      VALUES (?, ?, ?, ?)`)
      .run(email, passwordHash, tokenHash, Date.now() + 24 * 60 * 60 * 1000);

    const verificationUrl = `${(process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')}/verify.html?token=${token}`;
    const verificationText = [
      'KökHost hesabınızı etkinleştirmek için e-posta adresinizi doğrulayın.',
      'Bu doğrulama isteği bu e-posta adresiyle başlatıldı. Bağlantı 24 saat geçerlidir:',
      verificationUrl,
      'Bu isteği siz başlatmadıysanız bu iletiyi yok sayabilirsiniz.'
    ].join('\n\n');
    const sent = await sendMail(
      email,
      'KökHost hesabınızı etkinleştirin',
      `<h2>KökHost hesabınızı etkinleştirin</h2><p>Bu e-posta adresiyle bir KökHost hesap kaydı başlatıldı. Hesabı etkinleştirmek için bağlantıyı açıp doğrulama düğmesine basın. Bağlantı 24 saat geçerlidir.</p><p><a href="${verificationUrl}">E-posta adresimi doğrula</a></p><p>Bu isteği siz başlatmadıysanız bu iletiyi yok sayabilirsiniz; hesabınız oluşturulmaz.</p>`,
      verificationText
    );
    if (!sent) {
      db.prepare('DELETE FROM pending_registrations WHERE email = ?').run(email);
      return res.status(502).json({ error: 'Doğrulama e-postası gönderilemedi; hesap oluşturulmadı. SMTP ayarlarını kontrol edin.' });
    }
    res.status(202).json({ verificationRequired: true, email });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/verify', (req, res, next) => {
  try {
    const token = typeof req.body.token === 'string' ? req.body.token : '';
    if (!/^[a-f0-9]{64}$/i.test(token)) return res.status(400).json({ error: 'Doğrulama bağlantısı geçersiz.' });
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const pending = db.prepare(`SELECT email, password_hash, expires_at FROM pending_registrations WHERE token_hash = ?`).get(tokenHash);
    if (!pending) return res.status(400).json({ error: 'Doğrulama bağlantısı geçersiz veya daha önce kullanılmış.' });
    if (pending.expires_at <= Date.now()) {
      db.prepare('DELETE FROM pending_registrations WHERE token_hash = ?').run(tokenHash);
      return res.status(410).json({ error: 'Doğrulama bağlantısının süresi dolmuş. Lütfen yeniden kayıt olun.' });
    }
    let result;
    try {
      result = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(pending.email, pending.password_hash);
    } catch (error) {
      if (error.code === 'ERR_SQLITE_CONSTRAINT_UNIQUE') {
        db.prepare('DELETE FROM pending_registrations WHERE token_hash = ?').run(tokenHash);
        return res.status(409).json({ error: 'Bu e-posta adresiyle zaten bir hesap var.' });
      }
      throw error;
    }
    db.prepare('DELETE FROM pending_registrations WHERE token_hash = ?').run(tokenHash);
    setSession(res, Number(result.lastInsertRowid));
    res.json({ user: { email: pending.email } });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;
    const user = db.prepare('SELECT id, email, password_hash FROM users WHERE email = ?').get(email);
    let isValid = false;
    if (user && typeof password === 'string') {
      const [salt, storedHash] = user.password_hash.split(':');
      const submittedHash = await scrypt(password, salt, 64);
      const expectedHash = Buffer.from(storedHash, 'hex');
      isValid = submittedHash.length === expectedHash.length && crypto.timingSafeEqual(submittedHash, expectedHash);
    }
    if (!isValid) return res.status(401).json({ error: 'E-posta veya şifre hatalı.' });
    setSession(res, user.id);
    res.json({ user: { email: user.email } });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookie}=`))
    ?.slice(sessionCookie.length + 1);
  if (token) {
    const tokenHash = crypto.createHash('sha256').update(decodeURIComponent(token)).digest('hex');
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
  }
  res.clearCookie(sessionCookie, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  res.json({ ok: true });
});

app.get('/api/orders', requireUser, (req, res) => {
  const orders = db.prepare(`
    SELECT id, plan_name AS planName, monthly_price AS monthlyPrice, status, created_at AS createdAt
    FROM orders WHERE user_id = ? ORDER BY id DESC
  `).all(req.user.id);
  res.json({ orders });
});

app.post('/api/orders', requireUser, (req, res) => {
  const plan = plans.find((item) => item.id === req.body.planId);
  if (!plan) return res.status(400).json({ error: 'Geçerli bir hosting paketi seçin.' });
  const result = db.prepare(`
    INSERT INTO orders (user_id, plan_id, plan_name, monthly_price)
    VALUES (?, ?, ?, ?)
  `).run(req.user.id, plan.id, plan.name, plan.price);
  res.status(201).json({ order: { id: Number(result.lastInsertRowid), planName: plan.name, status: 'Talep alındı' } });
});

// CHANNEL API AND STATIC PAGES: authenticated workflows and HTML/CSS/JS delivery.
registerPortalRoutes(app, { db, requireUser });

let approvalInboxBusy = false;
let approvalInboxFailures = 0;
let approvalInboxRetryAfter = 0;

async function checkApprovalInbox() {
  const { IMAP_HOST, IMAP_USER, IMAP_PASS } = process.env;
  if (!IMAP_HOST || !IMAP_USER || !IMAP_PASS || approvalInboxBusy || Date.now() < approvalInboxRetryAfter) return;
  const pendingOrderIds = db.prepare(`SELECT DISTINCT order_id AS orderId FROM payments
    WHERE method = 'iban' AND status = 'review'`).all().map((payment) => payment.orderId);
  if (!pendingOrderIds.length) return;
  approvalInboxBusy = true;
  const client = new ImapFlow({
    host: IMAP_HOST,
    port: Number(process.env.IMAP_PORT) || 993,
    secure: process.env.IMAP_SECURE !== 'false',
    auth: { user: IMAP_USER, pass: normalizeMailPassword(IMAP_HOST, IMAP_PASS) },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    logger: false
  });
  let connected = false;
  let clientError = null;
  client.on('error', (error) => { clientError = error; });

  try {
    await client.connect();
    connected = true;
    const inboxPath = process.env.IMAP_MAILBOX || 'INBOX';
    const sentPath = (await client.list()).find((mailbox) => mailbox.specialUse === '\\Sent')?.path;
    const mailboxPaths = [...new Set([inboxPath, sentPath].filter(Boolean))];
    for (const mailboxPath of mailboxPaths) {
      const lock = await client.getMailboxLock(mailboxPath);
      try {
        const matchingUids = [];
        for (const orderId of pendingOrderIds) {
          matchingUids.push(...await client.search({ subject: `KH-APPROVAL:${orderId}` }, { uid: true }));
        }
        const approvalMessages = [...new Set(matchingUids)];
        if (approvalMessages.length) {
          for await (const message of client.fetch(approvalMessages, { uid: true, source: true }, { uid: true })) {
          try {
            if (!message.source) continue;
            const email = await simpleParser(message.source);
            const sender = email.from?.value?.[0]?.address?.trim().toLowerCase();
            const allowedSenders = [process.env.ADMIN_EMAIL, process.env.SUPPORT_EMAIL]
              .filter(Boolean).map((address) => address.trim().toLowerCase());
            const orderId = Number(email.subject?.match(/\[KH-APPROVAL:(\d+)\]/i)?.[1]);
            const approved = /(^|\n)\s*ONAYLANDI\s*($|\n)/i.test(email.text || '');

            if (sender && allowedSenders.includes(sender) && orderId && approved) {
              const payment = db.prepare(`SELECT payments.id, payments.user_id AS userId, orders.plan_name AS planName,
                users.email FROM payments JOIN orders ON orders.id = payments.order_id
                JOIN users ON users.id = payments.user_id
                WHERE payments.order_id = ? AND payments.method = 'iban' AND payments.status = 'review'
                ORDER BY payments.id DESC LIMIT 1`).get(orderId);
              if (payment) {
                db.prepare(`UPDATE payments SET status = 'paid', updated_at = datetime('now') WHERE id = ?`).run(payment.id);
                db.prepare(`UPDATE orders SET status = 'Aktif' WHERE id = ?`).run(orderId);
                const ticket = db.prepare(`SELECT id FROM tickets WHERE user_id = ? AND subject = ?`)
                  .get(payment.userId, `Ödeme Onayı #${orderId}`);
                if (ticket) {
                  const trackingToken = crypto.randomBytes(24).toString('hex');
                  db.prepare(`INSERT INTO ticket_messages (ticket_id, author_type, body, tracking_token)
                    VALUES (?, 'staff', ?, ?)`).run(ticket.id, `ONAYLANDI (e-posta yanıtı: ${sender})`, trackingToken);
                  db.prepare(`UPDATE tickets SET status = 'answered', tracking_token = ?, updated_at = datetime('now') WHERE id = ?`)
                    .run(trackingToken, ticket.id);
                }
                await sendMail(payment.email, `[${orderId}] Ödemeniz onaylandı`,
                  `<h2>Ödemeniz onaylandı</h2><p>Sipariş #${orderId} · ${payment.planName} için ödemeniz doğrulandı ve hizmetiniz açıldı.</p><p>Hizmet bilgilerinizi müşteri panelindeki <a href="${(process.env.PUBLIC_URL || 'http://localhost:3000').replace(/\/$/, '')}/services.html">Hizmetler</a> bölümünde görebilirsiniz.</p>`);
              }
            }
          } catch (error) {
            console.error('Approval email could not be processed:', error.message);
          }
          }
        }
      } finally {
        lock.release();
      }
    }
    approvalInboxFailures = 0;
    approvalInboxRetryAfter = 0;
  } catch (error) {
    approvalInboxFailures = Math.min(approvalInboxFailures + 1, 5);
    const retryDelay = Math.min(60000, 5000 * (2 ** (approvalInboxFailures - 1)));
    approvalInboxRetryAfter = Date.now() + retryDelay;
    console.error(`Approval inbox check failed; retrying in ${Math.ceil(retryDelay / 1000)}s: ${(clientError || error).message}`);
  } finally {
    if (connected) {
      try { await client.logout(); } catch {}
    }
    approvalInboxBusy = false;
  }
}

app.use(express.static(path.join(__dirname, 'public')));
app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).json({ error: 'Beklenmeyen bir hata oluştu.' });
});

setInterval(() => {
  const now = Date.now();
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now);
  db.prepare('DELETE FROM pending_registrations WHERE expires_at <= ?').run(now);
}, 60 * 60 * 1000).unref();
app.listen(port, () => {
  console.log(`KökHost hazır: http://localhost:${port}`);
  if (process.env.NODE_ENV === 'production' && /localhost|127\.0\.0\.1|\[::1\]/i.test(process.env.PUBLIC_URL || '')) {
    console.warn('E-posta teslimat uyarısı: PUBLIC_URL yerel adres. Gmail kayıt doğrulama e-postaları için herkese açık HTTPS domaini ayarlayın.');
  }
  if (process.env.IMAP_HOST && process.env.IMAP_USER && process.env.IMAP_PASS) {
    const interval = Number(process.env.IMAP_POLL_INTERVAL_MS) || 5000;
    checkApprovalInbox();
    setInterval(checkApprovalInbox, interval).unref();
  }
});