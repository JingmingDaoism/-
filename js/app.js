// 道教净明宗 PWA 应用逻辑

let currentPage = 'home';
let currentMonth = new Date();
let deityFilter = 'all';
let termFilter = 'all';
let detailFilter = 'all';

// 页面切换
function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  event.currentTarget.classList.add('active');
  window.scrollTo(0, 0);
  
  if (page === 'calendar') renderCalendar();
  if (page === 'deity') renderDeities();
  if (page === 'terms') renderTerms();
  if (page === 'classics') renderClassics();
  if (page === 'sites') renderSites();
  if (page === 'detail') renderDetails();
  if (page === 'home') renderTodayInfo();
}

// 今日宜忌
function renderTodayInfo() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const todayEvents = EVENTS.filter(e => e.date === dateStr);
  
  const el = document.getElementById('today-info');
  if (todayEvents.length > 0) {
    let html = `<p><strong>📅 ${dateStr}</strong></p>`;
    todayEvents.forEach(e => {
      html += `<p style="color:#6B2D8E;margin-top:8px;"><strong>${e.summary}</strong></p>`;
      html += `<p style="font-size:12px;color:#888;">${(e.description || '').substring(0, 100)}...</p>`;
    });
    el.innerHTML = html;
  } else {
    el.innerHTML = `
      <p><strong>📅 ${dateStr}</strong></p>
      <p style="color:#888;margin-top:8px;">今日无特殊道教日程</p>
      <p style="font-size:12px;color:#AAA;margin-top:4px;">宜：日常修行、行善积德</p>
    `;
  }
}

// 日历渲染
function renderCalendar() {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  document.getElementById('calendar-title').textContent = `${year}年${month + 1}月`;
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  let html = '';
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day other-month"></div>';
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasEvent = EVENTS.some(e => e.date === dateStr);
    const isToday = dateStr === todayStr;
    let cls = 'calendar-day';
    if (hasEvent) cls += ' has-event';
    if (isToday) cls += ' today';
    html += `<div class="${cls}" onclick="showDayEvents('${dateStr}')">${day}${hasEvent ? '<div class="dot"></div>' : ''}</div>`;
  }
  
  document.getElementById('calendar-grid').innerHTML = html;
}

function changeMonth(delta) {
  currentMonth.setMonth(currentMonth.getMonth() + delta);
  renderCalendar();
}

function showDayEvents(dateStr) {
  const dayEvents = EVENTS.filter(e => e.date === dateStr);
  const el = document.getElementById('calendar-events');
  if (dayEvents.length > 0) {
    let html = `<h3 style="color:#6B2D8E;margin-bottom:10px;">${dateStr} 日程</h3>`;
    dayEvents.forEach(e => {
      html += `<div class="event-detail" onclick="showEventDetail('${e.date}', '${e.summary.replace(/'/g, "\\'")}')">`;
      html += `<h3>${e.summary}</h3>`;
      html += `<div class="desc">${(e.description || '').substring(0, 150)}...</div>`;
      html += `</div>`;
    });
    el.innerHTML = html;
  } else {
    el.innerHTML = `<p style="color:#999;text-align:center;padding:20px;">${dateStr} 无日程</p>`;
  }
}

function showEventDetail(date, summary) {
  const event = EVENTS.find(e => e.date === date && e.summary === summary);
  if (!event) return;
  openModal(`
    <h2>${event.summary}</h2>
    <div class="meta"><p>📅 ${event.date}</p></div>
    <p style="white-space:pre-wrap;line-height:1.8;">${event.description || '暂无详细说明'}</p>
  `);
}

// 神仙列表
function renderDeities() {
  const search = document.getElementById('deity-search').value.toLowerCase();
  const filtered = DEITIES.filter(d => {
    const matchSearch = !search || (d.name || '').toLowerCase().includes(search) || (d.title || '').toLowerCase().includes(search) || (d.category || '').toLowerCase().includes(search);
    const matchFilter = deityFilter === 'all' || d.category === deityFilter;
    return matchSearch && matchFilter;
  });
  
  // 渲染筛选标签
  const categories = [...new Set(DEITIES.map(d => d.category).filter(Boolean))];
  let filterHtml = `<div class="filter-tag ${deityFilter === 'all' ? 'active' : ''}" onclick="setDeityFilter('all')">全部</div>`;
  categories.forEach(c => {
    filterHtml += `<div class="filter-tag ${deityFilter === c ? 'active' : ''}" onclick="setDeityFilter('${c}')">${c}</div>`;
  });
  document.getElementById('deity-filters').innerHTML = filterHtml;
  
  // 渲染列表
  let html = '';
  filtered.forEach(d => {
    html += `<div class="deity-card" onclick="showDeityDetail('${(d.name || '').replace(/'/g, "\\'")}')">`;
    html += `<img src="${d.image || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22><rect fill=%22%23F5EEF9%22 width=%2260%22 height=%2260%22/><text x=%2230%22 y=%2238%22 text-anchor=%22middle%22 fill=%22%236B2D8E%22 font-size=%2224%22>☯</text></svg>'}" alt="${d.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22><rect fill=%22%23F5EEF9%22 width=%2260%22 height=%2260%22/><text x=%2230%22 y=%2238%22 text-anchor=%22middle%22 fill=%22%236B2D8E%22 font-size=%2224%22>☯</text></svg>'">`;
    html += `<div class="deity-info">`;
    html += `<h3>${d.name || ''}</h3>`;
    html += `<p>${d.title || d.description || ''}</p>`;
    html += `</div></div>`;
  });
  
  if (filtered.length === 0) {
    html = '<p style="text-align:center;color:#999;padding:40px;">未找到相关神仙</p>';
  }
  
  document.getElementById('deity-list').innerHTML = html;
}

function setDeityFilter(cat) {
  deityFilter = cat;
  renderDeities();
}

function filterDeities() {
  renderDeities();
}

function showDeityDetail(name) {
  const deity = DEITIES.find(d => d.name === name);
  if (!deity) return;
  openModal(`
    <h2>${deity.name || ''}</h2>
    ${deity.image ? `<img src="${deity.image}" alt="${deity.name}" onerror="this.style.display='none'">` : ''}
    <div class="meta">
      ${deity.category ? `<p>📂 分类：${deity.category}</p>` : ''}
      ${deity.title ? `<p>🏷️ 神职：${deity.title}</p>` : ''}
      ${deity.birthday ? `<p>🎂 圣诞：${deity.birthday}</p>` : ''}
    </div>
    ${deity.description ? `<p style="line-height:1.8;">${deity.description}</p>` : ''}
    ${deity.en_name ? `<p style="color:#888;font-size:12px;">English: ${deity.en_name}</p>` : ''}
    ${deity.source ? `<p style="color:#AAA;font-size:11px;margin-top:12px;">图片来源：${deity.source}</p>` : ''}
  `);
}

// 术语列表
function renderTerms() {
  const search = document.getElementById('term-search').value.toLowerCase();
  
  // 展平术语
  let allTerms = [];
  TERMS.forEach(cat => {
    (cat.terms || []).forEach(t => {
      allTerms.push({...t, category: cat.category});
    });
  });
  
  const filtered = allTerms.filter(t => {
    return !search || (t.term || '').toLowerCase().includes(search) || (t.definition || '').toLowerCase().includes(search);
  });
  
  // 筛选标签
  const categories = [...new Set(allTerms.map(t => t.category).filter(Boolean))];
  let filterHtml = `<div class="filter-tag ${termFilter === 'all' ? 'active' : ''}" onclick="setTermFilter('all')">全部</div>`;
  categories.forEach(c => {
    filterHtml += `<div class="filter-tag ${termFilter === c ? 'active' : ''}" onclick="setTermFilter('${c}')">${c}</div>`;
  });
  document.getElementById('term-filters').innerHTML = filterHtml;
  
  // 列表
  let html = '';
  filtered.forEach(t => {
    html += `<div class="term-item">`;
    html += `<h4>${t.term || ''}</h4>`;
    html += `<p>${t.definition || ''}</p>`;
    if (t.category) html += `<p style="font-size:11px;color:#AAA;margin-top:4px;">${t.category}</p>`;
    html += `</div>`;
  });
  
  if (filtered.length === 0) {
    html = '<p style="text-align:center;color:#999;padding:40px;">未找到相关术语</p>';
  }
  
  document.getElementById('term-list').innerHTML = html;
}

function setTermFilter(cat) {
  termFilter = cat;
  renderTerms();
}

function filterTerms() {
  renderTerms();
}

// 经典列表
function renderClassics() {
  const search = document.getElementById('classic-search').value.toLowerCase();
  
  let allClassics = [];
  CLASSICS.forEach(cat => {
    (cat.classics || []).forEach(c => {
      allClassics.push({...c, category: cat.category});
    });
  });
  
  const filtered = allClassics.filter(c => {
    return !search || (c.name || '').toLowerCase().includes(search) || (c.description || '').toLowerCase().includes(search);
  });
  
  let html = '';
  filtered.forEach(c => {
    html += `<div class="classic-item">`;
    html += `<h4>📜 ${c.name || ''}</h4>`;
    html += `<p>${c.description || ''}</p>`;
    if (c.dynasty) html += `<p style="font-size:12px;color:#888;">朝代：${c.dynasty}</p>`;
    if (c.category) html += `<p style="font-size:11px;color:#AAA;">${c.category}</p>`;
    html += `</div>`;
  });
  
  if (filtered.length === 0) {
    html = '<p style="text-align:center;color:#999;padding:40px;">未找到相关经典</p>';
  }
  
  document.getElementById('classic-list').innerHTML = html;
}

function filterClassics() {
  renderClassics();
}

// 名胜列表
function renderSites() {
  const search = document.getElementById('site-search').value.toLowerCase();
  
  let allSites = [];
  SITES.forEach(cat => {
    (cat.sites || []).forEach(s => {
      allSites.push({...s, category: cat.category});
    });
  });
  
  const filtered = allSites.filter(s => {
    return !search || (s.name || '').toLowerCase().includes(search) || (s.description || '').toLowerCase().includes(search) || (s.location || '').toLowerCase().includes(search);
  });
  
  let html = '';
  filtered.forEach(s => {
    html += `<div class="site-item">`;
    html += `<h4>⛩️ ${s.name || ''}</h4>`;
    if (s.location) html += `<p style="color:#6B2D8E;font-size:12px;">📍 ${s.location}</p>`;
    html += `<p>${s.description || ''}</p>`;
    if (s.category) html += `<p style="font-size:11px;color:#AAA;">${s.category}</p>`;
    html += `</div>`;
  });
  
  if (filtered.length === 0) {
    html = '<p style="text-align:center;color:#999;padding:40px;">未找到相关名胜</p>';
  }
  
  document.getElementById('site-list').innerHTML = html;
}

function filterSites() {
  renderSites();
}

// 详细指南
function renderDetails() {
  const search = document.getElementById('detail-search').value.toLowerCase();
  
  const filtered = EVENTS.filter(e => {
    const matchSearch = !search || (e.summary || '').toLowerCase().includes(search) || (e.description || '').toLowerCase().includes(search);
    return matchSearch;
  });
  
  let html = '';
  filtered.forEach(e => {
    html += `<div class="event-detail" onclick="showEventDetail('${e.date}', '${e.summary.replace(/'/g, "\\'")}')">`;
    html += `<h3>${e.summary}</h3>`;
    html += `<div class="date">📅 ${e.date}</div>`;
    html += `<div class="desc">${(e.description || '').substring(0, 120)}...</div>`;
    html += `</div>`;
  });
  
  if (filtered.length === 0) {
    html = '<p style="text-align:center;color:#999;padding:40px;">未找到相关日程</p>';
  }
  
  document.getElementById('detail-list').innerHTML = html;
}

function filterDetails() {
  renderDetails();
}

// 弹窗
function openModal(html) {
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal') && e.target.closest('.modal')) return;
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  renderTodayInfo();
});
