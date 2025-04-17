const { test, expect } = require('@playwright/test');

test('Главная страница открывается', async ({ page }) => {
  await page.goto('https://mraleksby.github.io/cashflow/');
  await expect(page).toHaveTitle(/Cashflow/);
});
