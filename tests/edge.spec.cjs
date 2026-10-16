const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs/promises');
const tabs = ['行程總覽', '地圖導航', '吃買清單', '飯店住宿', '機票比價', '待辦清單'];

test.beforeEach(async ({ page }) => {
  await page.route('https://www.google.com/maps?**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Isolated Maps fixture</title><body>External map isolated for browser integration tests.</body></html>' }));
});

test('round two: deep links and legacy section URLs open the intended panel', async ({ page }) => {
  await page.goto('./#flights');
  await expect(page.locator('#panel-flights')).toBeVisible();
  await page.getByRole('tab', { name: '待辦清單', exact: true }).click();
  await expect(page).toHaveURL(/#todos$/);
  await page.reload();
  await expect(page.locator('#panel-todos')).toBeVisible();
  await page.goto('./#map-day-4');
  await expect(page.locator('#map-day-title')).toContainText('DAY 4');
  await page.goto('./#snowgear');
  await expect(page.locator('#panel-places')).toBeVisible();
  await expect(page.locator('.place-card:visible')).toHaveCount(4);
  await page.goto('./#oliveyoung');
  await expect(page.locator('.place-card:visible')).toHaveCount(2);
});

test('round two: denied storage leaves usable checkboxes and a visible warning', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Denied', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Denied', 'SecurityError'); };
  });
  await page.goto('./');
  await page.getByRole('tab', { name: '待辦清單', exact: true }).click();
  await page.locator('[data-todo-id="dates"]').check();
  await expect(page.locator('#todo-progress-label')).toContainText('1 / 10');
  await expect(page.locator('#storage-notice')).toBeVisible();
  await expect(page.locator('#storage-notice')).toContainText('無法保存');
  expect(errors).toEqual([]);
});

test('round two: corrupt saved data does not crash or silently replace the old file', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('seoul-trip-todos-v1', '{broken-json'));
  await page.goto('./');
  await page.getByRole('tab', { name: '待辦清單', exact: true }).click();
  await expect(page.locator('#todo-progress-label')).toContainText('0 / 10');
  await expect(page.locator('#storage-notice')).toContainText('損毀');
  expect(await page.evaluate(() => localStorage.getItem('seoul-trip-todos-v1'))).toBe('{broken-json');
});

test('round two: cancelling native sharing never causes an unhandled rejection', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(navigator, 'share', { value: async () => { throw new DOMException('Cancelled', 'AbortError'); }, configurable: true }));
  await page.goto('./');
  await page.locator('#share-trip').click();
  await expect(page.locator('#app-status')).toContainText('取消');
  expect(errors).toEqual([]);
});

test('round two: blocked clipboard has a manual-copy dialog with the stable URL', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new DOMException('Denied', 'NotAllowedError'); } }, configurable: true });
  });
  await page.goto('./');
  await page.locator('#share-trip').click();
  await expect(page.locator('#share-link-dialog')).toBeVisible();
  await expect(page.locator('#share-link-input')).toHaveValue('https://houseyen.github.io/seoul-dec-2026-trip/');
  await page.keyboard.press('Escape');
  await expect(page.locator('#share-link-dialog')).toBeHidden();
  await page.getByRole('tab', { name: '機票比價', exact: true }).click();
  await page.locator('[data-copy-flight="2026-12-10"]').click();
  await expect(page.locator('#share-link-dialog')).toBeVisible();
  await expect(page.locator('#share-link-input')).toHaveValue(/TPE→ICN 2026-12-10.*ICN→TPE 2026-12-14/);
});

test('round two: backup export, invalid import and confirmed restore preserve the exact ten IDs', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('tab', { name: '待辦清單', exact: true }).click();
  await page.locator('[data-todo-id="flight"]').check();
  const pendingDownload = page.waitForEvent('download');
  await page.locator('#todo-export').click();
  const download = await pendingDownload;
  const backup = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  expect(backup.app).toBe('seoul-dec-2026-trip');
  expect(backup.schemaVersion).toBe(1);
  expect(backup.todos.flight).toBe(true);
  expect(Object.keys(backup.todos)).toHaveLength(10);
  await page.locator('#todo-import').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ ...backup, todos: { ...backup.todos, flight: 'yes' } })) });
  await expect(page.locator('#app-status')).toContainText('無法匯入');
  await expect(page.locator('[data-todo-id="flight"]')).toBeChecked();
  const restored = { ...backup, todos: Object.fromEntries(Object.keys(backup.todos).map(key => [key, key === 'hotel'])), preferences: { date: '2026-12-10', base: 'dongdaemun', snow: 'ski' } };
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#todo-import').setInputFiles({ name: 'restore.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(restored)) });
  await expect(page.locator('[data-todo-id="hotel"]')).toBeChecked();
  await expect(page.locator('[data-todo-id="flight"]')).not.toBeChecked();
  await expect(page.locator('#date-option')).toHaveValue('2026-12-10');
  await expect(page.locator('#todo-progress-label')).toContainText('1 / 10');
});

test('round two: ski choice and optional stops update exact segment endpoints', async ({ page }) => {
  await page.goto('./#map-day-4');
  await page.locator('#snow-plan').selectOption('ski');
  let urls = await page.locator('#map-segments a[data-segment-link]').evaluateAll(nodes => nodes.map(a => decodeURIComponent(a.href)));
  expect(urls.some(url => url.includes('540'))).toBe(true);
  expect(urls.some(url => url.includes('622'))).toBe(false);
  await expect(page.locator('#map-segments')).not.toContainText('鷺梁津');
  await page.locator('#include-optional').check();
  await expect(page.locator('#map-segments')).toContainText('鷺梁津');
  await page.locator('[data-map-day="2"]').click();
  await expect(page.locator('#map-segments')).toContainText('SPAREX');
  await page.locator('#include-optional').uncheck();
  await expect(page.locator('#map-segments')).not.toContainText('SPAREX');
});

test('round two: printing includes all days and tasks without changing active state', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('tab', { name: '待辦清單', exact: true }).click();
  await page.locator('[data-todo-id="dates"]').check();
  await page.locator('[data-todo-filter="done"]').click();
  await expect(page.locator('.todo-item:visible')).toHaveCount(1);
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('[role="tabpanel"]:visible')).toHaveCount(6);
  await expect(page.locator('.todo-item:visible')).toHaveCount(10);
  await expect(page.locator('#all-days-map .all-day-card:visible')).toHaveCount(5);
  await expect(page.locator('#google-map')).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  await expect(page.locator('[role="tabpanel"]:visible')).toHaveCount(1);
  await expect(page.locator('#panel-todos')).toBeVisible();
  await expect(page.locator('.todo-item:visible')).toHaveCount(1);
});

test('round two: sticky navigation reveals the next heading and malformed hashes are harmless', async ({ page }) => {
  await page.goto('./');
  await page.locator('#backup-title').scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: '待辦清單', exact: true }).click();
  const nav = await page.locator('.tab-bar').boundingBox();
  const heading = await page.locator('#panel-todos h2').boundingBox();
  expect(heading.y).toBeGreaterThanOrEqual(nav.y + nav.height);
  expect(heading.y).toBeLessThan(nav.y + nav.height + 160);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./#%');
  await expect(page.locator('#panel-itinerary')).toBeVisible();
  expect(errors).toEqual([]);
});

test('round two: six panels pass automated accessibility checks and visual snapshots', async ({ page }, testInfo) => {
  test.setTimeout(60000);
  await page.goto('./');
  for (const name of tabs) {
    await page.getByRole('tab', { name, exact: true }).click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('#google-map').analyze();
    expect(results.violations, `${name}: ${JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))}`).toEqual([]);
  }
  await page.getByRole('tab', { name: '行程總覽', exact: true }).click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `qa-artifacts/${process.env.QA_ROUND || 'latest'}-${testInfo.project.name}-itinerary.png`, fullPage: true });
  await page.getByRole('tab', { name: '待辦清單', exact: true }).click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `qa-artifacts/${process.env.QA_ROUND || 'latest'}-${testInfo.project.name}-todos.png`, fullPage: true });
});
