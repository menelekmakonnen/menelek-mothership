import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests',
  snapshotDir: './playwright/snapshots',
  timeout: 60 * 1000,
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
  ],
  webServer: {
    command: 'npm run dev -- --hostname 0.0.0.0 --port 3000',
    url: 'http://127.0.0.1:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
