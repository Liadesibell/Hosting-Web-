const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const { domainToASCII } = require('node:url');

// SERVICE CATALOG: sellable monthly hosting, mail, and virtual-server packages.
const products = [
  { id: 'baslangic', name: 'Başlangıç', category: 'web', price: 49, originalPrice: null, badge: '', image: '/images/server-room.jpg', imageAlt: 'KökHost sunucu odası', description: 'Yeni web siteleri ve kişisel projeler için.', features: ['10 GB NVMe depolama', '1 web sitesi', 'Limitsiz trafik', 'Ücretsiz SSL', 'Günlük yedekleme'] },
  { id: 'performans', name: 'Performans', category: 'web', price: 119, originalPrice: 159, badge: 'Kampanya', image: '/images/server-detail.jpg', imageAlt: 'Yüksek performanslı sunucu donanımı', description: 'Büyüyen işletmeler için daha fazla alan ve hız.', features: ['30 GB NVMe depolama', '10 web sitesi', 'Limitsiz trafik', 'Ücretsiz SSL', 'Günlük yedekleme', 'Öncelikli destek'] },
  { id: 'sinirsiz', name: 'Sınırsız', category: 'web', price: 249, originalPrice: null, badge: 'Popüler', image: '/images/server-room.jpg', imageAlt: 'Yedekli sunucu altyapısı', description: 'Birden fazla web projesini tek yerde yönetin.', features: ['100 GB NVMe depolama', 'Limitsiz web sitesi', 'Limitsiz trafik', 'Ücretsiz SSL', 'Günlük yedekleme', 'Öncelikli destek'] },
  { id: 'eposta-baslangic', name: 'E-posta Başlangıç', category: 'email', price: 29, originalPrice: null, badge: 'E-posta', image: '/images/server-detail.jpg', imageAlt: 'Kurumsal e-posta sunucusu donanımı', description: 'Kendi alan adınızla profesyonel e-posta kullanın.', features: ['5 e-posta hesabı', 'Hesap başına 5 GB', 'IMAP, POP3 ve SMTP', 'Anti-spam koruması', 'Webmail erişimi'] },
  { id: 'eposta-pro', name: 'E-posta Pro', category: 'email', price: 79, originalPrice: null, badge: 'E-posta', image: '/images/server-room.jpg', imageAlt: 'Kurumsal e-posta altyapısı', description: 'Ekibiniz için daha geniş kurumsal e-posta alanı.', features: ['15 e-posta hesabı', 'Hesap başına 10 GB', 'IMAP, POP3 ve SMTP', 'Anti-spam ve antivirüs', 'Paylaşılan adres defteri'] },
  { id: 'eposta-kurumsal', name: 'E-posta Kurumsal', category: 'email', price: 149, originalPrice: null, badge: 'Kurumsal', image: '/images/server-detail.jpg', imageAlt: 'İşletmeler için e-posta sunucuları', description: 'Yoğun iletişim kullanan işletmeler için e-posta paketi.', features: ['50 e-posta hesabı', 'Hesap başına 25 GB', 'IMAP, POP3 ve SMTP', 'Gelişmiş anti-spam koruması', 'Öncelikli destek'] },
  { id: 'wp-pro', name: 'WordPress Pro', category: 'wordpress', price: 179, originalPrice: 229, badge: 'Kampanya', image: '/images/server-detail.jpg', imageAlt: 'WordPress için optimize edilmiş sunucu donanımı', description: 'WordPress siteleri için optimize edilmiş altyapı.', features: ['40 GB NVMe depolama', '5 WordPress sitesi', 'WordPress önbelleği', 'Ücretsiz SSL', 'Otomatik güncelleme', 'Günlük yedekleme'] },
  { id: 'eticaret', name: 'E-Ticaret Plus', category: 'business', price: 349, originalPrice: null, badge: 'İşletme', image: '/images/server-room.jpg', imageAlt: 'E-ticaret siteleri için sunucu altyapısı', description: 'Yoğun ziyaret alan mağazalar için kaynaklar.', features: ['80 GB NVMe depolama', 'Limitsiz site', 'Gelişmiş önbellek', 'Ücretsiz SSL', 'Günlük yedekleme', 'Öncelikli destek'] },
  { id: 'vps-1', name: 'VDS Başlangıç', category: 'vps', price: 599, originalPrice: null, badge: 'VDS', image: '/images/server-detail.jpg', imageAlt: 'VDS sunucu donanımı', description: 'Kendi sunucu kaynaklarına ihtiyaç duyduğunuzda.', features: ['2 vCPU çekirdek', '4 GB RAM', '60 GB NVMe', '1 Gbps port', 'Root erişimi', '7/24 altyapı izleme'] },
  { id: 'vps-2', name: 'VDS Performans', category: 'vps', price: 1099, originalPrice: 1399, badge: 'Kampanya', image: '/images/server-room.jpg', imageAlt: 'Yüksek kapasiteli sanal sunucu altyapısı', description: 'Daha yüksek trafik ve uygulamalar için sanal sunucu.', features: ['4 vCPU çekirdek', '8 GB RAM', '120 GB NVMe', '1 Gbps port', 'Root erişimi', 'Öncelikli destek'] },
  { id: 'vps-kurumsal', name: 'VDS Kurumsal', category: 'vps', price: 2299, originalPrice: null, badge: 'Kurumsal', image: '/images/server-detail.jpg', imageAlt: 'Kurumsal sanal sunucu donanımı', description: 'Kaynak ihtiyacı yüksek iş uygulamaları ve servisler için.', features: ['8 vCPU çekirdek', '16 GB RAM', '240 GB NVMe', '1 Gbps port', 'Root erişimi', 'Öncelikli destek'] },
  { id: 'app-server', name: 'Uygulama Sunucusu', category: 'server', price: 899, originalPrice: null, badge: 'Sunucu', image: '/images/server-room.jpg', imageAlt: 'Uygulama servisleri için sunucu altyapısı', description: 'API, test ortamı ve özel uygulamalar için sanal sunucu.', features: ['4 vCPU çekirdek', '8 GB RAM', '120 GB NVMe', 'Linux kurulumu', 'Root erişimi', 'Yedekleme seçeneği'] },
  { id: 'game-server', name: 'Oyun Sunucusu', category: 'server', price: 499, originalPrice: null, badge: 'Sunucu', image: '/images/server-detail.jpg', imageAlt: 'Oyun sunucusu için performans donanımı', description: 'Arkadaş toplulukları ve küçük oyun sunucuları için.', features: ['2 vCPU çekirdek', '4 GB RAM', '80 GB NVMe', 'Özel port yapılandırması', 'Root erişimi', 'Sunucu yönetim erişimi'] }
];

// TIERED CATALOG: each hosting and server family has 50 named capacity choices.
const packageTierNames = ['Mikro', 'Başlangıç', 'Mini', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', 'Ultra', 'Kurumsal'];

function createTierPackages(category) {
  const existingCount = products.filter((product) => product.category === category).length;
  return Array.from({ length: 50 - existingCount }, (_, index) => {
    const tier = existingCount + index;
    const name = `${packageTierNames[Math.floor(tier / 5)]} ${tier % 5 + 1}`;
    let price;
    let features;
    let description;

    if (category === 'web') {
      const storage = 10 + (tier + 1) * 8;
      const sites = Math.min(1 + Math.floor(tier * 1.5), 75);
      price = 39 + storage * 5 + sites * 7;
      features = [`${storage} GB NVMe depolama`, `${sites} web sitesi`, 'SSL yapılandırması', 'Haftalık yedekleme', 'E-posta kutusu seçeneği'];
      description = 'Blog, kurumsal site ve büyüyen web projeleri için ölçeklenebilir hosting.';
    } else if (category === 'vps') {
      const cpu = 1 + tier;
      const ram = 2 + tier * 3;
      const storage = 40 + tier * 30;
      price = 99 + cpu * 80 + ram * 35 + storage;
      features = [`${cpu} vCPU`, `${ram} GB RAM`, `${storage} GB NVMe`, 'Root erişimi', 'İşletim sistemi seçimi'];
      description = 'Geliştirme, API ve iş uygulamaları için özelleştirilebilir VDS/VPS.';
    } else {
      const cpu = 4 + tier * 2;
      const ram = 16 + tier * 8;
      const storage = 250 + tier * 100;
      price = 650 + cpu * 90 + ram * 24 + Math.round(storage * 1.4);
      features = [`${cpu} işlemci çekirdeği`, `${ram} GB RAM`, `${storage} GB NVMe`, 'Özel sunucu kaynakları', 'İşletim sistemi seçimi'];
      description = 'Yüksek kaynak isteyen veritabanı, sanallaştırma ve oyun servisleri için.';
    }

    return {
      id: `${category}-tier-${String(tier + 1).padStart(2, '0')}`,
      name,
      category,
      price,
      originalPrice: null,
      badge: category === 'web' ? 'Web Hosting' : category === 'vps' ? 'VDS / VPS' : 'Özel Sunucu',
      image: tier % 2 ? '/images/server-detail.jpg' : '/images/server-room.jpg',
      imageAlt: `${name} ${category} altyapısı`,
      description,
      features
    };
  });
}

products.push(...createTierPackages('web'), ...createTierPackages('vps'), ...createTierPackages('server'));

function customServerQuote(configuration = {}) {
  const type = ['web', 'vps', 'server'].includes(configuration.type) ? configuration.type : 'vps';
  const integer = (value, minimum, maximum, fallback) => {
    const number = Number(value);
    return Number.isInteger(number) && number >= minimum && number <= maximum ? number : fallback;
  };
  const cpu = integer(configuration.cpu, 1, type === 'server' ? 64 : 32, 2);
  const ram = integer(configuration.ram, 1, type === 'server' ? 512 : 256, 4);
  const storage = integer(configuration.storage, 20, 8000, 80);
  const websites = integer(configuration.websites, 1, 100, 1);
  const mailboxes = integer(configuration.mailboxes, 0, 250, 5);
  const operatingSystem = ['ubuntu', 'debian', 'alma', 'windows'].includes(configuration.operatingSystem) ? configuration.operatingSystem : 'ubuntu';
  const controlPanel = ['none', 'plesk', 'cpanel'].includes(configuration.controlPanel) ? configuration.controlPanel : 'none';
  const backups = [true, 'true', 'on', 1, '1'].includes(configuration.backups);
  const basePrice = type === 'web'
    ? 39 + storage * 5 + websites * 7 + mailboxes * 3
    : type === 'server'
      ? 650 + cpu * 90 + ram * 24 + Math.round(storage * 1.4)
      : 99 + cpu * 80 + ram * 35 + storage;
  const price = Math.round(basePrice + (operatingSystem === 'windows' ? 450 : 0) + (controlPanel === 'plesk' ? 300 : controlPanel === 'cpanel' ? 500 : 0) + (backups ? 120 : 0));
  return { type, cpu, ram, storage, websites, mailboxes, operatingSystem, controlPanel, backups, price };
}

function calculateCartQuote(submittedItems) {
  if (!Array.isArray(submittedItems) || submittedItems.length < 1 || submittedItems.length > 50) {
    throw new Error('Sepetinizde 1 ile 50 arasında ürün olmalı.');
  }
  const items = submittedItems.map((item) => {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error('Ürün adedi 1 ile 10 arasında olmalı.');
    if (item.productId === 'custom-server') {
      const configuration = customServerQuote(item.configuration);
      const typeName = { web: 'Özel Web Hosting', vps: 'Özel VDS / VPS', server: 'Özel Sunucu' }[configuration.type];
      return {
        name: `${typeName} · ${configuration.cpu} CPU · ${configuration.ram} GB RAM · ${configuration.storage} GB disk · ${configuration.operatingSystem}`,
        price: configuration.price,
        quantity,
        configuration
      };
    }
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) throw new Error('Sepette geçersiz bir paket var.');
    return { name: product.name, price: product.price, quantity };
  });
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!Number.isSafeInteger(total) || total <= 0 || total > 100000000) throw new Error('Sepet toplamı geçerli değil.');
  return { items, total };
}

// PROVIDER HELPERS: SMTP, RDAP, payment signing, and shared portal services.
function normalizeMailPassword(host, password) {
  return /(^|\.)gmail\.com$/i.test(host) ? password.replace(/\s/g, '') : password;
}

const mailerOptions = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  ? {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: normalizeMailPassword(process.env.SMTP_HOST, process.env.SMTP_PASS) },
    dnsTimeout: 5000,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  }
  : null;
const mailer = mailerOptions ? nodemailer.createTransport(mailerOptions) : null;

const trackingPixel = Buffer.from('R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', 'base64');
let rdapBootstrapCache = null;
let rdapBootstrapExpiresAt = 0;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const adminEmail = () => process.env.ADMIN_EMAIL?.trim().toLowerCase();
const isAdmin = (req) => Boolean(adminEmail() && req.user?.email === adminEmail());

function orderItemsSummary(items = []) {
  if (!Array.isArray(items) || !items.length) return 'Siparişinizin detayları eklendi.';
  return items.map((item) => `- ${item.name}${Number(item.quantity) > 1 ? ` x${item.quantity}` : ''}`).join('<br>');
}

async function sendMail(to, subject, html, text = '') {
  if (!mailer || !process.env.MAIL_FROM) {
    console.warn('Email is not configured; set SMTP_* and MAIL_FROM in .env.');
    return false;
  }
  const transport = nodemailer.createTransport(mailerOptions);
  let timeout;
  try {
    const sending = transport.sendMail({ from: process.env.MAIL_FROM, to, subject, html, ...(text ? { text } : {}) })
      .then(() => ({ sent: true }), (error) => ({ error }));
    const result = await Promise.race([
      sending,
      new Promise((resolve) => {
        timeout = setTimeout(() => {
          transport.close();
          resolve({ timedOut: true });
        }, 20000);
      })
    ]);
    if (result.timedOut) {
      console.error('Email delivery exceeded 20000 ms.');
      return false;
    }
    if (result.error) throw result.error;
    return result.sent;
  } catch (error) {
    console.error('Email delivery failed:', error.message);
    return false;
  } finally {
    clearTimeout(timeout);
    transport.close();
  }
}

function sendMailInBackground(to, subject, html, description) {
  void sendMail(to, subject, html)
    .then((sent) => { if (!sent) console.warn(`${description} email could not be sent.`); })
    .catch((error) => console.error(`${description} email failed:`, error.message));
}

function publicUrl(req) {
  return (process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
}

function requireAdmin(req, res, next) {
  if (!isAdmin(req)) return res.status(403).json({ error: 'Bu alan yalnızca destek yöneticisine açıktır.' });
  next();
}

async function getRdapBootstrap() {
  if (rdapBootstrapCache && rdapBootstrapExpiresAt > Date.now()) return rdapBootstrapCache;
  const response = await fetch('https://data.iana.org/rdap/dns.json', { signal: AbortSignal.timeout(4500) });
  if (!response.ok) throw new Error('IANA RDAP uzantı listesi alınamadı.');
  const data = await response.json();
  const services = new Map();
  for (const [suffixes, urls] of data.services || []) {
    if (!Array.isArray(urls) || !urls[0]) continue;
    for (const suffix of suffixes || []) services.set(String(suffix).toLowerCase(), urls[0]);
  }
  if (!services.size) throw new Error('IANA RDAP uzantı listesi boş.');
  rdapBootstrapCache = services;
  rdapBootstrapExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  return services;
}

// CUSTOMER CHANNEL APIs: catalog, orders, domain checks, support, and assistant.
function registerPortalRoutes(app, { db, requireUser }) {
  app.get('/api/catalog', requireUser, (req, res) => res.json({ products }));

  app.get('/api/panel/summary', requireUser, (req, res) => {
    const orders = db.prepare(`SELECT id, plan_name AS name, monthly_price AS price, status, created_at AS createdAt
      FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 5`).all(req.user.id);
    const tickets = db.prepare(`SELECT public_id AS publicId, subject, status, created_at AS createdAt
      FROM tickets WHERE user_id = ? ORDER BY id DESC LIMIT 5`).all(req.user.id);
    const counts = db.prepare(`SELECT
      (SELECT COUNT(*) FROM orders WHERE user_id = ?) AS orders,
      (SELECT COUNT(*) FROM tickets WHERE user_id = ?) AS tickets,
      (SELECT COUNT(*) FROM payments WHERE user_id = ? AND status = 'pending') AS pendingPayments`).get(req.user.id, req.user.id, req.user.id);
    res.json({ user: req.user, orders, tickets, counts, admin: isAdmin(req) });
  });

  app.get('/api/payments', requireUser, (req, res) => {
    const payments = db.prepare(`SELECT payments.id, orders.plan_name AS planName, payments.method,
      payments.amount_kurus AS amountKurus, payments.status, payments.created_at AS createdAt
      FROM payments JOIN orders ON orders.id = payments.order_id
      WHERE payments.user_id = ? ORDER BY payments.id DESC`).all(req.user.id);
    res.json({ payments });
  });

  function serviceSnapshot(order, index = 0) {
    const orderId = Number(order.id || 0);
    const planName = String(order.plan_name || order.name || 'Hizmet');
    const catalogProduct = products.find((product) => product.id === order.plan_id)
      || products.find((product) => product.category === 'vps' && planName.toLocaleLowerCase('tr-TR').includes(product.name.toLocaleLowerCase('tr-TR')));
    const isVds = catalogProduct?.category === 'vps' || /\bvds\b|\bvps\b/i.test(planName);
    const productFeatures = catalogProduct?.features || [];
    const featureValue = (pattern) => productFeatures.find((feature) => pattern.test(feature)) || '';
    const planType = isVds ? 'VDS / VPS' : /sunucu|server|cloud/i.test(planName) ? 'Sunucu' : 'Hosting';
    const setting = (name) => process.env[`VDS_${orderId}_${name}`] || order[name.toLowerCase()] || '';
    const uptimeAnchor = Date.parse(setting('UPTIME_ANCHOR'));
    const uptimeSeconds = Number(setting('UPTIME_SECONDS')) + (Number.isFinite(uptimeAnchor) ? Math.max(0, Math.floor((Date.now() - uptimeAnchor) / 1000)) : 0);
    return {
      id: orderId,
      name: planName,
      isVds,
      status: order.status === 'Ödendi' || order.status === 'Aktif' ? 'Aktif' : (order.status || 'Beklemede'),
      paymentStatus: order.payment_status === 'paid' || order.status === 'Ödendi' ? 'Ödendi' : (order.payment_status || 'Beklemede'),
      price: Number(order.monthly_price || order.price || 0),
      location: setting('LOCATION'),
      ip: setting('IP'),
      hostname: setting('HOSTNAME') || `VDS #${orderId}`,
      username: setting('USERNAME'),
      password: setting('PASSWORD'),
      accessCode: setting('ACCESS_CODE'),
      operatingSystem: setting('OS'),
      cpu: setting('CPU') || featureValue(/cpu|işlemci/i),
      cpuSpeed: setting('CPU_SPEED'),
      ram: setting('RAM') || featureValue(/ram/i),
      disk: setting('DISK') || featureValue(/nvme|disk/i),
      uptimeSeconds: Number.isFinite(uptimeSeconds) && uptimeSeconds > 0 ? uptimeSeconds : null,
      powerStatus: setting('POWER_STATUS') || '',
      planType,
      renewsSoon: Boolean(order.renewal_date && new Date(order.renewal_date).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000),
      createdAt: order.created_at || order.createdAt,
      renewalDate: order.renewal_date || null,
      paymentMethod: order.method || 'iban'
    };
  }

  app.get('/api/services', requireUser, (req, res) => {
    const orders = db.prepare(`
      SELECT orders.id, orders.plan_id, orders.plan_name AS plan_name, orders.monthly_price, orders.status, orders.created_at,
        payments.method, payments.status AS payment_status
      FROM orders
      LEFT JOIN payments ON payments.order_id = orders.id AND payments.id = (
        SELECT p2.id FROM payments p2 WHERE p2.order_id = orders.id ORDER BY p2.id DESC LIMIT 1
      )
      WHERE orders.user_id = ? AND (
        orders.status IN ('Aktif', 'Ödendi') OR payments.status = 'paid'
      )
      ORDER BY orders.id DESC
    `).all(req.user.id);
    res.json({ services: orders.map((order, index) => serviceSnapshot(order, index)) });
  });

  app.get('/api/services/:serviceId', requireUser, (req, res) => {
    const order = db.prepare(`
      SELECT orders.id, orders.plan_id, orders.plan_name AS plan_name, orders.monthly_price, orders.status, orders.created_at,
        payments.method, payments.status AS payment_status
      FROM orders
      LEFT JOIN payments ON payments.order_id = orders.id AND payments.id = (
        SELECT p2.id FROM payments p2 WHERE p2.order_id = orders.id ORDER BY p2.id DESC LIMIT 1
      )
      WHERE orders.user_id = ? AND orders.id = ? AND (
        orders.status IN ('Aktif', 'Ödendi') OR payments.status = 'paid'
      )
    `).get(req.user.id, Number(req.params.serviceId));
    if (!order) return res.status(404).json({ error: 'Bu hizmet bulunamadı.' });
    res.json({ service: serviceSnapshot(order, Number(req.params.serviceId) % 5) });
  });

  app.get('/api/domains/tlds', requireUser, async (req, res) => {
    try {
      const services = await getRdapBootstrap();
      res.json({ suffixes: [...new Set([...services.keys(), 'tr', 'com.tr'])].sort() });
    } catch {
      res.status(502).json({ error: 'Alan adı uzantıları şu anda alınamıyor.' });
    }
  });

  app.post('/api/payments/checkout', requireUser, async (req, res) => {
    if (req.body.method !== 'iban') return res.status(400).json({ error: 'Şu anda yalnızca IBAN / EFT ile ödeme alınabiliyor.' });
    const product = products.find((item) => item.id === req.body.productId);
    if (!product) return res.status(400).json({ error: 'Geçerli bir paket seçin.' });
    if (!process.env.COMPANY_IBAN) return res.status(503).json({ error: 'Havale için şirket IBAN bilgisi henüz yapılandırılmadı.' });

    const orderResult = db.prepare(`INSERT INTO orders (user_id, plan_id, plan_name, monthly_price, status)
      VALUES (?, ?, ?, ?, 'Ödeme bekliyor')`).run(req.user.id, product.id, product.name, product.price);
    const orderId = Number(orderResult.lastInsertRowid);
    const paymentResult = db.prepare(`INSERT INTO payments (order_id, user_id, method, amount_kurus, status)
      VALUES (?, ?, 'iban', ?, 'pending')`).run(orderId, req.user.id, product.price * 100);
    const paymentId = Number(paymentResult.lastInsertRowid);
    const bank = { name: process.env.BANK_NAME || '', accountName: process.env.BANK_ACCOUNT_NAME || '', iban: process.env.COMPANY_IBAN };
    const html = `
      <h2>Ödeme bilgileri</h2>
      <p>Merhaba, siparişiniz için aşağıdaki IBAN bilgilerini kullanarak ödeme yapabilirsiniz.</p>
      <p><strong>Banka:</strong> ${escapeHtml(bank.name || '—')}<br>
      <strong>Hesap sahibi:</strong> ${escapeHtml(bank.accountName || '—')}<br>
      <strong>IBAN:</strong> ${escapeHtml(bank.iban)}<br>
      <strong>Sipariş:</strong> ${escapeHtml(product.name)}<br>
      <strong>Tutar:</strong> ${escapeHtml(String(product.price))} ₺</p>
      <p>Ödemeyi yaptıktan sonra paneldeki “Hesabımda ödeme düştü mü?” düğmesine basın.</p>
    `;
    if (mailer && process.env.MAIL_FROM && req.user.email) {
      sendMailInBackground(req.user.email, `[${orderId}] IBAN ödeme bilgileri`, html, `Order ${orderId} payment`);
    }
    res.status(201).json({ payment: { id: paymentId, method: 'iban', status: 'pending', amount: product.price, orderId }, bank });
  });

  // CART QUOTE: authoritative line items and total for the customer's basket.
  app.post('/api/payments/cart/quote', requireUser, (req, res) => {
    try {
      res.json(calculateCartQuote(req.body.items));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // CART CHECKOUT: recompute every product and custom-server price on the server.
  app.post('/api/payments/cart', requireUser, async (req, res) => {
    if (req.body.method !== 'iban') return res.status(400).json({ error: 'Şu anda yalnızca IBAN / EFT ile ödeme alınabiliyor.' });
    let quote;
    try { quote = calculateCartQuote(req.body.items); }
    catch (error) { return res.status(400).json({ error: error.message }); }
    const { items, total } = quote;
    if (!process.env.COMPANY_IBAN) return res.status(503).json({ error: 'Havale için şirket IBAN bilgisi henüz yapılandırılmadı.' });

    const orderName = `Sepet (${items.reduce((count, item) => count + item.quantity, 0)} ürün): ${items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}`.slice(0, 250);
    const orderResult = db.prepare(`INSERT INTO orders (user_id, plan_id, plan_name, monthly_price, status)
      VALUES (?, 'cart', ?, ?, 'Ödeme bekliyor')`).run(req.user.id, orderName, total);
    const orderId = Number(orderResult.lastInsertRowid);
    const paymentResult = db.prepare(`INSERT INTO payments (order_id, user_id, method, amount_kurus, status)
      VALUES (?, ?, 'iban', ?, 'pending')`).run(orderId, req.user.id, total * 100);
    const paymentId = Number(paymentResult.lastInsertRowid);
    const bank = { name: process.env.BANK_NAME || '', accountName: process.env.BANK_ACCOUNT_NAME || '', iban: process.env.COMPANY_IBAN };
    const html = `
      <h2>Ödeme bilgileri</h2>
      <p>Merhaba, sepetiniz için aşağıdaki IBAN bilgilerini kullanarak ödeme yapabilirsiniz.</p>
      <p><strong>Banka:</strong> ${escapeHtml(bank.name || '—')}<br>
      <strong>Hesap sahibi:</strong> ${escapeHtml(bank.accountName || '—')}<br>
      <strong>IBAN:</strong> ${escapeHtml(bank.iban)}<br>
      <strong>Toplam:</strong> ${escapeHtml(String(total))} ₺</p>
      <p><strong>Ürünler:</strong><br>${orderItemsSummary(items)}</p>
      <p>Ödemeyi yaptıktan sonra paneldeki “Hesabımda ödeme düştü mü?” düğmesine basın.</p>
    `;
    if (mailer && process.env.MAIL_FROM && req.user.email) {
      sendMailInBackground(req.user.email, `[${orderId}] IBAN ödeme bilgileri`, html, `Order ${orderId} payment`);
    }
    res.status(201).json({ payment: { id: paymentId, method: 'iban', status: 'pending', amount: total, orderId }, items, bank });
  });

  app.post('/api/payments/:paymentId/confirm-transfer', requireUser, async (req, res) => {
    const payment = db.prepare(`SELECT payments.id, payments.order_id AS orderId, payments.user_id AS userId,
      payments.amount_kurus AS amountKurus, payments.method, payments.status, orders.plan_name AS planName, users.email
      FROM payments JOIN orders ON orders.id = payments.order_id JOIN users ON users.id = payments.user_id
      WHERE payments.id = ? AND payments.user_id = ?`).get(Number(req.params.paymentId), req.user.id);
    if (!payment || payment.method !== 'iban') return res.status(404).json({ error: 'Bu ödeme için IBAN doğrulama işlemi bulunamadı.' });
    if (payment.status === 'paid') return res.json({ ok: true, alreadyPaid: true, message: 'Ödeme daha önce onaylandı.' });
    if (payment.status === 'review') return res.json({ ok: true, alreadyRequested: true, message: 'Ödeme bildiriminiz zaten gönderildi. Yönetici onayı bekleniyor.' });
    const recipients = [...new Set([adminEmail(), process.env.SUPPORT_EMAIL?.trim().toLowerCase()].filter(Boolean))];
    if (!mailer || !process.env.MAIL_FROM || !recipients.length) {
      return res.status(503).json({ error: 'E-posta gönderimi yapılandırılmamış. ADMIN_EMAIL, SUPPORT_EMAIL ve SMTP ayarlarını kontrol edin.' });
    }

    const orderName = payment.planName || `Sipariş #${payment.orderId}`;
    const subject = `Ödeme Onayı #${payment.orderId}`;
    let ticket = db.prepare('SELECT id, public_id AS publicId FROM tickets WHERE user_id = ? AND subject = ?').get(req.user.id, subject);
    if (!ticket) {
      const publicId = `KH-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const result = db.prepare(`INSERT INTO tickets (public_id, user_id, subject, category, tracking_token)
        VALUES (?, ?, ?, 'Ödeme Onayı', ?)`).run(publicId, req.user.id, subject, crypto.randomBytes(24).toString('hex'));
      ticket = { id: Number(result.lastInsertRowid), publicId };
      const body = `Müşteri ödeme transferini bildirdi.\nMüşteri e-postası: ${req.user.email}\nSipariş: #${payment.orderId}\nPaket: ${orderName}\nTutar: ${(Number(payment.amountKurus) || 0) / 100} ₺\nÖdeme yöntemi: IBAN / EFT\n\nHavale hesabınıza ulaştıysa bu talebe ONAYLANDI yanıtını verin. Hizmet yalnızca bu onaydan sonra açılır.`;
      db.prepare(`INSERT INTO ticket_messages (ticket_id, author_type, body) VALUES (?, 'system', ?)`).run(ticket.id, body);
    }

    const messageBody = `
      <h2>Ödeme onayı bekliyor</h2>
      <p><strong>Müşteri:</strong> ${escapeHtml(payment.email)}<br>
      <strong>Sipariş:</strong> #${payment.orderId}<br>
      <strong>Paket / hizmet:</strong> ${escapeHtml(orderName)}<br>
      <strong>Tutar:</strong> ${escapeHtml(String((Number(payment.amountKurus) || 0) / 100))} ₺<br>
      <strong>Ödeme yöntemi:</strong> IBAN / EFT<br>
      <strong>Talep:</strong> ${escapeHtml(ticket.publicId)}</p>
      <p>Transferi banka hesabınızdan doğrulayın. Onaylıyorsanız bu e-postayı yanıtlayıp gövdeye tek başına <strong>ONAYLANDI</strong> yazın. Alternatif olarak yönetim panelindeki ödeme talebine aynı yanıtı verebilirsiniz. Hizmet onaydan sonra müşterinin Hizmetler kanalında açılır.</p>
      <p><a href="${publicUrl(req)}/admin.html?ticket=${encodeURIComponent(ticket.publicId)}">Ödeme talebini yönetim panelinde aç</a></p>
    `;
    const results = await Promise.all(recipients.map((recipient) => sendMail(recipient, `[KH-APPROVAL:${payment.orderId}] ${subject} · ${orderName}`, messageBody)));
    if (results.some((sent) => !sent)) return res.status(502).json({ error: 'Ödeme bildirimi e-postalarından biri gönderilemedi. SMTP ve alıcı adreslerini kontrol edip tekrar deneyin.' });

    db.prepare(`UPDATE payments SET status = 'review', updated_at = datetime('now') WHERE id = ?`).run(payment.id);
    db.prepare(`UPDATE orders SET status = 'Ödeme onayı bekliyor' WHERE id = ? AND status <> 'Aktif'`).run(payment.orderId);
    res.json({ ok: true, orderId: payment.orderId, ticketId: ticket.publicId, message: 'Ödeme bildirimi yönetici ve destek adreslerine gönderildi. Onay bekleniyor.' });
  });

  app.get('/api/domains/check', requireUser, async (req, res) => {
    const raw = typeof req.query.name === 'string' ? req.query.name.trim().toLowerCase() : '';
    const domain = domainToASCII(raw);
    if (!domain || domain.length > 253 || !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(domain)) {
      return res.status(400).json({ error: 'Alan adını ornek.com biçiminde girin.' });
    }
    const suffix = domain.split('.').pop();
    try {
      const services = await getRdapBootstrap();
      const registryBase = services.get(suffix);
      const endpoint = registryBase
        ? `${registryBase.replace(/\/+$/, '')}/domain/${encodeURIComponent(domain)}`
        : `https://rdap.org/domain/${encodeURIComponent(domain)}`;
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(4500), headers: { Accept: 'application/rdap+json, application/json' } });
      if (response.status === 404) {
        if (registryBase) return res.json({ domain, status: 'available', message: 'Kayıt bulunamadı; satın almadan önce kayıt kuruluşunda tekrar doğrulayın.' });
        return res.json({ domain, status: 'unknown', message: 'Bu uzantı için RDAP üzerinden kesin durum alınamadı.' });
      }
      if (response.ok) {
        const data = await response.json();
        const registrar = data.entities?.find((entity) => entity.roles?.includes('registrar'))?.vcardArray?.[1]?.find((item) => item[0] === 'fn')?.[3] || null;
        return res.json({ domain, status: 'registered', registrar, message: 'Bu alan adı kayıtlı görünüyor.' });
      }
      return res.json({ domain, status: 'unknown', message: 'Bu uzantı için şu an kesin durum alınamadı.' });
    } catch (error) {
      return res.status(502).json({ error: `Alan adı sorgulanamadı: ${error.name === 'TimeoutError' ? 'zaman aşımı' : 'RDAP servisine ulaşılamıyor'}.` });
    }
  });

  app.post('/api/support/tickets', requireUser, async (req, res) => {
    const subject = typeof req.body.subject === 'string' ? req.body.subject.trim().slice(0, 120) : '';
    const body = typeof req.body.body === 'string' ? req.body.body.trim().slice(0, 5000) : '';
    const category = typeof req.body.category === 'string' ? req.body.category.trim().slice(0, 50) : 'Genel';
    if (subject.length < 4 || body.length < 10) return res.status(400).json({ error: 'Konu en az 4, açıklama en az 10 karakter olmalı.' });
    const publicId = `KH-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const trackingToken = crypto.randomBytes(24).toString('hex');
    const result = db.prepare(`INSERT INTO tickets (public_id, user_id, subject, category, tracking_token)
      VALUES (?, ?, ?, ?, ?)`).run(publicId, req.user.id, subject, category, trackingToken);
    const ticketId = Number(result.lastInsertRowid);
    db.prepare(`INSERT INTO ticket_messages (ticket_id, author_type, body) VALUES (?, 'customer', ?)`).run(ticketId, body);
    const recipient = process.env.SUPPORT_EMAIL;
    if (recipient && mailer && process.env.MAIL_FROM) {
      const pixel = `${publicUrl(req)}/api/mail/open/${trackingToken}.gif`;
      const html = `<h2>Yeni destek talebi ${publicId}</h2><p><b>${escapeHtml(subject)}</b></p><p>${escapeHtml(body).replace(/\n/g, '<br>')}</p><p>Kullanıcı: ${escapeHtml(req.user.email)}</p><p><a href="${publicUrl(req)}/support.html?ticket=${encodeURIComponent(publicId)}">Panelde görüntüle</a></p><img src="${pixel}" width="1" height="1" alt="">`;
      sendMailInBackground(recipient, `[${publicId}] ${subject}`, html, `Ticket ${publicId}`);
    }
    res.status(201).json({ ticket: { publicId, subject, status: 'new' }, emailConfigured: Boolean(recipient && mailer) });
  });

  app.get('/api/support/tickets', requireUser, (req, res) => {
    const tickets = db.prepare(`SELECT public_id AS publicId, subject, category, priority, status,
      company_email_opened_at AS companyEmailOpenedAt, created_at AS createdAt, updated_at AS updatedAt
      FROM tickets WHERE user_id = ? ORDER BY id DESC`).all(req.user.id);
    res.json({ tickets });
  });

  app.get('/api/support/tickets/:publicId', requireUser, (req, res) => {
    const ticket = db.prepare(`SELECT tickets.id, tickets.public_id AS publicId, tickets.user_id AS userId,
      tickets.subject, tickets.category, tickets.priority, tickets.status,
      tickets.company_email_opened_at AS companyEmailOpenedAt, tickets.created_at AS createdAt,
      users.email FROM tickets JOIN users ON users.id = tickets.user_id WHERE tickets.public_id = ?`).get(req.params.publicId);
    if (!ticket || (ticket.userId !== req.user.id && !isAdmin(req))) return res.status(404).json({ error: 'Destek talebi bulunamadı.' });
    if (isAdmin(req)) db.prepare(`UPDATE tickets SET status = CASE WHEN status = 'new' THEN 'read' ELSE status END WHERE id = ?`).run(ticket.id);
    const messages = db.prepare(`SELECT author_type AS authorType, body, email_opened_at AS emailOpenedAt, created_at AS createdAt
      FROM ticket_messages WHERE ticket_id = ? ORDER BY id`).all(ticket.id);
    res.json({ ticket, messages, admin: isAdmin(req) });
  });

  app.post('/api/support/tickets/:publicId/messages', requireUser, async (req, res) => {
    const ticket = db.prepare(`SELECT tickets.id, tickets.public_id AS publicId, tickets.user_id AS userId,
      tickets.subject, tickets.category, users.email FROM tickets JOIN users ON users.id = tickets.user_id WHERE tickets.public_id = ?`).get(req.params.publicId);
    if (!ticket || (ticket.userId !== req.user.id && !isAdmin(req))) return res.status(404).json({ error: 'Destek talebi bulunamadı.' });
    const staff = isAdmin(req);
    const body = typeof req.body.body === 'string' ? req.body.body.trim().slice(0, 5000) : '';
    if (body.length < 2) return res.status(400).json({ error: 'Yanıt en az 2 karakter olmalı.' });
    const trackingToken = crypto.randomBytes(24).toString('hex');
    db.prepare(`INSERT INTO ticket_messages (ticket_id, author_type, body, tracking_token) VALUES (?, ?, ?, ?)`)
      .run(ticket.id, staff ? 'staff' : 'customer', body, trackingToken);
    db.prepare(`UPDATE tickets SET status = ?, tracking_token = CASE WHEN ? = 'customer' THEN ? ELSE tracking_token END,
      company_email_opened_at = CASE WHEN ? = 'staff' THEN NULL ELSE company_email_opened_at END,
      updated_at = datetime('now') WHERE id = ?`)
      .run(staff ? 'answered' : 'new', staff ? 'staff' : 'customer', trackingToken, staff ? 'staff' : 'customer', ticket.id);
    let approvedOrderId = null;
    if (staff && ticket.category === 'Ödeme Onayı' && /(^|\n)\s*ONAYLANDI\s*($|\n)/i.test(body)) {
      const orderId = Number(ticket.subject.match(/^Ödeme Onayı #(\d+)$/)?.[1]);
      const payment = orderId ? db.prepare(`SELECT id FROM payments WHERE order_id = ? AND user_id = ? AND method = 'iban' AND status IN ('pending', 'review') ORDER BY id DESC LIMIT 1`).get(orderId, ticket.userId) : null;
      if (payment) {
        db.prepare(`UPDATE payments SET status = 'paid', updated_at = datetime('now') WHERE id = ?`).run(payment.id);
        db.prepare(`UPDATE orders SET status = 'Aktif' WHERE id = ? AND user_id = ?`).run(orderId, ticket.userId);
        approvedOrderId = orderId;
        sendMailInBackground(ticket.email, `[${ticket.publicId}] Ödemeniz onaylandı`, `<h2>Ödemeniz onaylandı</h2><p>Sipariş #${orderId} için ödemeniz doğrulandı ve hizmetiniz açıldı.</p><p>Hizmet bilgilerinizi müşteri panelindeki <a href="${publicUrl(req)}/services.html">Hizmetler</a> bölümünde görebilirsiniz.</p>`, `Payment approval ${orderId}`);
      }
    }
    if (staff) {
      const pixel = `${publicUrl(req)}/api/mail/open/${trackingToken}.gif`;
      const html = `<h2>Destek talebinize yanıt verildi</h2><p><b>${escapeHtml(ticket.publicId)} · ${escapeHtml(ticket.subject)}</b></p><p>${escapeHtml(body).replace(/\n/g, '<br>')}</p>${approvedOrderId ? `<p>Sipariş #${approvedOrderId} için ödeme onaylandı; hizmetiniz Hizmetler bölümünde açıldı.</p>` : ''}<p><a href="${publicUrl(req)}/support.html?ticket=${encodeURIComponent(ticket.publicId)}">Yanıtı görüntüle</a></p><img src="${pixel}" width="1" height="1" alt="">`;
      sendMailInBackground(ticket.email, `[${ticket.publicId}] Destek yanıtı`, html, `Ticket ${ticket.publicId} reply`);
    } else if (process.env.SUPPORT_EMAIL) {
      const pixel = `${publicUrl(req)}/api/mail/open/${trackingToken}.gif`;
      const html = `<h2>Destek talebine yeni yanıt ${ticket.publicId}</h2><p><b>${escapeHtml(ticket.subject)}</b></p><p>${escapeHtml(body).replace(/\n/g, '<br>')}</p><p>Kullanıcı: ${escapeHtml(req.user.email)}</p><p><a href="${publicUrl(req)}/support.html?ticket=${encodeURIComponent(ticket.publicId)}">Panelde görüntüle</a></p><img src="${pixel}" width="1" height="1" alt="">`;
      sendMailInBackground(process.env.SUPPORT_EMAIL, `[${ticket.publicId}] Yeni müşteri yanıtı`, html, `Ticket ${ticket.publicId} reply`);
    }
    res.status(201).json({ ok: true, status: staff ? 'answered' : 'new', emailConfigured: Boolean(mailer && process.env.MAIL_FROM && (staff ? ticket.email : process.env.SUPPORT_EMAIL)) });
  });

  app.get('/api/admin/tickets', requireUser, requireAdmin, (req, res) => {
    const tickets = db.prepare(`SELECT tickets.public_id AS publicId, tickets.subject, tickets.category,
      tickets.priority, tickets.status, tickets.company_email_opened_at AS companyEmailOpenedAt,
      tickets.created_at AS createdAt, users.email FROM tickets JOIN users ON users.id = tickets.user_id
      ORDER BY CASE tickets.status WHEN 'new' THEN 0 WHEN 'read' THEN 1 ELSE 2 END, tickets.id DESC`).all();
    res.json({ tickets });
  });

  app.get('/api/admin/payments', requireUser, requireAdmin, (req, res) => {
    const payments = db.prepare(`SELECT payments.id, payments.amount_kurus AS amountKurus, payments.provider_ref AS providerRef,
      payments.created_at AS createdAt, orders.plan_name AS planName, users.email
      FROM payments JOIN orders ON orders.id = payments.order_id JOIN users ON users.id = payments.user_id
      WHERE payments.method = 'iban' AND payments.status = 'pending' ORDER BY payments.id`).all();
    res.json({ payments });
  });

  app.post('/api/admin/payments/:paymentId/confirm', requireUser, requireAdmin, (req, res) => {
    const payment = db.prepare(`SELECT id, order_id AS orderId FROM payments
      WHERE id = ? AND method = 'iban' AND status = 'pending'`).get(Number(req.params.paymentId));
    if (!payment) return res.status(404).json({ error: 'Onay bekleyen transfer bulunamadı.' });
    db.prepare(`UPDATE payments SET status = 'paid', updated_at = datetime('now') WHERE id = ?`).run(payment.id);
    db.prepare(`UPDATE orders SET status = 'Ödendi' WHERE id = ?`).run(payment.orderId);
    res.json({ ok: true });
  });

  app.get('/api/mail/open/:token.gif', (req, res) => {
    const token = req.params.token.replace(/\.gif$/, '');
    db.prepare(`UPDATE tickets SET company_email_opened_at = COALESCE(company_email_opened_at, datetime('now')),
      status = CASE WHEN status = 'new' THEN 'read' ELSE status END,
      updated_at = datetime('now') WHERE tracking_token = ?`).run(token);
    db.prepare(`UPDATE ticket_messages SET email_opened_at = COALESCE(email_opened_at, datetime('now')) WHERE tracking_token = ?`).run(token);
    res.set({ 'Content-Type': 'image/gif', 'Cache-Control': 'no-store, no-cache, must-revalidate, private', Pragma: 'no-cache' }).send(trackingPixel);
  });

}

module.exports = { registerPortalRoutes, sendMail, normalizeMailPassword };