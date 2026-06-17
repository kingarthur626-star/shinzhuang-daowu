let currentCaptchaId = '';

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const refreshCaptchaBtn = document.getElementById('refreshCaptchaBtn');

  if (refreshCaptchaBtn) {
    refreshCaptchaBtn.addEventListener('click', loadCaptcha);
  }

  const params = new URLSearchParams(location.search);

  if (params.get('register') === 'success') {
    showMessage('loginMessage', 'success', '帳號申請成功，請登入');
  }

  if (params.get('reset') === 'success') {
    showMessage('loginMessage', 'success', '密碼已更新，請重新登入');
  }

  loadCaptcha();
});

async function loadCaptcha() {
  const captchaImage = document.getElementById('captchaImage');
  const captchaInput = document.getElementById('captchaInput');

  if (captchaInput) {
    captchaInput.value = '';
  }

  try {
    const result = await callApi({
      action: 'getCaptcha'
    });

    if (!result.success) {
      showMessage('loginMessage', 'error', result.message || '驗證碼載入失敗');
      return;
    }

    currentCaptchaId = result.captchaId;

    if (captchaImage) {
      captchaImage.src = result.imageData;
    }

  } catch (err) {
    showMessage('loginMessage', 'error', err.message || '驗證碼載入失敗');
  }
}

async function handleLogin(event) {
  event.preventDefault();

  clearMessage('loginMessage');

  const account = document.getElementById('loginAccount').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const captchaInput = document.getElementById('captchaInput').value.trim();

  if (!account || !password) {
    showMessage('loginMessage', 'error', '請輸入帳號與密碼');
    return;
  }

  if (!captchaInput) {
    showMessage('loginMessage', 'error', '請輸入驗證碼');
    return;
  }

  try {
    const result = await callApi({
      action: 'login',
      account: account,
      password: password,
      captchaId: currentCaptchaId,
      captchaInput: captchaInput
    });

    if (!result.success) {
      showMessage('loginMessage', 'error', result.message || '登入失敗');
      loadCaptcha();
      return;
    }

    saveCurrentUser(result.user, result.token);
    location.href = 'home.html';

  } catch (err) {
    showMessage('loginMessage', 'error', err.message || '系統連線失敗，請稍後再試');
    loadCaptcha();
  }
}