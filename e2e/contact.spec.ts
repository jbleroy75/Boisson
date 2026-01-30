import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('contact page loads', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Contactez-nous');
    await expect(page.locator('form')).toBeVisible();
  });

  test('shows validation errors for empty form', async ({ page }) => {
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Le nom doit contenir')).toBeVisible();
    await expect(page.locator('text=Adresse email invalide')).toBeVisible();
  });

  test('shows validation error for invalid email', async ({ page }) => {
    await page.fill('#name', 'Jean Dupont');
    await page.fill('#email', 'invalid-email');
    await page.fill('#subject', 'Test subject');
    await page.fill('#message', 'This is a test message that is long enough.');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Adresse email invalide')).toBeVisible();
  });

  test('can fill and submit contact form', async ({ page }) => {
    await page.fill('#name', 'Jean Dupont');
    await page.fill('#email', 'jean@example.com');
    await page.fill('#subject', 'Question sur les produits');
    await page.fill('#message', 'Bonjour, je souhaite en savoir plus sur vos boissons protéinées.');

    // Mock the API response
    await page.route('/api/contact', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('text=Message envoyé')).toBeVisible();
  });

  test('contact info is displayed', async ({ page }) => {
    await expect(page.locator('text=contact@tamarque.com')).toBeVisible();
    await expect(page.locator('text=Instagram')).toBeVisible();
    await expect(page.locator('text=TikTok')).toBeVisible();
  });
});

test.describe('FAQ Page', () => {
  test('FAQ page loads with categories', async ({ page }) => {
    await page.goto('/faq');

    await expect(page.locator('h1')).toContainText('Questions Fréquentes');
    await expect(page.locator('text=Produits')).toBeVisible();
    await expect(page.locator('text=Commandes')).toBeVisible();
    await expect(page.locator('text=Abonnements')).toBeVisible();
  });

  test('can expand and collapse FAQ items', async ({ page }) => {
    await page.goto('/faq');

    // Find first question button
    const firstQuestion = page.locator('button:has-text("composition")').first();
    await firstQuestion.click();

    // Answer should be visible
    await expect(page.locator('text=20g de protéines')).toBeVisible();

    // Click again to collapse
    await firstQuestion.click();

    // Answer should be hidden
    await expect(page.locator('text=20g de protéines')).not.toBeVisible();
  });
});
