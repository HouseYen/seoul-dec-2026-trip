const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const audit = JSON.parse(fs.readFileSync('docs/current-hotels.json', 'utf8'));

test('confirmed-date hotel research is visible without inventing all-in rates', async ({ page }) => {
  await page.route('https://www.google.com/maps?**', route => route.fulfill({ contentType: 'text/html', body: '<title>Maps isolated</title>' }));
  await page.goto('./');
  await page.locator('#tab-hotels').click();
  await expect(page.locator('#hotel-current-rates article')).toHaveCount(6);
  await expect(page.locator('#hotel-price-status')).toContainText('6 筆');
  await expect(page.locator('#hotel-price-status')).toContainText('0 筆已核實預算內');
  await expect(page.locator('#hotel-price-status')).not.toContainText('沒有新日期可訂價');
  for (const record of audit.records) {
    const card = page.locator(`[data-current-hotel="${record.id}"]`);
    await expect(card).toContainText(record.hotel);
    await expect(card).toContainText(`NT$${record.displayed_average_before_tax_twd.toLocaleString('en-US')}`);
    await expect(card).toContainText('未稅');
    await expect(card).toContainText('逐晚含稅：未取得');
    await expect(card).toContainText('三晚含稅總額：未取得');
    await expect(card.locator('.card-links a')).toHaveCount(3);
  }
  await expect(page.locator('#hotel-price-history')).not.toHaveAttribute('open');
  await expect(page.locator('[data-current-hotel]')).toHaveCount(audit.records.length);
  await expect(page.locator('#source-list li[id="source-61"]')).toHaveCount(1);
});
