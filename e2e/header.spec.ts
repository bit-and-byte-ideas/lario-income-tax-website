import { test, expect } from '@playwright/test';

test.describe('Header Icons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Facebook icon is present in the DOM and non-empty', async ({ page }) => {
    const facebookLink = page.locator('a[aria-label="Facebook"]');
    await expect(facebookLink).toBeAttached();
    // SVG paths must exist in the DOM regardless of viewport visibility
    const pathCount = await facebookLink.locator('svg path').count();
    expect(pathCount).toBeGreaterThan(0);
  });

  test('Instagram icon is present in the DOM and non-empty', async ({ page }) => {
    const instagramLink = page.locator('a[aria-label="Instagram"]');
    await expect(instagramLink).toBeAttached();
    const pathCount = await instagramLink.locator('svg path').count();
    expect(pathCount).toBeGreaterThan(0);
  });

  test('Facebook link points to an external URL', async ({ page }) => {
    const facebookLink = page.locator('a[aria-label="Facebook"]');
    const href = await facebookLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).not.toBe('#');
  });

  test('Instagram link points to an external URL', async ({ page }) => {
    const instagramLink = page.locator('a[aria-label="Instagram"]');
    const href = await instagramLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).not.toBe('#');
  });
});

test.describe('Language Switcher', () => {
  test('renders flag images (not emoji text)', async ({ page }) => {
    await page.goto('/');
    const flagImages = page.locator('app-language-switcher img.flag-icon');
    await expect(flagImages).toHaveCount(2);
    // Verify each flag is an <img> with a real src, not emoji text
    for (let i = 0; i < 2; i++) {
      const src = await flagImages.nth(i).getAttribute('src');
      expect(src).toMatch(/\.(svg|png|avif|webp)$/i);
    }
  });

  test('clicking the Spanish flag navigates to /es/', async ({ page }) => {
    await page.goto('/');
    const spanishFlag = page.locator('app-language-switcher img[alt="Español"]');
    await spanishFlag.click();
    await expect(page).toHaveURL(/\/es\//);
  });

  test('clicking the English flag navigates back to /', async ({ page }) => {
    await page.goto('/es/');
    const englishFlag = page.locator('app-language-switcher img[alt="English"]');
    await englishFlag.click();
    await expect(page).toHaveURL(/^https?:\/\/[^/]+\/$/);
  });
});
