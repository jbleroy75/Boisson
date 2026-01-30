import { test, expect } from '@playwright/test';

test.describe('Core Pages', () => {
  test('homepage loads', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/Tamarque/i);
  });

  test('shop page loads', async ({ page }) => {
    const response = await page.goto('/shop');
    expect(response?.status()).toBeLessThan(400);
  });

  test('about page loads', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBeLessThan(400);
  });

  test('contact page loads', async ({ page }) => {
    const response = await page.goto('/contact');
    expect(response?.status()).toBeLessThan(400);
  });
});

test.describe('SEO Basics', () => {
  test('homepage has meta description', async ({ page }) => {
    await page.goto('/');
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });

  test('page has French language', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'fr');
  });
});
