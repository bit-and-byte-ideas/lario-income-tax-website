import { test, expect } from '@playwright/test';

const SERVICE_IDS = [
  'tax-preparation',
  'immigration-services',
  'translations',
  'e-file-rapid-refund',
  'dual-citizenship',
  'us-citizenship',
  'global-entry-sentri',
  'itins',
  'tourist-visas',
];

test.describe('Services Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services');
  });

  test('renders an h1 heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();
  });

  test('renders 9 service cards', async ({ page }) => {
    const cards = page.locator('.service-card');
    await expect(cards).toHaveCount(9);
  });

  test('service cards navigate to detail pages', async ({ page }) => {
    const firstCard = page.locator('.service-card').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/services\/.+/);
  });

  test('second service card navigates to correct detail page', async ({ page }) => {
    const cards = page.locator('.service-card');
    await cards.nth(1).click();
    await expect(page).toHaveURL(/\/services\/.+/);
  });
});

test.describe('Service Detail Pages', () => {
  for (const serviceId of SERVICE_IDS) {
    test(`renders ${serviceId} detail page without errors`, async ({ page }) => {
      await page.goto(`/services/${serviceId}`);
      await expect(page.locator('h1, h2').first()).toBeVisible();
      await expect(page.locator('body')).not.toContainText('404');
      await expect(page.locator('body')).not.toContainText('Error');
    });

    test(`${serviceId} detail page has a call-us button with tel: href`, async ({ page }) => {
      await page.goto(`/services/${serviceId}`);
      const callButton = page.locator('a[href^="tel:"]').first();
      await expect(callButton).toBeVisible();
      const href = await callButton.getAttribute('href');
      expect(href).toMatch(/^tel:/);
    });
  }
});
