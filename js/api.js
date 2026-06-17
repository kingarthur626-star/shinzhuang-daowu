function callApi(payload) {
  return new Promise(function(resolve, reject) {
    if (!GAS_URL || GAS_URL.includes('請貼上')) {
      reject(new Error('尚未設定 Apps Script Web App URL'));
      return;
    }

    const callbackName = 'gasCallback_' + Date.now() + '_' + Math.floor(Math.random() * 100000);

    payload.callback = callbackName;
    payload._t = Date.now();

    const params = new URLSearchParams(payload);
    const script = document.createElement('script');

    const timer = setTimeout(function() {
      cleanup();
      reject(new Error('連線逾時，請確認 Apps Script 是否已部署為 Web App'));
    }, 15000);

    window[callbackName] = function(result) {
      cleanup();
      resolve(result);
    };

    script.onerror = function() {
      cleanup();
      reject(new Error('無法連線到 Apps Script，請確認網址與部署權限'));
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

    script.src = GAS_URL + '?' + params.toString();
    document.body.appendChild(script);
  });
}
