module.exports = {
  use: {
    baseURL: 'https://mraleksby.github.io/cashflow/',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  timeout: 60000,
  retries: 1,
}; 