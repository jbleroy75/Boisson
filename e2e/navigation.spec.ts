import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Tamarque/);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('can navigate to shop page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Produits');
    await expect(page).toHaveURL(/\/shop/);
    await expect(page.locator('h1')).toContainText(/Nos Produits|Shop|Boutique/i);
  });

  test('can navigate to pack configurator', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Composer un Pack');
    await expect(page).toHaveURL(/\/pack/);
  });

  test('can navigate to subscription page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Abonnement');
    await expect(page).toHaveURL(/\/subscribe/);
  });

  test('can navigate to loyalty page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Fidélité');
    await expect(page).toHaveURL(/\/loyalty/);
  });

  test('can navigate to blog page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Blog');
    await expect(page).toHaveURL(/\/blog/);
  });

  test('footer links work', async ({ page }) => {
    await page.goto('/');

    // Check CGV link
    await page.click('footer >> text=CGV');
    await expect(page).toHaveURL(/\/cgv/);

    // Go back and check mentions légales
    await page.goto('/');
    await page.click('footer >> text=Mentions Légales');
    await expect(page).toHaveURL(/\/mentions-legales/);
  });

  test('404 page displays for unknown routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=Page non trouvée')).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.goto('/');

    // Menu should be closed initially
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Click hamburger menu
    await page.click('[aria-label="Menu"]');

    // Menu should be visible
    await expect(mobileMenu).toBeVisible();

    // Click close button
    await page.click('[aria-label="Fermer le menu"]');

    // Menu should be hidden
    await expect(mobileMenu).not.toBeVisible();
  });

  test('can navigate via mobile menu', async ({ page }) => {
    await page.goto('/');

    await page.click('[aria-label="Menu"]');
    await page.click('[data-testid="mobile-menu"] >> text=Produits');

    await expect(page).toHaveURL(/\/shop/);
  });
});
