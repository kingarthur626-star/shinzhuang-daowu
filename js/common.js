function showMessage(elementId, type, text) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.className = 'message ' + type;
  el.textContent = text;
}

function clearMessage(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.className = 'message';
  el.textContent = '';
}

function escapeHtml(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function saveCurrentUser(user) {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem('currentUser');
    if (!raw) return null;

    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function requireLogin() {
  const user = getCurrentUser();

  if (!user || !user.temple || !user.name || !user.account) {
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
  const checked = document.querySelector('input[name="' + name + '"]:checked');
  return checked ? checked.value : '';
}

async function loadTemplesByGroup(group, selectId, messageId) {
  const templeSelect = document.getElementById(selectId);

  if (!templeSelect) return;

  clearMessage(messageId);

  templeSelect.innerHTML = '<option value="">讀取中...</option>';
  templeSelect.disabled = true;

  try {
    const result = await callApi({
      action: 'getTemples',
      group: group
    });

    if (!result.success) {
      templeSelect.innerHTML = '<option value="">請先圈選組別...</option>';
      showMessage(messageId, 'error', result.message || '壇名讀取失敗');
      return;
    }

    templeSelect.innerHTML = '<option value="">請選擇壇名</option>';

    if (!result.temples || result.temples.length === 0) {
      templeSelect.innerHTML = '<option value="">此組別目前沒有壇名</option>';
      templeSelect.disabled = true;
      return;
    }

    result.temples.forEach(function(temple) {
      const option = document.createElement('option');
      option.value = temple;
      option.textContent = temple;
      templeSelect.appendChild(option);
    });

    templeSelect.disabled = false;

  } catch (err) {
    templeSelect.innerHTML = '<option value="">請先圈選組別...</option>';
    showMessage(messageId, 'error', err.message || '壇名讀取失敗，請稍後再試');
  }
}
