document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');

  if (!form) return;

  form.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();

  clearMessage('loginMessage');

  const btn = document.getElementById('loginBtn');
  const account = document.getElementById('loginAccount').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!account || !password) {
    showMessage('loginMessage', 'error', '請輸入登入帳號與登入密碼');
    return;
  }

  btn.disabled = true;
  btn.textContent = '登入中...';

  try {
    const result = await callApi({
      action: 'login',
      account: account,
      password: password
    });

    if (result.success) {
      saveCurrentUser(result.user);
      location.href = 'home.html';
    } else {
      showMessage('loginMessage', 'error', result.message || '登入失敗');
    }

  } catch (err) {
    showMessage('loginMessage', 'error', err.message || '系統連線失敗，請稍後再試');
  } finally {
    btn.disabled = false;
    btn.textContent = '登入';
  }
}
