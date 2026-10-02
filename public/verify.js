// EMAIL VERIFICATION: consume the token only after an explicit button press.
const verifyButton = document.querySelector('#verify-email-button');
const verifyMessage = document.querySelector('#verification-message');
const verifyError = document.querySelector('#verification-error');
const verificationToken = new URLSearchParams(location.search).get('token');

if (!verificationToken) {
  verifyError.textContent = 'Doğrulama bağlantısında token bulunamadı.';
  verifyButton.disabled = true;
}

verifyButton.addEventListener('click', async () => {
  verifyButton.disabled = true;
  verifyError.textContent = '';
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: verificationToken })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'E-posta doğrulanamadı.');
    verifyMessage.textContent = `${result.user.email} adresi doğrulandı. Müşteri paneline yönlendiriliyorsun.`;
    verifyButton.hidden = true;
    window.setTimeout(() => window.location.replace('/panel.html'), 1000);
  } catch (error) {
    verifyError.textContent = error.message;
    verifyButton.disabled = false;
  }
});