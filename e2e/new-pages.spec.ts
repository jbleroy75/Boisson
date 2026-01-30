import { test, expect } from '@playwright/test';

test.describe('Retours Page', () => {
  test('retours page loads correctly', async ({ page }) => {
    const response = await page.goto('/retours');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toContainText('Retours');
  });

  test('displays return policy information', async ({ page }) => {
    await page.goto('/retours');

    // Check key return policy elements
    await expect(page.locator('text=14 jours')).toBeVisible();
    await expect(page.locator('text=remboursement')).toBeVisible();
  });

  test('has link to contact page', async ({ page }) => {
    await page.goto('/retours');

    const contactLink = page.locator('a[href="/contact"]');
    await expect(contactLink).toBeAttached();
  });
});

test.describe('Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  test('forgot password page loads', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Mot de passe oublié');
    await expect(page.locator('form')).toBeVisible();
  });

  test('shows validation error for invalid email', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid-email');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Adresse email invalide')).toBeVisible();
  });

  test('can submit valid email', async ({ page }) => {
    // Mock the API response
    await page.route('/api/auth/forgot-password', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('text=email envoyé')).toBeVisible({ timeout: 10000 });
  });

  test('has link back to login', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeAttached();
  });
});

test.describe('Account Subscription Page', () => {
  test('subscription page loads', async ({ page }) => {
    const response = await page.goto('/account/subscription');

    expect(response?.status()).toBeLessThan(400);
  });

  test('displays subscription information', async ({ page }) => {
    await page.goto('/account/subscription');

    // Should show subscription details or no subscription message
    const hasSubscription = await page.locator('text=Abonnement actif').isVisible();
    const noSubscription = await page.locator('text=aucun abonnement').isVisible();

    expect(hasSubscription || noSubscription).toBeTruthy();
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
  test('account page loads', async ({ page }) => {
    const response = await page.goto('/account');

    expect(response?.status()).toBeLessThan(400);
  });

  test('account addresses page loads', async ({ page }) => {
    const response = await page.goto('/account/addresses');

    expect(response?.status()).toBeLessThan(400);
  });

  test('account orders page loads', async ({ page }) => {
    const response = await page.goto('/account/orders');

    expect(response?.status()).toBeLessThan(400);
  });

  test('wishlist page loads', async ({ page }) => {
    const response = await page.goto('/wishlist');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toContainText('Wishlist');
  });
});

test.describe('Pack Configurator', () => {
  test('pack page loads', async ({ page }) => {
    const response = await page.goto('/pack');

    expect(response?.status()).toBeLessThan(400);
  });

  test('displays flavor options', async ({ page }) => {
    await page.goto('/pack');

    // Should show flavor selection
    await expect(page.locator('text=Mango')).toBeVisible();
    await expect(page.locator('text=Dragon')).toBeVisible();
  });
});

test.describe('Loyalty Program', () => {
  test('loyalty page loads', async ({ page }) => {
    const response = await page.goto('/loyalty');

    expect(response?.status()).toBeLessThan(400);
  });

  test('displays loyalty program info', async ({ page }) => {
    await page.goto('/loyalty');

    await expect(page.locator('text=points')).toBeVisible();
  });
});
