import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('Home nav link is active on home page', async ({ page }) => {
    await page.goto('/');
    const homeButton = page.locator('nav.main-nav button', { hasText: 'Home' });
    await expect(homeButton).toHaveClass(/active-link/);
  });

  test('Services nav link is active on services page', async ({ page }) => {
    await page.goto('/services');
    const servicesButton = page.locator('nav.main-nav button', { hasText: 'Services' });
    await expect(servicesButton).toHaveClass(/active-link/);
  });

  test('Contact nav link is active on contact page', async ({ page }) => {
    await page.goto('/contact');
    const contactButton = page.locator('nav.main-nav button', { hasText: 'Contact' });
    await expect(contactButton).toHaveClass(/active-link/);
  });

  test('Inactive nav links do not have active-link class', async ({ page }) => {
    await page.goto('/');
    const servicesButton = page.locator('nav.main-nav button', { hasText: 'Services' });
    const contactButton = page.locator('nav.main-nav button', { hasText: 'Contact' });
    await expect(servicesButton).not.toHaveClass(/active-link/);
    await expect(contactButton).not.toHaveClass(/active-link/);
  });

  test('Clicking Services nav link navigates to /services', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav.main-nav button', { hasText: 'Services' }).click();
    await expect(page).toHaveURL(/\/services$/);
  });

  test('Clicking Contact nav link navigates to /contact', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav.main-nav button', { hasText: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test('Clicking Home nav link navigates to /', async ({ page }) => {
    await page.goto('/contact');
    await page.locator('nav.main-nav button', { hasText: 'Home' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
