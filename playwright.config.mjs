import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: { timeout: 8000, toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{name:'chromium',use:{browserName:'chromium',channel:'chromium'}},{name:'firefox',use:{browserName:'firefox'}},{name:'webkit',use:{browserName:'webkit'}}],
  webServer: { command: 'node scripts/serve-static.mjs', url:'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI, timeout:15000 },
});


