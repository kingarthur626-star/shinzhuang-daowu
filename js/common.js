function showMessage(elementId, type, message) {
  const element = document.getElementById(elementId);

  if (!element) return;

  element.className = 'message ' + type;
  element.textContent = message;
}

function clearMessage(elementId) {
  const element = document.getElementById(elementId);

  if (!element) return;

  element.className = 'message';
  element.textContent = '';
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function saveCurrentUser(user, token) {
  if (!user) return;

  const currentUser = {
    temple: user.temple || '',
    name: user.name || '',
    account: user.account || '',
    token: token || user.token || ''
  };

  sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function getCurrentUser() {
  const raw = sessionStorage.getItem('currentUser');

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    sessionStorage.removeItem('currentUser');
    return null;
  }
}

function requireLogin() {
  const user = getCurrentUser();

  if (!user || !user.token) {
    sessionStorage.removeItem('currentUser');
    location.href = 'index.html';
    return null;
  }

  return user;
}

function logout() {
  sessionStorage.removeItem('currentUser');
  location.href = 'index.html';
}

function getSelectedRadioValue(name) {
  const selected = document.querySelector('input[name="' + name + '"]:checked');

  if (!selected) {
    return '';
  }

  return selected.value;
}

async function loadTemplesByGroup(group, selectId, messageId) {
  const select = document.getElementById(selectId);

  if (!select) return;

  select.innerHTML = '<option value="">讀取中...</option>';
  select.disabled = true;

  try {
    const result = await callApi({
      action: 'getTemples',
      group: group
    });

    if (!result.success) {
      if (messageId) {
        showMessage(messageId, 'error', result.message || '壇名讀取失敗');
      }

      select.innerHTML = '<option value="">請先選擇組別</option>';
      return;
    }

    select.innerHTML = '<option value="">請選擇壇名</option>';

    result.temples.forEach(function(temple) {
      const option = document.createElement('option');
      option.value = temple;
      option.textContent = temple;
      select.appendChild(option);
    });

    select.disabled = false;

  } catch (err) {
    if (messageId) {
      showMessage(messageId, 'error', err.message || '壇名讀取失敗');
    }

    select.innerHTML = '<option value="">請先選擇組別</option>';
  }
}