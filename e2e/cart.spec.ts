import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('cart starts empty', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('text=Votre panier est vide')).toBeVisible();
  });

  test('can add product to cart from shop', async ({ page }) => {
    await page.goto('/shop');

    // Click on first product add to cart button
    await page.locator('.product-card').first().locator('button').click();

    // Check cart badge shows 1 item
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toContainText('1');
  });

  test('can view cart with products', async ({ page }) => {
    await page.goto('/shop');

    // Add a product
    await page.locator('.product-card').first().locator('button').click();

    // Go to cart
    await page.goto('/cart');

    // Cart should not be empty
    await expect(page.locator('text=Votre panier est vide')).not.toBeVisible();
  });

  test('can update quantity in cart', async ({ page }) => {
    // Add item to cart
    await page.goto('/shop');
    await page.locator('.product-card').first().locator('button').click();

    // Go to cart
    await page.goto('/cart');

    // Increase quantity
    await page.click('[aria-label="Augmenter la quantité"]');

    // Check quantity is 2
    await expect(page.locator('[data-testid="quantity"]')).toContainText('2');
  });

  test('can remove item from cart', async ({ page }) => {
    // Add item to cart
    await page.goto('/shop');
    await page.locator('.product-card').first().locator('button').click();

    // Go to cart
    await page.goto('/cart');

    // Remove item
    await page.click('[aria-label="Supprimer"]');

    // Cart should be empty
    await expect(page.locator('text=Votre panier est vide')).toBeVisible();
  });
});
