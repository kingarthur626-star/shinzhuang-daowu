document.addEventListener('DOMContentLoaded', function() {
  const user = requireLogin();

  if (!user) return;

  document.getElementById('annualTitle').textContent = user.temple + ' 今年道務';
  document.getElementById('userInfo').textContent = user.temple + '　' + user.name;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      location.href = 'home.html';
    });
  }

  loadAnnualStats(user);
});

async function loadAnnualStats(user) {
  clearMessage('annualMessage');

  const area = document.getElementById('annualStatsArea');
  area.innerHTML = '';

  try {
    const result = await callApi({
      action: 'getAnnualStats',
      temple: user.temple
    });

    if (!result.success) {
      showMessage('annualMessage', 'error', result.message || '讀取失敗');
      return;
    }

    renderAnnualStats(result);

  } catch (err) {
    showMessage('annualMessage', 'error', err.message || '系統連線失敗，請稍後再試');
  }
}

function renderAnnualStats(result) {
  const area = document.getElementById('annualStatsArea');
  const monthText = '1月到' + result.monthLimit + '月';

  area.innerHTML = `
    <div class="small-text">
      ${escapeHtml(result.temple)}｜${result.year} 年 ${monthText} 統計
    </div>

    ${renderStatCard('2026求道', result.data.qiudao)}
    ${renderStatCard('2026法會', result.data.fahui)}
  `;
}

function renderStatCard(title, item) {
  if (!item || !item.found) {
    return `
      <div class="stat-card">
        <h2>${escapeHtml(title)}</h2>
        <div class="not-found">查無此壇名資料</div>
      </div>
    `;
  }

  const monthRows = item.months.map(function(m) {
    return `
      <tr>
        <td>${escapeHtml(m.label)}</td>
        <td>${escapeHtml(m.value)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="stat-card">
      <h2>${escapeHtml(title)}</h2>

      <div class="stat-summary">
        <div class="stat-box">
          <div class="stat-label">年度目標</div>
          <div class="stat-value">${escapeHtml(item.annualTarget)}</div>
        </div>

        <div class="stat-box">
          <div class="stat-label">今年累計</div>
          <div class="stat-value">${escapeHtml(item.ytdTotal)}</div>
        </div>

        <div class="stat-box">
          <div class="stat-label">達成率</div>
          <div class="stat-value">${escapeHtml(item.achievementRate)}</div>
        </div>

        <div class="stat-box">
          <div class="stat-label">總計欄位</div>
          <div class="stat-value">${escapeHtml(item.totalYear)}</div>
        </div>
      </div>

      <table class="stat-table">
        <thead>
          <tr>
            <th>月份</th>
            <th>數量</th>
          </tr>
        </thead>
        <tbody>
          ${monthRows}
        </tbody>
      </table>
    </div>
  `;
}
