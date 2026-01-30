import { test, expect } from '@playwright/test';

test.describe('Core Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');

    // Page should have Tamarque in title
    await expect(page).toHaveTitle(/Tamarque/i);

    // Main content should exist
    await expect(page.locator('#main-content')).toBeAttached();
  });

  test('shop page is accessible', async ({ page }) => {
    const response = await page.goto('/shop');

    // Page should load successfully (2xx or 3xx status)
    expect(response?.status()).toBeLessThan(400);
  });

  test('about page is accessible', async ({ page }) => {
    const response = await page.goto('/about');

    expect(response?.status()).toBeLessThan(400);
  });

  test('blog page is accessible', async ({ page }) => {
    const response = await page.goto('/blog');

    expect(response?.status()).toBeLessThan(400);
  });

  test('subscribe page is accessible', async ({ page }) => {
    const response = await page.goto('/subscribe');

    expect(response?.status()).toBeLessThan(400);
  });
});

test.describe('SEO', () => {
  test('homepage has required meta tags', async ({ page }) => {
    await page.goto('/');

    // Check meta description exists
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);

    // Check Open Graph title
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });

  test('pages have French language attribute', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'fr');
  });

  test('skip link is present for accessibility', async ({ page }) => {
    await page.goto('/');

    // Skip link should exist (even if visually hidden)
    const skipLink = page.locator('a[href="#main-content"], .skip-link');
    await expect(skipLink).toBeAttached();
  });
});

test.describe('Responsive', () => {
  test('mobile viewport renders without errors', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const response = await page.goto('/');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });

  test('tablet viewport renders without errors', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const response = await page.goto('/');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });

  test('desktop viewport renders without errors', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const response = await page.goto('/');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('homepage loads within 10 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    // Generous timeout for CI environments
    expect(loadTime).toBeLessThan(10000);
  });
});

test.describe('Error Handling', () => {
  test('non-existent page returns 404', async ({ page }) => {
    const response = await page.goto('/this-page-definitely-does-not-exist-12345');

    // Should return 404 status
    expect(response?.status()).toBe(404);
  });
});
