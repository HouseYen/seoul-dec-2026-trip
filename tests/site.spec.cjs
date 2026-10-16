const { test, expect } = require('@playwright/test');
const tabNames = ['行程總覽', '地圖導航', '吃買清單', '飯店住宿', '機票比價', '待辦清單'];

test.beforeEach(async ({ page }) => {
  // Unit/integration browser runs isolate third-party Maps availability.
  await page.route('https://www.google.com/maps?**', route => route.fulfill({
    contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Maps test fixture</title><body>External map isolated in integration tests</body></html>'
  }));
});

test('v2 has six linked tabs, valid IDs and source anchors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('[data-site-version]')).toHaveText('v2.0');
  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveText(tabNames);
  for (const name of tabNames) {
    await page.getByRole('tab', { name, exact: true }).click();
    await expect(page.getByRole('tabpanel')).toBeVisible();
    expect(await page.locator('[role="tabpanel"]:visible').count()).toBe(1);
  }
  const issues = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll('[id]'), node => node.id);
    return {
      duplicates: ids.filter((id, i) => ids.indexOf(id) !== i),
      missing: Array.from(document.querySelectorAll('a[href^="#"]')).map(a => a.getAttribute('href').slice(1)).filter(id => !document.getElementById(id)),
      badTabs: Array.from(document.querySelectorAll('[role="tab"]')).filter(tab => document.getElementById(tab.getAttribute('aria-controls'))?.getAttribute('aria-labelledby') !== tab.id).map(t => t.id)
    };
  });
  expect(issues).toEqual({ duplicates: [], missing: [], badTabs: [] });
  expect(errors).toEqual([]);
});

test('date candidates and hotel base update the itinerary without implying bookings', async ({ page }) => {
  await page.goto('./');
  await page.locator('#date-option').selectOption('2026-12-03');
  await expect(page.locator('[data-day-date="1"]')).toContainText('12/3');
  await expect(page.locator('[data-day-date="5"]')).toContainText('12/7');
  await expect(page.locator('#date-summary')).toContainText('5 天 4 夜');
  await page.locator('#date-option').selectOption('2026-12-10');
  await expect(page.locator('[data-day-date="5"]')).toContainText('12/14');
  await page.locator('#stay-area').selectOption('dongdaemun');
  await page.getByRole('tab', { name: '地圖導航', exact: true }).click();
  await expect(page.locator('#map-anchor-note')).toContainText('東大門');
  await page.reload();
  await expect(page.locator('#date-option')).toHaveValue('2026-12-10');
  await expect(page.locator('#stay-area')).toHaveValue('dongdaemun');
  await expect(page.locator('#booking-status')).toContainText('未代表已訂位');
});

test('all five Google routes use separate accurate segment links and a real all-days list', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('tab', { name: '地圖導航', exact: true }).click();
  const dayButtons = page.locator('[data-map-day]');
  await expect(dayButtons).toHaveCount(6);
  expect(await dayButtons.evaluateAll(nodes => nodes.map(n => n.dataset.mapDay))).toEqual(['1', '2', '3', '4', '5', 'all']);
  for (const day of ['1', '2', '3', '4', '5']) {
    await page.locator(`[data-map-day="${day}"]`).click();
    const links = await page.locator('#map-segments a[data-segment-link]').evaluateAll(nodes => nodes.map(a => a.href));
    expect(links.length).toBeGreaterThan(0);
    for (const href of links) {
      const url = new URL(href);
      expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/');
      expect(url.searchParams.get('api')).toBe('1');
      expect(url.searchParams.get('origin')).toBeTruthy();
      expect(url.searchParams.get('destination')).toBeTruthy();
      expect(url.searchParams.has('waypoints')).toBe(false);
      expect(['walking', 'transit']).toContain(url.searchParams.get('travelmode'));
    }
    await expect(page.locator('#google-map')).toHaveAttribute('src', /google\.com\/maps\?.*output=embed/);
    await page.locator('#map-segments [data-preview-segment]').last().click();
    const preview = new URL(await page.locator('#google-map').getAttribute('src'));
    const last = new URL(links.at(-1));
    expect(preview.searchParams.get('saddr')).toBe(last.searchParams.get('origin'));
    expect(preview.searchParams.get('daddr')).toBe(last.searchParams.get('destination'));
  }
  await page.locator('[data-map-day="all"]').click();
  await expect(page.locator('#all-days-map .all-day-card')).toHaveCount(5);
  await expect(page.locator('#all-days-map')).toContainText('景福宮');
  await expect(page.locator('#all-days-map')).toContainText('弘大');
  await expect(page.locator('#all-days-map')).toContainText('雪具');
  await expect(page.locator('#map-preview')).toBeHidden();
});

test('places filter, hotel scope and honest exact-date flight conditions are present', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.copiedQuery = text; } }, configurable: true }));
  await page.goto('./');
  await page.getByRole('tab', { name: '吃買清單', exact: true }).click();
  await page.locator('[data-place-filter="snow"]').click();
  await expect(page.locator('.place-card:visible')).toHaveCount(4);
  await expect(page.locator('.place-card:visible').first()).toContainText('零售');
  await page.locator('[data-place-filter="beauty"]').click();
  await expect(page.locator('.place-card:visible')).toHaveCount(2);
  await page.getByRole('tab', { name: '飯店住宿', exact: true }).click();
  await expect(page.locator('#panel-hotels')).toContainText('NT$3,000');
  await expect(page.locator('#panel-hotels')).toContainText('未核實');
  await expect(page.locator('#panel-hotels')).not.toContainText('US$40');
  await page.getByRole('tab', { name: '機票比價', exact: true }).click();
  await expect(page.locator('#panel-flights')).toContainText('尚未取得');
  await expect(page.locator('#panel-flights')).not.toContainText('US$329');
  const searches = await page.locator('a[data-flight-search]').evaluateAll(nodes => nodes.map(n => n.href));
  expect(searches.length).toBe(2);
  expect(searches.every(href => !href.includes('#flt='))).toBe(true);
  const scopes = await page.locator('a[data-flight-search]').evaluateAll(nodes => nodes.map(n => [n.dataset.departure, n.dataset.return]));
  expect(scopes).toEqual([['2026-12-03', '2026-12-07'], ['2026-12-10', '2026-12-14']]);
  await page.locator('[data-copy-flight="2026-12-03"]').click();
  const copied = await page.evaluate(() => window.copiedQuery);
  expect(copied).toContain('TPE→ICN 2026-12-03');
  expect(copied).toContain('ICN→TPE 2026-12-07');
  await expect(page.locator('#panel-flights')).toContainText('手動輸入');
});

test('checklist migrates original IDs, saves changes and honors reset cancellation', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('seoul-trip-todos-v1', JSON.stringify({ dates: true, hotel: true }));
      sessionStorage.setItem('seeded', 'yes');
    }
  });
  await page.goto('./');
  await page.getByRole('tab', { name: '待辦清單', exact: true }).click();
  await expect(page.locator('.todo-check')).toHaveCount(10);
  await expect(page.locator('#todo-progress-label')).toContainText('2 / 10');
  await page.locator('[data-todo-id="flight"]').check();
  await page.reload();
  await page.getByRole('tab', { name: '待辦清單', exact: true }).click();
  await expect(page.locator('[data-todo-id="flight"]')).toBeChecked();
  await expect(page.locator('#todo-progress-label')).toContainText('3 / 10');
  await page.locator('[data-todo-filter="open"]').click();
  await expect(page.locator('.todo-item:visible')).toHaveCount(7);
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('#todo-reset').click();
  await expect(page.locator('#todo-progress-label')).toContainText('3 / 10');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#todo-reset').click();
  await expect(page.locator('#todo-progress-label')).toContainText('0 / 10');
});

test('tab keyboard navigation and mobile layout are usable', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('tab', { name: '行程總覽', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: '地圖導航', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: '待辦清單', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: '行程總覽', exact: true })).toBeFocused();
  for (const name of tabNames) {
    await page.getByRole('tab', { name, exact: true }).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    expect(overflow, `${name} must not cause page overflow`).toBe(false);
  }
});
