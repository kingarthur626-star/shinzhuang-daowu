document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registerForm');

  if (!form) return;

  form.addEventListener('submit', handleRegister);

  document.querySelectorAll('input[name="group"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      const group = getSelectedRadioValue('group');
      loadTemplesByGroup(group, 'templeSelect', 'registerMessage');
    });
  });
});

async function handleRegister(e) {
  e.preventDefault();

  clearMessage('registerMessage');

  const btn = document.getElementById('registerBtn');

  const group = getSelectedRadioValue('group');
  const temple = document.getElementById('templeSelect').value.trim();
  const name = document.getElementById('registerName').value.trim();
  const account = document.getElementById('registerAccount').value.trim();
  const password = document.getElementById('registerPassword').value.trim();

  if (!group) {
    showMessage('registerMessage', 'error', '請選擇組別');
    return;
  }

  if (!temple) {
    showMessage('registerMessage', 'error', '請選擇壇名');
    return;
  }

  if (!name) {
    showMessage('registerMessage', 'error', '請輸入姓名');
    return;
  }

  if (!account) {
    showMessage('registerMessage', 'error', '請輸入帳號');
    return;
  }

  if (!password) {
    showMessage('registerMessage', 'error', '請輸入密碼');
    return;
  }

  btn.disabled = true;
  btn.textContent = '送出中...';

  try {
    const result = await callApi({
      action: 'register',
      group: group,
      temple: temple,
      name: name,
      account: account,
      password: password
    });

    if (result.success) {
      alert(result.message || '帳號申請成功，請登入');
      location.href = 'index.html?register=success';
    } else {
      showMessage('registerMessage', 'error', result.message || '申請失敗');
    }

  } catch (err) {
    showMessage('registerMessage', 'error', err.message || '系統連線失敗，請稍後再試');
  } finally {
    btn.disabled = false;
    btn.textContent = '送出申請';
  }
}
