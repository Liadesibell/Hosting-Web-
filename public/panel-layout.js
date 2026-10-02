// SHARED PANEL LAYOUT: One navigation shell is reused by each channel HTML page.
const channelLinks = [
  ['dashboard', '/panel.html', '⌂', 'Genel Bakış', 'overview'],
  ['packages', '/packages.html', '▦', 'Paketler', 'packages'],
  ['domains', '/domains.html', '◎', 'Alan Adı Sorgula', 'domains'],
  ['services', '/services.html', '▣', 'Hizmetler', 'services'],
  ['support', '/support.html', '✉', 'Destek Talepleri', 'support'],
  ['payments', '/payments.html', '₺', 'Sipariş ve Ödeme', 'payments'],
  ['assistant', '/assistant.html', '✦', 'Yapay Zekâ Asistanı', 'assistant']
];

const adminLink = ['admin', '/admin.html', '⚙', 'Yönetim', 'admin'];
const appRoot = document.querySelector('#app');

if (appRoot) {
  appRoot.innerHTML = `
    <div class="portal-layout">
      <aside class="sidebar" id="sidebar">
        <a class="brand" href="/"><span class="brand-mark">k</span><span>kök<span class="brand-light">host</span></span></a>
        <p class="nav-label" data-i18n="customerArea">MÜŞTERİ ALANI</p>
        <nav class="side-nav" aria-label="Müşteri paneli">
          ${channelLinks.map(([view, href, glyph, label, key]) => `<a class="nav-item" href="${href}" data-view="${view}"><span class="nav-glyph">${glyph}</span><span data-i18n="${key}">${label}</span></a>`).join('')}
          <div class="nav-divider"></div>
          <a class="nav-item admin-nav" href="${adminLink[1]}" data-view="admin" hidden><span class="nav-glyph">${adminLink[2]}</span><span data-i18n="${adminLink[4]}">${adminLink[3]}</span><span class="admin-dot"></span></a>
        </nav>
        <div class="sidebar-bottom">
          <div class="profile-row"><span class="avatar">K</span><span class="profile-copy"><strong id="profile-email">Hesap yükleniyor</strong><small data-i18n="activeAccount">Aktif hesap</small></span></div>
          <button class="logout-button" id="logout-button" type="button"><span aria-hidden="true">↗</span><span data-i18n="logout">Güvenli çıkış</span></button>
        </div>
      </aside>
      <div class="portal-main">
        <header class="portal-topbar">
          <button class="mobile-menu" id="mobile-menu" type="button" aria-label="Menüyü aç" aria-expanded="false">☰</button>
          <div><span class="topbar-kicker" data-i18n="portalLabel">KÖKHOST / MÜŞTERİ PANELİ</span><span class="topbar-title" id="topbar-title">Genel Bakış</span></div>
          <a class="cart-link" href="/cart.html" aria-label="Sepet" title="Sepet">
            <span class="cart-icon" aria-hidden="true">🛒</span>
            <span class="cart-label">Sepet</span>
            <span data-cart-count>0</span>
          </a>
          <a class="topbar-home" href="/" data-i18n="backToSite">Siteye dön ↗</a>
        </header>
        <main class="page-content" id="page-content" aria-live="polite"><p class="loading-state">Paneliniz hazırlanıyor...</p></main>
      </div>
    </div>
    <dialog class="modal" id="payment-dialog" aria-labelledby="payment-title">
      <div class="modal-heading"><div><p class="eyebrow">KÖKHOST / GÜVENLİ ÖDEME</p><h2 id="payment-title">Paketinizi seçtiniz</h2><p class="modal-subtitle" id="payment-product"></p></div><button class="modal-close" type="button" aria-label="Kapat">×</button></div>
      <div class="modal-body" id="payment-body"></div>
    </dialog>
    <div class="assistant-float-root">
      <section class="assistant-widget" id="assistant-widget" aria-label="KökHost AI sohbeti" hidden>
        <header class="assistant-widget-head">
          <span class="assistant-widget-mark" aria-hidden="true">k</span>
          <span><strong>KökHost AI</strong><small>Yardım asistanı</small></span>
          <button class="assistant-widget-close" id="assistant-widget-close" type="button" aria-label="Sohbeti kapat">×</button>
        </header>
        <div class="assistant-widget-log" id="assistant-widget-log" role="log" aria-live="polite"></div>
        <form class="assistant-widget-form" id="assistant-widget-form">
          <input class="text-input" name="message" type="text" required maxlength="2000" autocomplete="off" placeholder="Mesajınızı yazın…" aria-label="Mesajınız">
          <button class="assistant-widget-send" type="submit" aria-label="Mesajı gönder">➤</button>
        </form>
      </section>
      <button class="assistant-float-button" id="assistant-float-button" type="button" aria-label="KökHost AI sohbetini aç" aria-controls="assistant-widget" aria-expanded="false" title="KökHost AI ile konuş">
        <span aria-hidden="true">k</span>
      </button>
    </div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

// CART BADGE: restore the item count when a customer opens any channel page.
try {
  const cart = JSON.parse(localStorage.getItem('kokhost-cart') || '[]');
  const count = Array.isArray(cart) ? cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0) : 0;
  document.querySelectorAll('[data-cart-count]').forEach((badge) => { badge.textContent = String(count); });
} catch {}