import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('renders without error', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('404');
    await expect(page.locator('body')).not.toContainText('Error');
    await expect(page.locator('app-root')).toBeVisible();
  });

  test('has a call button with tel: href', async ({ page }) => {
    const callLink = page.locator('a[href^="tel:"]').first();
    await expect(callLink).toBeVisible();
    const href = await callLink.getAttribute('href');
    expect(href).toMatch(/^tel:/);
  });

  test('renders a Google Maps iframe', async ({ page }) => {
    const mapFrame = page.locator('.map-container iframe');
    await expect(mapFrame).toBeVisible();
  });
});
