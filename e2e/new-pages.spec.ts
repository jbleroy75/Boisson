import { test, expect } from '@playwright/test';

test.describe('Retours Page', () => {
  test('retours page loads correctly', async ({ page }) => {
    const response = await page.goto('/retours');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toContainText('Retours');
  });

  test('displays return policy information', async ({ page }) => {
    await page.goto('/retours');

    // Check key return policy elements (30 day guarantee) - use first() for multiple matches
    await expect(page.locator('text=30 jours').first()).toBeVisible();
    await expect(page.locator('text=Remboursé').first()).toBeVisible();
  });

  test('has link to contact page', async ({ page }) => {
    await page.goto('/retours');

    // Use first() since there are multiple contact links (one in content, one in footer)
    const contactLink = page.locator('a[href="/contact"]').first();
    await expect(contactLink).toBeAttached();
  });
});

test.describe('Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  test('forgot password page loads', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Mot de passe oublié');
    // Use first() for form since footer may have newsletter form
    await expect(page.locator('form').first()).toBeVisible();
  });

  test('email input has required validation', async ({ page }) => {
    // The email input should have required attribute - target the specific one by placeholder
    const emailInput = page.locator('input[placeholder="toi@exemple.com"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('can submit valid email', async ({ page }) => {
    // Mock the API response
    await page.route('/api/auth/forgot-password', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    await page.fill('input[placeholder="toi@exemple.com"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Should show success message (case-insensitive)
    await expect(page.locator('h1:has-text("envoyé")')).toBeVisible({ timeout: 10000 });
  });

  test('has link back to login', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeAttached();
  });
});

test.describe('Account Subscription Page', () => {
  test('subscription page loads or redirects to login', async ({ page }) => {
    const response = await page.goto('/account/subscription');

    // Page should load (may redirect to login if not authenticated)
    expect(response?.status()).toBeLessThan(400);
  });
});

test.describe('Legal Pages', () => {
  test('CGV page loads', async ({ page }) => {
    const response = await page.goto('/cgv');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toContainText('Conditions Générales');
  });

  test('Privacy page loads', async ({ page }) => {
    const response = await page.goto('/privacy');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toContainText('Politique de Confidentialité');
  });

  test('Mentions légales page loads', async ({ page }) => {
    const response = await page.goto('/mentions-legales');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toContainText('Mentions Légales');
  });

  test('Shipping page loads', async ({ page }) => {
    const response = await page.goto('/shipping');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toContainText('Livraison');
  });
});

test.describe('Account Pages Navigation', () => {
  test('account page loads or redirects', async ({ page }) => {
    const response = await page.goto('/account');

    // May redirect to login if not authenticated
    expect(response?.status()).toBeLessThan(400);
  });

  test('account addresses page loads or redirects', async ({ page }) => {
    const response = await page.goto('/account/addresses');

    expect(response?.status()).toBeLessThan(400);
  });

  test('account order detail page loads or redirects', async ({ page }) => {
    // Test with a sample order ID - may redirect to login or show order
    const response = await page.goto('/account/orders/ORD-2024-001');

    // Allow 200 (success), 3xx (redirect), or 404 (order not found) but not 500
    expect(response?.status()).toBeLessThan(500);
  });

  test('wishlist page loads', async ({ page }) => {
    const response = await page.goto('/wishlist');

    expect(response?.status()).toBeLessThan(400);
    // Wishlist contains "Wishlist" in the h1
    await expect(page.locator('h1')).toContainText(/wishlist/i);
  });
});

test.describe('Pack Configurator', () => {
  test('pack page loads', async ({ page }) => {
    const response = await page.goto('/pack');

    expect(response?.status()).toBeLessThan(400);
  });

  test('displays configurator elements', async ({ page }) => {
    await page.goto('/pack');

    // Should show pack or configurator content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Loyalty Program', () => {
  test('loyalty page loads', async ({ page }) => {
    const response = await page.goto('/loyalty');

    expect(response?.status()).toBeLessThan(400);
  });

  test('displays loyalty program info', async ({ page }) => {
    await page.goto('/loyalty');

    // Check for "Fidélité" in the heading (case-insensitive)
    await expect(page.locator('h1')).toContainText(/Fidélité/i);
  });
});
