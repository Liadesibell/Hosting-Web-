// PUBLIC STOREFRONT: account dialog and shared API access for the marketing page.
const authModal = document.querySelector('#auth-modal');
const authContent = document.querySelector('#auth-content');
let currentUser = null;

async function api(url, options = {}) {
  const apiBase = window.location.port === '5500'
    ? `${window.location.protocol}//${window.location.hostname}:3000`
    : '';
  const response = await fetch(`${apiBase}${url}`, {
    ...options,
    credentials: 'include',
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    signal: options.signal || AbortSignal.timeout(4500)
  });
  const body = await response.text();
  let data;
  try {
    data = body ? JSON.parse(body) : null;
  } catch {
    if (response.status === 404) {
      throw new Error('API bulunamadı. Uygulamayı Node.js sunucusundan açın; statik önizleme giriş işlemini desteklemez.');
    }
    throw new Error(`Sunucudan geçersiz yanıt alındı (HTTP ${response.status}).`);
  }
  if (!response.ok) throw new Error(data?.error || `İşlem tamamlanamadı (HTTP ${response.status}).`);
  if (!data) throw new Error('Sunucudan boş yanıt alındı. Lütfen tekrar deneyin.');
  return data;
}

function openAuth(mode = 'login') {
  if (currentUser) return window.location.assign('/panel.html');
  renderAuth(mode);
  authModal.showModal();
}

// ACCOUNT FORMS: login and registration in the storefront dialog.
function renderAuth(mode) {
  const registering = mode === 'register';
  authContent.innerHTML = `
    <div class="auth-tabs" role="tablist" aria-label="Hesap işlemi">
      <button class="auth-tab ${registering ? '' : 'active'}" type="button" data-mode="login" role="tab" aria-selected="${!registering}">Giriş yap</button>
      <button class="auth-tab ${registering ? 'active' : ''}" type="button" data-mode="register" role="tab" aria-selected="${registering}">Hesap oluştur</button>
    </div>
    <h2 id="auth-title">${registering ? 'Aramıza hoş geldiniz.' : 'Tekrar hoş geldiniz.'}</h2>
    <p class="modal-copy">${registering ? 'Kaydı tamamlamak için e-posta adresinizi doğrulayın.' : 'Hosting hesabınıza güvenle giriş yapın.'}</p>
    <form id="auth-form">
      <label class="field">E-posta adresi<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="siz@ornek.com"></label>
      <label class="field">Şifre<input name="password" type="password" autocomplete="${registering ? 'new-password' : 'current-password'}" required minlength="${registering ? '10' : '1'}" maxlength="128" placeholder="${registering ? 'En az 10 karakter' : 'Şifreniz'}"></label>
      <p class="form-error" id="form-error" aria-live="polite"></p>
      <button class="auth-submit" type="submit">${registering ? 'Hesabımı oluştur' : 'Giriş yap'} <span aria-hidden="true">↗</span></button>
    </form>`;

  authContent.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => renderAuth(button.dataset.mode)));
  authContent.querySelector('#auth-form').addEventListener('submit', submitAuth);
}

async function submitAuth(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('.auth-submit');
  const errorText = authContent.querySelector('#form-error');
  const registering = authContent.querySelector('[data-mode="register"]').classList.contains('active');
  submit.disabled = true;
  errorText.textContent = '';
  try {
    const values = Object.fromEntries(new FormData(form));
    const result = await api(`/api/auth/${registering ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(values) });
    if (registering && result.verificationRequired) {
        authContent.innerHTML = '<div class="verification-notice"><p class="eyebrow">E-POSTA DOĞRULAMA</p><h2>Mail kutunu kontrol et</h2><p><strong id="verification-email"></strong> adresine doğrulama bağlantısı gönderdik. Bağlantıyı onaylayınca hesabın aktif kayıtlara alınır. Oturum otomatik açılmaz; giriş ekranından şifrenle giriş yaparsın.</p><button class="soft-button" id="verification-back-to-login" type="button">Giriş ekranına dön</button></div>';
        authContent.querySelector('#verification-email').textContent = result.email;
      authContent.querySelector('#verification-back-to-login').addEventListener('click', () => renderAuth('login'));
      return;
    }
    currentUser = result.user;
    window.location.assign('/panel.html');
  } catch (error) {
    errorText.textContent = error.message;
    submit.disabled = false;
  }
}

document.querySelector('#account-button').addEventListener('click', () => currentUser ? window.location.assign('/panel.html') : openAuth('login'));
document.querySelector('.hero-login').addEventListener('click', (event) => { event.preventDefault(); openAuth('login'); });
document.querySelector('#signup-button').addEventListener('click', (event) => { event.preventDefault(); openAuth('register'); });
document.querySelector('#public-support-button').addEventListener('click', () => openAuth('login'));
document.querySelectorAll('[data-open-register]').forEach((button) => button.addEventListener('click', (event) => { event.preventDefault(); openAuth('register'); }));
document.querySelector('.close-modal').addEventListener('click', () => authModal.close());
authModal.addEventListener('click', (event) => { if (event.target === authModal) authModal.close(); });
document.querySelector('#menu-toggle').addEventListener('click', (event) => {
  const menu = document.querySelector('.main-nav');
  const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
  event.currentTarget.setAttribute('aria-expanded', String(!expanded));
  menu.classList.toggle('open', !expanded);
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('.main-nav').classList.remove('open');
  document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false');
}));

api('/api/auth/me')
  .then((session) => { currentUser = session.user; if (currentUser) window.location.assign('/panel.html'); })
    .catch(() => {});

if (new URLSearchParams(location.search).get('verified') === '1') {
  openAuth('login');
  const message = document.createElement('p');
  message.className = 'verification-success';
  message.textContent = 'E-posta adresin doğrulandı. Hesabın aktif; şimdi kayıt sırasında belirlediğin şifreyle giriş yap.';
  authContent.querySelector('.modal-copy').after(message);
}