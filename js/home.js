document.addEventListener('DOMContentLoaded', function() {
  const user = requireLogin();

  if (!user) return;

  document.getElementById('homeContent').innerHTML = `
    <p>登入成功</p>
    <p>${escapeHtml(user.temple)}　${escapeHtml(user.name)}</p>
    <p class="small-text">帳號：${escapeHtml(user.account)}</p>

    <div class="menu-area">
      <a class="menu-btn" href="annual.html">${escapeHtml(user.temple)} 今年道務</a>
    </div>
  `;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});
