const { test, expect } = require('@playwright/test');

test('Главная страница открывается', async ({ page }) => {
  await page.goto('https://mraleksby.github.io/cashflow/');
  await expect(page).toHaveTitle(/Cashflow/);
});

test('Кликабельность основных кнопок и открытие форм', async ({ page }) => {
  await page.goto('https://mraleksby.github.io/cashflow/');
  await page.click('#main-buy-btn');
  await expect(page.locator('#main-buy-dropdown')).toBeVisible();
  await page.click('#main-sell-btn');
  await expect(page.locator('#main-sell-dropdown')).toBeVisible();
  await page.click('#main-action-btn');
  await expect(page.locator('#main-action-dropdown')).toBeVisible();
  await page.click('#payday-btn');
  await expect(page.locator('#cash-value')).toBeVisible();
  await page.click('#reset-cash-btn');
  // confirm не обрабатывается, но кнопка кликается
});
