const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.route('https://www.google.com/maps?**', route => route.fulfill({ contentType: 'text/html', body: '<html lang="en"><title>Maps isolated</title><body>External map isolated</body></html>' }));
});

test('Toyoko location comparison: four exact branches, five-day fit and separate freshness', async ({ page }, testInfo) => {
  await page.goto('./#hotels');
  const section = page.locator('#toyoko-location-comparison');
  await expect(section).toBeVisible();
  const cards = section.locator('[data-toyoko-hotel]');
  await expect(cards).toHaveCount(4);
  expect(await cards.evaluateAll(nodes => nodes.map(n => n.dataset.toyokoHotel))).toEqual(['00291', '00208', '00311', '00282']);
  const expected = [['00291', '325'], ['00208', '337'], ['00311', '293'], ['00282', '323']];
  for (const [id, address] of expected) {
    const card = section.locator(`[data-toyoko-hotel="${id}"]`);
    await expect(card).toContainText(address);
    const url = new URL(await card.locator('[data-toyoko-map]').getAttribute('href'));
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/search/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('query')).toContain(address);
    const official = new URL(await card.locator('[data-toyoko-official]').getAttribute('href'));
    expect(official.hostname).toBe('www.toyoko-inn.com');
    expect(official.pathname).toContain('/' + id);
  }
  await expect(section.locator('[data-toyoko-day]')).toHaveCount(5);
  await expect(section).toContainText('2026-11-02');
  await expect(section).toContainText('沒有重新查價');
  await expect(section).toContainText('不代表已訂房');
  await expect(section).toContainText('1號出口電梯');
  await expect(section).toContainText('No.1幾乎同級');
  await expect(page.locator('#hotel-price-title')).toContainText('2026-10-18');
  await expect(page.locator('[data-hotel-rate]')).toHaveCount(10);
  for (const href of await section.locator('.citation').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')))) {
    await expect(page.locator(href)).toHaveCount(1);
  }
  await section.locator('[data-toyoko-hotel="00291"]').screenshot({ path: `qa-artifacts/toyoko-${testInfo.project.name}-primary.png` });
});

test('Toyoko location comparison never changes saved lodging, date or checklist choices', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('toyoko-seeded')) {
      localStorage.setItem('seoul-trip-preferences-v2', JSON.stringify({ date: '2026-12-03', base: 'myeongdong', snow: 'ski' }));
      localStorage.setItem('seoul-trip-todos-v1', JSON.stringify({ hotel: true }));
      sessionStorage.setItem('toyoko-seeded', 'yes');
    }
  });
  await page.goto('./#hotels');
  await expect(page.locator('#toyoko-location-comparison')).toBeVisible();
  await expect(page.locator('#stay-area')).toHaveValue('myeongdong');
  await page.locator('#date-option').selectOption('2026-12-10');
  await expect(page.locator('[data-toyoko-hotel]')).toHaveCount(4);
  await page.reload();
  await expect(page.locator('#stay-area')).toHaveValue('myeongdong');
  await expect(page.locator('#date-option')).toHaveValue('2026-12-10');
  await page.getByRole('tab', { name: '待辦清單', exact: true }).click();
  await expect(page.locator('[data-todo-id="hotel"]')).toBeChecked();
  expect(await page.getByRole('tab').count()).toBe(6);
});
