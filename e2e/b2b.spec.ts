import { test, expect } from '@playwright/test';

test.describe('B2B Portal', () => {
  test.describe('B2B Homepage', () => {
    test('displays B2B portal landing page', async ({ page }) => {
      await page.goto('/fournisseurs');
      await expect(page).toHaveTitle(/fournisseurs|b2b/i);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('has link to registration', async ({ page }) => {
      await page.goto('/fournisseurs');
      const registerLink = page.getByRole('link', { name: /inscription|partenaire|devenir/i });
      await expect(registerLink).toBeVisible();
    });

    test('has link to login', async ({ page }) => {
      await page.goto('/fournisseurs');
      const loginLink = page.getByRole('link', { name: /connexion|login/i });
      await expect(loginLink).toBeVisible();
    });
  });

  test.describe('B2B Registration', () => {
    test('displays registration form', async ({ page }) => {
      await page.goto('/fournisseurs/inscription');

      // Check form fields exist
      await expect(page.getByLabel(/raison sociale/i)).toBeVisible();
      await expect(page.getByLabel(/siret/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/téléphone/i)).toBeVisible();
    });

    test('validates required fields', async ({ page }) => {
      await page.goto('/fournisseurs/inscription');

      // Try to submit empty form
      const submitButton = page.getByRole('button', { name: /soumettre/i });
      await submitButton.click();

      // Should show validation errors
      await expect(page.getByText(/requis/i).first()).toBeVisible();
    });

    test('validates SIRET format', async ({ page }) => {
      await page.goto('/fournisseurs/inscription');

      const siretInput = page.getByLabel(/siret/i);
      await siretInput.fill('123');

      const submitButton = page.getByRole('button', { name: /soumettre/i });
      await submitButton.click();

      await expect(page.getByText(/14 chiffres/i)).toBeVisible();
    });

    test('validates email format', async ({ page }) => {
      await page.goto('/fournisseurs/inscription');

      const emailInput = page.getByLabel(/email/i);
      await emailInput.fill('invalid-email');

      const submitButton = page.getByRole('button', { name: /soumettre/i });
      await submitButton.click();

      await expect(page.getByText(/email invalide/i)).toBeVisible();
    });
  });

  test.describe('B2B Contact', () => {
    test('displays contact form', async ({ page }) => {
      await page.goto('/fournisseurs/contact');

      await expect(page.getByLabel(/entreprise|société/i)).toBeVisible();
      await expect(page.getByLabel(/message/i)).toBeVisible();
    });
  });

  test.describe('B2B Dashboard (Protected)', () => {
    test('redirects to login when not authenticated', async ({ page }) => {
      await page.goto('/fournisseurs/dashboard');

      // Should redirect to login
      await expect(page).toHaveURL(/login|fournisseurs$/);
    });

    test('redirects orders page to login when not authenticated', async ({ page }) => {
      await page.goto('/fournisseurs/orders');
      await expect(page).toHaveURL(/login|fournisseurs$/);
    });

    test('redirects invoices page to login when not authenticated', async ({ page }) => {
      await page.goto('/fournisseurs/invoices');
      await expect(page).toHaveURL(/login|fournisseurs$/);
    });
  });

  test.describe('B2B Resources', () => {
    test('displays resources page', async ({ page }) => {
      await page.goto('/fournisseurs/resources');

      // Resources page should be accessible without auth (marketing materials)
      await expect(page.locator('h1')).toBeVisible();
    });
  });
});

test.describe('B2B Pricing', () => {
  test('displays pricing tiers', async ({ page }) => {
    await page.goto('/fournisseurs');

    // Look for pricing information
    const pricingSection = page.locator('[data-testid="pricing"], .pricing, #pricing');

    // If pricing is on the page
    if ((await pricingSection.count()) > 0) {
      // Check for tier names
      await expect(page.getByText(/starter|standard|premium|enterprise/i).first()).toBeVisible();
    }
  });
});

test.describe('B2B Mobile', () => {
  test('registration form is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/fournisseurs/inscription');

    // Form should be visible and usable
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Submit button should be visible without scrolling too much
    const submitButton = page.getByRole('button', { name: /soumettre/i });
    await submitButton.scrollIntoViewIfNeeded();
    await expect(submitButton).toBeVisible();
  });
});
