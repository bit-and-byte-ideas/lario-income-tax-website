import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero section', async ({ page }) => {
    await expect(page.locator('.hero')).toBeVisible();
  });

  test('hero section fills the viewport height', async ({ page }) => {
    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();
    const viewportHeight = page.viewportSize()?.height ?? 0;
    expect(heroBox?.height).toBeGreaterThanOrEqual(viewportHeight * 0.9);
  });

  test('services section has a heading', async ({ page }) => {
    const heading = page.locator('.services-overview-heading');
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();
  });

  test('services section renders 3 featured service cards', async ({ page }) => {
    const cards = page.locator('.services-grid .service-card');
    await expect(cards).toHaveCount(3);
  });

  test('service cards navigate to the correct detail page', async ({ page }) => {
    const firstCard = page.locator('.services-grid .service-card').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/services\/.+/);
  });

  test('all service cards have images', async ({ page }) => {
    // Wait for at least one card to be visible before counting images
    await expect(page.locator('.services-grid .service-card').first()).toBeVisible();
    const images = page.locator('.services-grid .service-card img');
    await expect(images.first()).toBeVisible();
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('src', /.+/);
    }
  });
});
