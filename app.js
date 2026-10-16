'use strict';
(() => {
  const data = window.TRIP_DATA;
  const byId = id => document.getElementById(id);
  const all = selector => Array.from(document.querySelectorAll(selector));
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const external = 'target="_blank" rel="noopener noreferrer"';
  const sourceById = new Map(data.sources.map(source => [source.id, source]));
  const todoKey = 'seoul-trip-todos-v1';
  const preferencesKey = 'seoul-trip-preferences-v2';
  const tabs = ['itinerary', 'map', 'places', 'hotels', 'flights', 'todos'];
  let activeTab = 'itinerary';
  let mapDay = '1';
  let placeFilter = 'all';
  let todoFilter = 'all';
  let toastTimer;

  function storageWarning(message) {
    byId('storage-notice').textContent = message;
    byId('storage-notice').hidden = false;
  }
  function readJSON(key) {
    let raw;
    try { raw = localStorage.getItem(key); }
    catch { storageWarning('瀏覽器限制儲存：勾選仍可使用，但無法保存；離開前請匯出備份。'); return {}; }
    if (!raw) return {};
    try {
      const value = JSON.parse(raw);
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid shape');
      return value;
    } catch { storageWarning('本機儲存資料損毀：暫以空白狀態開啟，載入時未覆寫原資料；修改前請保留舊資料或備份。'); return {}; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { storageWarning('瀏覽器限制儲存或容量不足：這次變更無法保存，離開前請匯出備份。'); }
  }
  const storedPreferences = readJSON(preferencesKey);
  let preferences = {
    date: data.dateOptions.includes(storedPreferences.date) ? storedPreferences.date : '',
    base: Object.hasOwn(data.bases, storedPreferences.base) ? storedPreferences.base : 'myeongdong',
    snow: storedPreferences.snow === 'ski' ? 'ski' : 'snowboard'
  };
  const initialTodos = readJSON(todoKey);
  const todoIds = data.todoGroups.flatMap(group => group.items.map(item => item.id));
  let todos = Object.fromEntries(todoIds.map(id => [id, initialTodos[id] === true]));

  function cite(ids = []) {
    return ids.filter(id => sourceById.has(id)).map(id => `<a class="citation" href="#source-${id}" aria-label="查看來源 ${id}">[${id}]</a>`).join('');
  }
  function searchURL(query) { return 'https://www.google.com/maps/search/?' + new URLSearchParams({ api: '1', query }); }
  function directionURL(from, to, mode) {
    return 'https://www.google.com/maps/dir/?' + new URLSearchParams({ api: '1', origin: from.query, destination: to.query, travelmode: mode });
  }
  function notify(message) {
    clearTimeout(toastTimer);
    byId('app-status').textContent = message;
    byId('app-status').hidden = false;
    toastTimer = setTimeout(() => { byId('app-status').hidden = true; }, 5500);
  }
  function dateFor(day, start = preferences.date) {
    return start ? new Date(Date.parse(start + 'T00:00:00Z') + (day - 1) * 86400000) : null;
  }
  function formatDate(date) {
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}（${'日一二三四五六'[date.getUTCDay()]}）`;
  }
  function dayDate(day) { return preferences.date ? formatDate(dateFor(day)) : '日期待定'; }
  function renderDays() {
    byId('day-cards').innerHTML = data.days.map(day => `<article class="day-card" id="day-${day.id}">
      <div class="day-rail"><span class="day-label">DAY</span><strong>${String(day.id).padStart(2, '0')}</strong><time data-day-date="${day.id}"${preferences.date ? ` datetime="${dateFor(day.id).toISOString().slice(0, 10)}"` : ''}>${dayDate(day.id)}</time></div>
      <div class="day-content"><div class="day-title-row"><h3>${escapeHTML(day.title)}</h3><span class="day-region">${escapeHTML(day.region)}</span></div><p class="route-text">${escapeHTML(day.id === 1 ? (preferences.base === 'myeongdong' ? day.route : '仁川機場 → 首爾站 → 東大門住宿；當天就近吃飯休息，不繞明洞。') : day.id === 4 ? (preferences.snow === 'ski' ? '本趟主力：Montana Sports（雙板／雪鞋）；其他店不硬加。' : '本趟主力：Best Snowboard（單板）；其他店不硬加。') : day.route)}</p>
      <div class="day-blocks"><p><span class="block-label">今天的主線</span>${escapeHTML(day.main)}</p><p><span class="block-label">單人吃飯</span>${escapeHTML(day.food)}</p><p><span class="block-label">加選／替換</span>${escapeHTML(day.optional)}</p><p><span class="block-label">退場與緩衝</span>${escapeHTML(day.exit)}${cite(day.refs)}</p></div>
      <div class="day-bottom"><p>不趕路，不把備案變成必做清單。</p><button class="day-map-button" type="button" data-show-day="${day.id}">查看 DAY ${day.id} 分段地圖 ↗</button></div></div></article>`).join('');
    byId('date-summary').textContent = preferences.date ? `${formatDate(dateFor(1))}–${formatDate(dateFor(data.daysCount))} · 5 天 4 夜` : '5 天 4 夜 · 候選日期未定案';
  }
  function renderBackups() {
    byId('backup-cards').innerHTML = data.backups.map(item => `<article class="card"><span class="card-kicker">${escapeHTML(item.tag)}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.text)}${cite(item.refs)}</p><a href="${searchURL(item.query)}" ${external}>Google Maps 地點搜尋 ↗</a></article>`).join('');
  }
  function renderPlaces() {
    byId('place-cards').innerHTML = data.places.map(item => `<article class="card place-card" id="place-${item.id}" data-category="${item.category}"><span class="card-kicker">${escapeHTML(item.tag)}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.text)}${cite(item.refs)}</p>${item.address ? `<p class="address">${escapeHTML(item.address)}</p>` : ''}${item.phone ? `<p class="address">電話：${escapeHTML(item.phone)}</p>` : ''}<div class="card-links"><a href="${searchURL(item.query)}" ${external}>${item.pending ? '待核店址搜尋' : 'Google Maps 地點'} ↗</a>${item.website ? `<a href="${escapeHTML(item.website)}" ${external}>官網（本次未讀取）↗</a>` : item.refs?.length ? `<a href="${escapeHTML(sourceById.get(item.refs[0]).url)}" ${external}>${item.category === 'relax' ? '票務來源' : '資料來源'} ↗</a>` : ''}</div></article>`).join('');
    filterPlaces();
  }
  function filterPlaces() {
    let count = 0;
    all('.place-card').forEach(card => { card.hidden = placeFilter !== 'all' && card.dataset.category !== placeFilter; if (!card.hidden) count++; });
    all('[data-place-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.placeFilter === placeFilter)));
    byId('places-count').textContent = `目前顯示 ${count} 個候選／選項；未標已核實的資訊請先確認。`;
  }
  function renderHotels() {
    byId('hotel-total-cap').textContent = 'NT$' + (data.hotelNightCap * data.nights).toLocaleString('en-US');
    byId('hotel-cards').innerHTML = data.hotels.map(hotel => `<article class="card hotel-card"><span class="card-kicker">${escapeHTML(hotel.tag)}</span><h3>${escapeHTML(hotel.title)}</h3><p>${escapeHTML(hotel.text)}${cite(hotel.refs)}</p><p class="address">${escapeHTML(hotel.address)}</p><p class="card-note"><strong>兩組日期房價／空房：未核實</strong></p><div class="card-links"><a href="${escapeHTML(sourceById.get(hotel.refs[0]).url)}" ${external}>官方查房型／房價 ↗</a><a href="${searchURL(hotel.query)}" ${external}>Google Maps ↗</a></div></article>`).join('');
  }
  function renderFlights() {
    byId('flight-cards').innerHTML = data.dateOptions.map((start, i) => {
      const end = dateFor(data.daysCount, start).toISOString().slice(0, 10);
      const href = 'https://www.google.com/travel/flights?hl=zh-TW&gl=TW&curr=TWD';
      return `<article class="card"><span class="card-kicker">日期方案 ${i + 1}／未訂位</span><h3 class="flight-dates">${formatDate(dateFor(1, start))}–${formatDate(dateFor(data.daysCount, start))}</h3><ul class="flight-facts"><li>TPE → ICN／ICN → TPE</li><li>5 個日曆日・4 晚・跨週末</li><li>1 成人・經濟艙・直飛</li><li>同條件含稅＋兩段托運總價：待查</li></ul><button class="button primary" type="button" data-copy-flight="${start}">複製這組查票條件</button><div class="card-links"><a data-flight-search data-departure="${start}" data-return="${end}" href="${escapeHTML(href)}" ${external}>開啟 Google Flights（手動填條件）↗</a></div><p class="fineprint">舊日期深連結本次未套用，已移除。請複製條件後手動輸入；這不是報價或保留座位。</p></article>`;
    }).join('');
    byId('asiana-citation').innerHTML = cite([9]);
  }
  async function copyFlightQuery(start) {
    if (!data.dateOptions.includes(start)) return;
    const end = dateFor(data.daysCount, start).toISOString().slice(0, 10);
    const text = `去程 TPE→ICN ${start}；回程 ICN→TPE ${end}；1 成人、經濟艙、來回直飛、TWD。比較含稅及去回兩段托運後總價。`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text); notify('已複製這組查票條件；請到 Google Flights 或航空官網手動輸入');
    } catch {
      byId('share-link-title').textContent = '手動複製機票查詢條件';
      byId('share-link-input').value = text;
      byId('share-link-dialog').showModal(); byId('share-link-input').focus(); byId('share-link-input').select();
    }
  }
  function renderTodos() {
    byId('todo-groups').innerHTML = data.todoGroups.map(group => `<section class="todo-group" data-todo-group="${group.id}" aria-labelledby="todo-${group.id}-title"><h3 id="todo-${group.id}-title">${escapeHTML(group.title)}</h3><div class="todo-list">${group.items.map(item => `<label class="todo-item"><input class="todo-check" type="checkbox" data-todo-id="${item.id}"${todos[item.id] ? ' checked' : ''}><span><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.text)}</small></span></label>`).join('')}</div></section>`).join('');
    updateTodos();
  }
  function updateTodos() {
    const done = todoIds.filter(id => todos[id]).length;
    byId('todo-progress-label').textContent = `完成 ${done} / ${todoIds.length} 項`;
    byId('todo-progress').max = todoIds.length;
    byId('todo-progress').value = done;
    byId('todo-progress').textContent = `${Math.round(done / todoIds.length * 100)}%`;
    let visible = 0;
    all('.todo-item').forEach(item => {
      const checkbox = item.querySelector('input');
      const checked = todos[checkbox.dataset.todoId];
      checkbox.checked = checked;
      item.hidden = todoFilter === 'open' ? checked : todoFilter === 'done' ? !checked : false;
      if (!item.hidden) visible++;
    });
    all('[data-todo-group]').forEach(group => { group.hidden = !Array.from(group.querySelectorAll('.todo-item')).some(item => !item.hidden); });
    all('[data-todo-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.todoFilter === todoFilter)));
    byId('todo-empty').hidden = visible > 0;
  }
  function routeNodes(day) {
    const base = { ...data.bases[preferences.base], mode: 'transit' };
    const stop = (key, mode = 'transit') => ({ ...data.stops[key], mode });
    const optional = byId('include-optional').checked;
    switch (String(day)) {
      case '1': return [stop('airport'), stop('seoul'), base, ...(preferences.base === 'myeongdong' ? [stop('myeongdongOY', 'walking'), { ...base, mode: 'walking' }] : [])];
      case '2': return [base, stop('palace'), stop('insa', 'walking'), stop('market'), stop('fish', 'walking'), ...(optional ? [stop('sparex', 'walking')] : []), base];
      case '3': return [base, stop('hongik'), stop('hongdaeOY', 'walking'), stop('yeonnam', 'walking'), base];
      case '4': return [base, stop(preferences.snow === 'ski' ? 'montana' : 'best'), ...(optional ? [stop('seafood')] : []), base];
      case '5': return [base, stop('seoul'), stop('airport')];
      default: return [];
    }
  }
  function segmentsFor(day) {
    const nodes = routeNodes(day);
    return nodes.slice(1).map((to, index) => ({ from: nodes[index], to, mode: to.mode }));
  }
  function renderAllDays() {
    byId('all-days-map').innerHTML = data.days.map(day => `<article class="card all-day-card"><span class="card-kicker">DAY ${day.id} · ${dayDate(day.id)}</span><h3>${escapeHTML(day.title)}</h3><ol>${routeNodes(day.id).map(node => `<li><a href="${searchURL(node.query)}" ${external}>${escapeHTML(node.name)}</a></li>`).join('')}</ol><button class="button outline" type="button" data-show-day="${day.id}">看這天的分段導航 ↗</button></article>`).join('');
  }
  function previewSegment(index) {
    const segments = segmentsFor(mapDay);
    const segment = segments[index];
    if (!segment) return;
    const title = `${segment.from.name} → ${segment.to.name}`;
    byId('google-map').src = 'https://www.google.com/maps?' + new URLSearchParams({ output: 'embed', saddr: segment.from.query, daddr: segment.to.query });
    byId('google-map').title = `Google Maps 預覽：${title}`;
    byId('map-segment-title').textContent = title;
    byId('google-route-link').href = directionURL(segment.from, segment.to, segment.mode);
    byId('google-route-link').textContent = `Google Maps ${segment.mode === 'walking' ? '步行' : '大眾運輸'}導航 ↗`;
    all('[data-preview-segment]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.previewSegment) === index)));
  }
  function renderMap() {
    const isAll = mapDay === 'all';
    byId('map-anchor-note').textContent = `目前以${data.bases[preferences.base].name}作轉乘錨點，尚未指定飯店門口。機場航廈也待確認，不能把示意起終點當成最後接駁方案。`;
    all('[data-map-day]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mapDay === mapDay)));
    byId('map-current').hidden = isAll;
    byId('all-days-map').hidden = !isAll;
    if (isAll) { renderAllDays(); return; }
    const day = data.days.find(item => String(item.id) === mapDay);
    byId('map-day-title').textContent = `DAY ${mapDay} · ${dayDate(Number(mapDay))} · ${day.title}`;
    byId('map-day-note').textContent = byId('include-optional').checked ? '含加選路線；累了可刪掉汗蒸幕／海鮮市場，不必全部跑。' : '只顯示主線。選勾上方選項才加入汗蒸幕／海鮮市場。';
    byId('map-segments').innerHTML = segmentsFor(mapDay).map((segment, index) => `<li class="segment-card"><strong><span class="segment-mode">${String(index + 1).padStart(2, '0')} / ${segment.mode === 'walking' ? '步行' : '大眾運輸'}</span>${escapeHTML(segment.from.name)} → ${escapeHTML(segment.to.name)}</strong><div class="segment-actions"><a data-segment-link href="${directionURL(segment.from, segment.to, segment.mode)}" ${external}>開啟這一段導航 ↗</a><button type="button" data-preview-segment="${index}" aria-pressed="false">預覽這一段</button></div></li>`).join('');
    previewSegment(0);
  }
  function syncRouteHash() {
    const hash = activeTab === 'map' ? `map-day-${mapDay}` : activeTab;
    if (location.hash !== '#' + hash) history.pushState(null, '', '#' + hash);
  }
  function applyRouteHash() {
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { hash = ''; }
    if (hash.startsWith('source-') && byId(hash)) { byId('sources').open = true; return; }
    const match = /^map-day-(1|2|3|4|5|all)$/.exec(hash);
    if (match) { mapDay = match[1]; switchTab('map', false, false); return; }
    const legacy = { route: 'map', 'map-mode': 'map', days: 'itinerary', oliveyoung: 'places', snowgear: 'places', seafood: 'places' };
    if (hash === 'oliveyoung') placeFilter = 'beauty';
    if (hash === 'snowgear') placeFilter = 'snow';
    if (hash === 'seafood') placeFilter = 'food';
    filterPlaces();
    switchTab(legacy[hash] || hash || 'itinerary', false, false);
  }
  function switchTab(name, focus = false, updateHash = true) {
    activeTab = tabs.includes(name) ? name : 'itinerary';
    tabs.forEach(tab => {
      byId(`panel-${tab}`).hidden = tab !== activeTab;
      byId(`tab-${tab}`).setAttribute('aria-selected', String(tab === activeTab));
      byId(`tab-${tab}`).tabIndex = tab === activeTab ? 0 : -1;
    });
    if (activeTab === 'map') renderMap();
    if (focus) byId(`tab-${activeTab}`).focus({ preventScroll: true });
    if (updateHash) { syncRouteHash(); byId('main-content').scrollIntoView({ block: 'start', behavior: 'instant' }); }
  }
  function renderSources() {
    byId('source-list').innerHTML = data.sources.map(source => `<li id="source-${source.id}" value="${source.id}" tabindex="-1"><a href="${escapeHTML(source.url)}" ${external}>${escapeHTML(source.title)}</a><small>${escapeHTML(source.note)}</small></li>`).join('');
  }
  byId('date-option').value = preferences.date;
  byId('stay-area').value = preferences.base;
  byId('date-option').addEventListener('change', event => { preferences.date = event.target.value; saveJSON(preferencesKey, preferences); renderDays(); if (activeTab === 'map') renderMap(); });
  byId('stay-area').addEventListener('change', event => { preferences.base = event.target.value; saveJSON(preferencesKey, preferences); renderDays(); if (activeTab === 'map') renderMap(); });
  byId('snow-plan').value = preferences.snow;
  byId('snow-plan').addEventListener('change', event => { preferences.snow = event.target.value; saveJSON(preferencesKey, preferences); renderDays(); if (activeTab === 'map') renderMap(); });
  byId('include-optional').addEventListener('change', renderMap);
  all('[role="tab"]').forEach((button, index) => {
    button.addEventListener('click', () => switchTab(tabs[index]));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      switchTab(tabs[next], true);
    });
  });
  document.addEventListener('click', event => {
    const flightCopy = event.target.closest('[data-copy-flight]');
    if (flightCopy) copyFlightQuery(flightCopy.dataset.copyFlight);
    const opener = event.target.closest('[data-open-tab]');
    if (opener) { switchTab(opener.dataset.openTab); byId('main-content').scrollIntoView({ block: 'start' }); }
    const dayButton = event.target.closest('[data-show-day]');
    if (dayButton) { mapDay = dayButton.dataset.showDay; switchTab('map'); byId('main-content').scrollIntoView({ block: 'start' }); }
    const dayControl = event.target.closest('[data-map-day]');
    if (dayControl) { mapDay = dayControl.dataset.mapDay; renderMap(); syncRouteHash(); }
    const preview = event.target.closest('[data-preview-segment]');
    if (preview) previewSegment(Number(preview.dataset.previewSegment));
    const placeButton = event.target.closest('[data-place-filter]');
    if (placeButton) { placeFilter = placeButton.dataset.placeFilter; filterPlaces(); }
    const todoButton = event.target.closest('[data-todo-filter]');
    if (todoButton) { todoFilter = todoButton.dataset.todoFilter; updateTodos(); }
    const citation = event.target.closest('.citation');
    if (citation) { byId('sources').open = true; }
  });
  byId('todo-groups').addEventListener('change', event => {
    const checkbox = event.target.closest('.todo-check');
    if (!checkbox) return;
    todos[checkbox.dataset.todoId] = checkbox.checked;
    saveJSON(todoKey, todos);
    updateTodos();
  });
  byId('todo-reset').addEventListener('click', () => {
    if (!confirm('確定清除所有已勾選項目？只清除待辦，不更改日期與住宿區。')) return;
    todos = Object.fromEntries(todoIds.map(id => [id, false]));
    saveJSON(todoKey, todos);
    updateTodos();
  });
  byId('share-trip').addEventListener('click', async () => {
    const url = 'https://houseyen.github.io/seoul-dec-2026-trip/';
    const button = byId('share-trip');
    button.disabled = true;
    try {
      if (navigator.share) {
        try { await navigator.share({ title: document.title, url }); notify('分享操作已完成'); return; }
        catch (error) { if (error.name === 'AbortError') { notify('已取消分享，未複製或發送'); return; } }
      }
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(url); notify('已複製固定行程網址');
      } catch {
        byId('share-link-title').textContent = '手動複製分享連結';
        byId('share-link-input').value = url;
        byId('share-link-dialog').showModal();
        byId('share-link-input').focus(); byId('share-link-input').select();
      }
    } finally { button.disabled = false; }
  });
  byId('share-link-close').addEventListener('click', () => byId('share-link-dialog').close());
  byId('print-trip').addEventListener('click', () => window.print());
  function validBackup(value) {
    if (!value || value.app !== 'seoul-dec-2026-trip' || value.schemaVersion !== 1) return false;
    if (!value.todos || Array.isArray(value.todos) || typeof value.todos !== 'object') return false;
    if (Object.keys(value.todos).length !== todoIds.length || !todoIds.every(id => Object.hasOwn(value.todos, id) && typeof value.todos[id] === 'boolean')) return false;
    const p = value.preferences;
    return p && (p.date === '' || data.dateOptions.includes(p.date)) && Object.hasOwn(data.bases, p.base) && ['snowboard', 'ski'].includes(p.snow);
  }
  byId('todo-export').addEventListener('click', () => {
    const backup = { app: 'seoul-dec-2026-trip', schemaVersion: 1, exportedAt: new Date().toISOString(), todos, preferences };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = '首爾待辦備份_' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('已開始下載本機備份；不會上傳任何資料');
  });
  byId('todo-import-open').addEventListener('click', () => byId('todo-import').click());
  byId('todo-import').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 64 * 1024) throw new Error('Too large');
      const backup = JSON.parse(await file.text());
      if (!validBackup(backup)) throw new Error('Invalid backup');
      if (!confirm('匯入將覆寫本機 10 項勾選、日期與住宿區偏好，確定嗎？')) return;
      todos = Object.fromEntries(todoIds.map(id => [id, backup.todos[id]]));
      preferences = { date: backup.preferences.date, base: backup.preferences.base, snow: backup.preferences.snow };
      saveJSON(todoKey, todos); saveJSON(preferencesKey, preferences);
      byId('date-option').value = preferences.date; byId('stay-area').value = preferences.base; byId('snow-plan').value = preferences.snow;
      renderDays(); renderTodos(); if (activeTab === 'map') renderMap();
      notify('已還原本機備份；不代表任何訂位已完成');
    } catch { notify('無法匯入：請選此網站匯出的有效 JSON 備份（最多 64 KB）；原勾選未變更'); }
    finally { event.target.value = ''; }
  });
  let previousSourcesOpen = false;
  window.addEventListener('beforeprint', () => { previousSourcesOpen = byId('sources').open; byId('sources').open = true; renderAllDays(); });
  window.addEventListener('afterprint', () => { byId('sources').open = previousSourcesOpen; });
  window.addEventListener('hashchange', applyRouteHash);
  window.addEventListener('popstate', applyRouteHash);
  renderDays(); renderBackups(); renderPlaces(); renderHotels(); renderFlights(); renderTodos(); renderSources();
  applyRouteHash();
})();
