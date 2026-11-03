const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.route('https://www.google.com/maps?**', route => route.fulfill({ contentType: 'text/html', body: '<html lang="en"><title>Maps isolated</title><body>External Maps isolated</body></html>' }));
});

test('price audit: selected exact-date itineraries are observations, not confirmed checkouts', async ({ page }) => {
  await page.goto('./#flights');
  await page.locator('#flight-price-history summary').click();
  const cards = page.locator('[data-flight-quote]');
  await expect(cards).toHaveCount(3);
  for (const amount of ['9,736', '13,567', '10,124']) await expect(page.locator('#flight-price-audit')).toContainText('NT$' + amount);
  for (const card of await cards.all()) {
    await expect(card).toContainText('未復價');
    await expect(card).toContainText('首件托運免費');
    await expect(card.locator('a[data-price-source]')).toHaveAttribute('href', /^https:\/\/www\.google\.com\/travel\/flights\/booking\?/);
  }
  await expect(page.locator('#flight-price-audit')).toContainText('05:00');
  await expect(page.locator('#flight-price-audit')).toContainText('23 kg');
  await expect(page.locator('#flight-price-audit')).not.toContainText('10,821');
  await expect(page.locator('#flight-price-audit')).not.toContainText('10,473');
});

test('price audit: six original hotel cases retain missing prices and over-cap evidence', async ({ page }) => {
  await page.goto('./#hotels');
  await page.locator('#hotel-price-history summary').click();
  const original = page.locator('[data-hotel-rate][data-hotel-origin="original"]');
  await expect(original).toHaveCount(6);
  await expect(original.filter({ has: page.locator('[data-budget-state="unknown"]') })).toHaveCount(4);
  await expect(original.filter({ has: page.locator('[data-budget-state="over-cap-estimate"]') })).toHaveCount(2);
  for (const card of await original.filter({ has: page.locator('[data-budget-state="unknown"]') }).all()) {
    await expect(card).toContainText('不是所有通路售罄');
    await expect(card.locator('[data-hotel-total]')).toContainText('未取得');
  }
  await expect(page.locator('#hotel-price-audit')).toContainText('655,556');
  await expect(page.locator('#hotel-price-audit')).toContainText('564,894');
  const taxAmounts = await page.evaluate(() => window.TRIP_PRICES.hotels.filter(h => h.origin === 'original' && Number.isFinite(h.taxes_and_fees_total)).map(h => h.taxes_and_fees_total));
  for (const amount of taxAmounts) await expect(page.locator('#hotel-price-audit')).toContainText(amount.toLocaleString('en-US'));
  await expect(page.locator('#hotel-price-audit')).toContainText('Early Bird');
  await expect(page.locator('#hotel-price-audit')).toContainText('未稅');
  await expect(page.locator('#hotel-price-audit')).toContainText('估值');
  await expect(page.locator('#hotel-price-audit')).toContainText('未自行分攤');
});

test('price audit: historical snapshots remain complete, collapsed and never become current quotes', async ({ page }) => {
  await page.goto('./#flights');
  await expect(page.locator('#date-option')).toBeDisabled();
  await expect(page.locator('[data-flight-quote]')).toHaveCount(3);
  await expect(page.locator('[data-flight-quote]:visible')).toHaveCount(0);
  await expect(page.locator('#flight-price-summary')).toContainText('12/10–13 尚待重查');
  await page.locator('#flight-price-history summary').click();
  await expect(page.locator('[data-flight-quote]:visible')).toHaveCount(3);
  await expect(page.locator('#flight-price-filter')).toContainText('12/10–14');
  await expect(page.locator('#flight-price-filter')).toContainText('不適用');
  await page.reload();
  await expect(page.locator('[data-flight-quote]:visible')).toHaveCount(0);
  await page.locator('#tab-hotels').click();
  await expect(page.locator('[data-hotel-rate]')).toHaveCount(10);
  await expect(page.locator('[data-hotel-rate]:visible')).toHaveCount(0);
  await page.locator('#hotel-price-history summary').click();
  await expect(page.locator('[data-hotel-rate]:visible')).toHaveCount(10);
  await expect(page.locator('#hotel-price-filter')).toContainText('4 晚');
});

test('price audit: four alternative hotel cases stay out of budget recommendations', async ({ page }) => {
  await page.goto('./#hotels');
  await page.locator('#hotel-price-history summary').click();
  const alternative = page.locator('[data-hotel-rate][data-hotel-origin="alternative"]');
  await expect(alternative).toHaveCount(4);
  await expect(alternative.filter({ has: page.locator('[data-budget-state="over-cap-total-estimate"]') })).toHaveCount(2);
  await expect(alternative.filter({ has: page.locator('[data-budget-state="unknown"]') })).toHaveCount(2);
  await expect(page.locator('#hotel-price-status')).toContainText('0 筆已核實預算內');
  await expect(page.locator('#hotel-price-status')).toContainText('舊四晚價格不沿用');
  await expect(page.locator('#hotel-price-audit')).toContainText('逐晚拆價未取得');
  for (const amount of ['749,700', '637,200']) await expect(page.locator('#hotel-price-audit')).toContainText(amount);
  for (const card of await alternative.all()) {
    await expect(card).not.toContainText('NT$0');
    await expect(card).toContainText('未取得');
  }
  const values = await page.evaluate(() => ({ status: window.TRIP_PRICES.alternativeResearchStatus, rows: window.TRIP_PRICES.hotels.filter(h => h.origin === 'alternative'), fx: window.TRIP_PRICES.exchangeRate.twd_per_krw }));
  expect(values.status).toBe('completed_with_gaps');
  expect(values.rows.every(h => h.nightly_amounts.length === 4 && h.nightly_amounts.every(n => n.amount === null))).toBe(true);
  expect(values.fx).toBe(0.02433396);
});

test('price audit: blocked official fare checks never acquire invented exact-date amounts', async ({ page }) => {
  await page.goto('./#flights');
  await page.locator('#flight-price-history summary').click();
  await expect(page.locator('[data-airline-check]')).toHaveCount(4);
  await expect(page.locator('#airline-check-cards')).toContainText('Access Denied');
  const official = await page.evaluate(() => window.TRIP_PRICES.officialChecks);
  expect(official).toHaveLength(4);
  expect(official.every(r => r.total_amount === null)).toBe(true);
  expect(official.every(r => r.references.every(ref => ref.return_date !== r.return_date && ref.is_exact_quote === false))).toBe(true);
  await expect(page.locator('#airline-check-cards [data-quote-price]')).toHaveCount(0);
});