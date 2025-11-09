import { test, expect } from '@playwright/test';

const hudLevels = ['minimal', 'standard', 'pro'];
const cameraModes = ['photo', 'portrait', 'night'];

for (const hud of hudLevels) {
  for (const mode of cameraModes) {
    test(`HUD ${hud} in ${mode} mode snapshot`, async ({ page }) => {
      await page.goto(`http://127.0.0.1:3000/?hud=${hud}&mode=${mode}`);
      await page.getByTestId('camera-app').waitFor();
      await page.waitForTimeout(250);
      await expect(page).toHaveScreenshot(`hud-${hud}-mode-${mode}.png`, {
        animations: 'disabled',
        fullPage: false,
        scale: 'css',
      });
    });
  }
}
