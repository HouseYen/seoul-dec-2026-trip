const { test, expect } = require('@playwright/test');
test('release assets share the confirmed-date revision and refreshed social image', async ({ page }) => {
  await page.route('https://www.google.com/maps?**', route => route.fulfill({ contentType: 'text/html', body: '<html lang="en"><title>Maps isolated</title><body>Maps isolated</body></html>' }));
  await page.goto('./');
  const assets = await page.locator('script[src], link[rel="stylesheet"]').evaluateAll(nodes => nodes.map(n => new URL(n.src || n.href)).filter(u => /\/(app\.js|trip-data\.js|price-data\.js|hotel-options\.js|styles\.css)$/.test(u.pathname)).map(u => ({path:u.pathname,version:u.searchParams.get('v')})));
  expect(assets).toHaveLength(5);
  expect(assets.every(a => a.version === '3.1')).toBe(true);
  const image = new URL(await page.locator('meta[property="og:image"]').getAttribute('content'), page.url());
  expect(image.pathname).toMatch(/social-card\.png$/);
  expect(image.searchParams.get('v')).toBe('3.1');
});
