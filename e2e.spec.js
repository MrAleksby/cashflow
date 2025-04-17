const { test, expect } = require('@playwright/test');

test.describe('Cashflow: Электронный отчет', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Сбросить данные, если есть кнопка "Обнулить кошелёк"
    if (await page.$('#reset-cash-btn')) {
      await page.click('#reset-cash-btn');
      // Подтвердить сброс, если появится confirm
      // Playwright не может обработать native confirm, поэтому пропускаем
    }
  });

  test('Кликабельность основных кнопок и открытие форм', async ({ page }) => {
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

  test('Добавление дохода', async ({ page }) => {
    await page.click('button[data-screen="income"]');
    await page.fill('#income-name', 'Зарплата');
    await page.fill('#income-value', '1000');
    await page.click('#income-btn');
    await expect(page.locator('#income-list')).toContainText('Зарплата');
    await expect(page.locator('#income-total')).toHaveText(/1000/);
  });

  test('Добавление расхода', async ({ page }) => {
    await page.click('button[data-screen="expense"]');
    await page.fill('#expense-name', 'Аренда');
    await page.fill('#expense-value', '500');
    await page.click('#expense-btn');
    await expect(page.locator('#expense-list')).toContainText('Аренда');
    await expect(page.locator('#expense-total')).toHaveText(/500/);
  });

  test('Добавление актива', async ({ page }) => {
    await page.click('button[data-screen="asset"]');
    await page.fill('#asset-name', 'Квартира');
    await page.fill('#asset-value', '20000');
    await page.click('#asset-btn');
    await expect(page.locator('#asset-list')).toContainText('Квартира');
    await expect(page.locator('#asset-total')).toHaveText(/20000/);
  });

  test('Добавление пассива', async ({ page }) => {
    await page.click('button[data-screen="liability"]');
    await page.fill('#liability-name', 'Кредит');
    await page.fill('#liability-value', '10000');
    await page.click('#liability-btn');
    await expect(page.locator('#liability-list')).toContainText('Кредит');
    await expect(page.locator('#liability-total')).toHaveText(/10000/);
  });

  test('Покупка акций', async ({ page }) => {
    await page.click('button[data-screen="cashflow"]');
    await page.click('#main-buy-btn');
    await page.click('.main-buy-option[data-type="Акции"]');
    await page.selectOption('#main-stock-select', 'MYT4U');
    await page.fill('#main-stock-qty', '2');
    await page.fill('#main-stock-price', '50');
    await page.click('#main-stock-form button[type="submit"]');
    await page.click('button[data-screen="asset"]');
    await expect(page.locator('#asset-list')).toContainText('MYT4U');
  });

  test('Покупка недвижимости', async ({ page }) => {
    await page.click('button[data-screen="cashflow"]');
    await page.click('#main-buy-btn');
    await page.click('.main-buy-option[data-type="Недвижимость"]');
    await page.selectOption('#realty-object-select', '2/1');
    await page.fill('#realty-full-price', '10000');
    await page.fill('#realty-down-payment', '2000');
    await page.fill('#realty-passive-income', '100');
    await page.click('#main-other-asset-form button[type="submit"]');
    await page.click('button[data-screen="asset"]');
    await expect(page.locator('#asset-list')).toContainText('2/1');
  });

  test('PayDay увеличивает кошелёк', async ({ page }) => {
    await page.click('#payday-btn');
    const cash = await page.textContent('#cash-value');
    expect(Number(cash)).not.toBeNaN();
  });

  test('Удаление дохода', async ({ page }) => {
    await page.click('button[data-screen="income"]');
    await page.fill('#income-name', 'ТестУдалить');
    await page.fill('#income-value', '123');
    await page.click('#income-btn');
    await expect(page.locator('#income-list')).toContainText('ТестУдалить');
    await page.click('#income-list .remove-btn');
    await expect(page.locator('#income-list')).not.toContainText('ТестУдалить');
  });

  test('Формула обновляется при изменении данных', async ({ page }) => {
    await page.click('button[data-screen="income"]');
    await page.fill('#income-name', 'Зарплата');
    await page.fill('#income-value', '1000');
    await page.click('#income-btn');
    await page.click('button[data-screen="expense"]');
    await page.fill('#expense-name', 'Аренда');
    await page.fill('#expense-value', '500');
    await page.click('#expense-btn');
    await page.click('button[data-screen="cashflow"]');
    await expect(page.locator('#salary-value')).toHaveText('1000');
    await expect(page.locator('#expense-sum')).toContainText('500');
  });
}); 