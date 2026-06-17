function callApi(payload) {
  payload = addTokenToPayload(payload || {});

  return new Promise(function(resolve, reject) {
    const callbackName =
      'jsonpCallback_' +
      Date.now() +
      '_' +
      Math.floor(Math.random() * 100000);

    payload.callback = callbackName;

    const params = new URLSearchParams();

    Object.keys(payload).forEach(function(key) {
      if (payload[key] !== undefined && payload[key] !== null) {
        params.append(key, payload[key]);
      }
    });

    const script = document.createElement('script');
    script.src = GAS_URL + '?' + params.toString();

    const timer = setTimeout(function() {
      cleanup();
      reject(new Error('系統連線逾時，請稍後再試'));
    }, 15000);

    window[callbackName] = function(result) {
      cleanup();

      if (result && result.code === 'AUTH_REQUIRED') {
        sessionStorage.removeItem('currentUser');
        alert(result.message || '登入逾時，請重新登入');
        location.href = 'index.html';
        return;
      }

      resolve(result);
    };

    script.onerror = function() {
      cleanup();
      reject(new Error('系統連線失敗，請稍後再試'));
    };

    function cleanup() {
      clearTimeout(timer);

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }

      try {
        delete window[callbackName];
      } catch (err) {
        window[callbackName] = undefined;
      }
    }

    document.body.appendChild(script);
  });
}

function addTokenToPayload(payload) {
  payload = Object.assign({}, payload);

  const publicActions = [
    'test',
    'getCaptcha',
    'login',
    'getTemples',
    'registerAccount',
    'resetPassword'
  ];

  if (publicActions.indexOf(payload.action) !== -1) {
    return payload;
  }

  const raw = sessionStorage.getItem('currentUser');

  if (!raw) {
    return payload;
  }

  try {
    const user = JSON.parse(raw);

    if (user && user.token) {
      payload.token = user.token;
    }
  } catch (err) {
    sessionStorage.removeItem('currentUser');
  }

  return payload;
}