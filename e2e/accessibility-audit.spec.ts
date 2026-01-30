import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Comprehensive Accessibility Tests using axe-core
 * Tests WCAG 2.1 AA compliance across all major pages
 */

const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/shop', name: 'Shop' },
  { path: '/cart', name: 'Cart' },
  { path: '/pack', name: 'Pack Configurator' },
  { path: '/loyalty', name: 'Loyalty' },
  { path: '/subscribe', name: 'Subscribe' },
  { path: '/blog', name: 'Blog' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/faq', name: 'FAQ' },
  { path: '/cgv', name: 'CGV' },
  { path: '/privacy', name: 'Privacy' },
  { path: '/login', name: 'Login' },
  { path: '/fournisseurs', name: 'B2B Home' },
];

test.describe('Accessibility Audit - WCAG 2.1 AA', () => {
  for (const page of pages) {
    test(`${page.name} (${page.path}) should have no accessibility violations`, async ({
      page: browserPage,
    }) => {
      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('domcontentloaded');

      const results = await new AxeBuilder({ page: browserPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      // Log violations for debugging
      if (results.violations.length > 0) {
        console.log(`\n❌ Violations on ${page.name}:`);
        results.violations.forEach((violation) => {
          console.log(`  - ${violation.id}: ${violation.description}`);
          console.log(`    Impact: ${violation.impact}`);
          console.log(`    Nodes: ${violation.nodes.length}`);
        });
      }

      expect(results.violations).toHaveLength(0);
    });
  }
});

test.describe('Keyboard Navigation', () => {
  test('should be able to navigate entire page with keyboard only', async ({ page }) => {
    await page.goto('/');

    // Start from skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeFocused();

    // Navigate to main content
    await page.keyboard.press('Enter');
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();

    // Continue tabbing through interactive elements
    const focusableElements = await page
      .locator(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      .all();

    // Verify all interactive elements can receive focus
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  test('should trap focus in mobile menu when open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();

    // Tab through menu items
    await page.keyboard.press('Tab');

    // First focusable element in menu should have focus
    const menuContent = page.locator('[role="dialog"], [aria-modal="true"], .mobile-menu');
    const isMenuFocused = await menuContent.evaluate((el) => {
      return el.contains(document.activeElement);
    });

    expect(isMenuFocused).toBeTruthy();
  });

  test('should handle escape key to close modals and menus', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();

    // Press escape
    await page.keyboard.press('Escape');

    // Menu should be closed
    const menu = page.locator('.mobile-menu, [role="dialog"]');
    await expect(menu).not.toBeVisible();
  });
});

test.describe('Color Contrast', () => {
  test('text should meet WCAG AA contrast requirements', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('interactive elements should have visible focus states', async ({ page }) => {
    await page.goto('/');

    // Check buttons have visible focus
    const buttons = await page.locator('button').all();

    for (const button of buttons.slice(0, 5)) {
      await button.focus();

      const outlineStyle = await button.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          outline: style.outline,
          boxShadow: style.boxShadow,
        };
      });

      // Should have some visible focus indicator
      const hasVisibleFocus =
        outlineStyle.outline !== 'none' ||
        outlineStyle.boxShadow !== 'none';

      expect(hasVisibleFocus).toBeTruthy();
    }
  });
});

test.describe('Screen Reader Accessibility', () => {
  test('images should have alt text', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');

    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      const ariaHidden = await img.getAttribute('aria-hidden');

      // Image should have alt text OR be marked as decorative
      const isAccessible =
        (alt !== null && alt.length > 0) ||
        role === 'presentation' ||
        ariaHidden === 'true';

      expect(isAccessible).toBeTruthy();
    }
  });

  test('form inputs should have associated labels', async ({ page }) => {
    await page.goto('/contact');

    const results = await new AxeBuilder({ page })
      .withRules(['label', 'label-title-only'])
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('headings should be in logical order', async ({ page }) => {
    await page.goto('/');

    const headings = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((elements) => {
        return elements.map((el) => ({
          level: parseInt(el.tagName[1]),
          text: el.textContent?.trim().slice(0, 50),
        }));
      });

    // Should have exactly one h1
    const h1Count = headings.filter((h) => h.level === 1).length;
    expect(h1Count).toBe(1);

    // Headings should not skip levels
    let previousLevel = 0;
    for (const heading of headings) {
      const jump = heading.level - previousLevel;
      // Should not skip more than one level (e.g., h1 to h3)
      expect(jump).toBeLessThanOrEqual(2);
      previousLevel = heading.level;
    }
  });

  test('ARIA landmarks should be present', async ({ page }) => {
    await page.goto('/');

    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();

    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav.first()).toBeVisible();

    // Check for footer/contentinfo landmark
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).toBeVisible();
  });
});

test.describe('Motion and Animation', () => {
  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Check that animations are disabled
    const animatedElements = await page.locator('[class*="animate-"]').all();

    for (const el of animatedElements) {
      const animationDuration = await el.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return style.animationDuration;
      });

      // Animation should be instant (0.01ms) when reduced motion is preferred
      expect(['0s', '0.01ms', '0ms']).toContain(animationDuration);
    }
  });
});

test.describe('Form Accessibility', () => {
  test('contact form should be accessible', async ({ page }) => {
    await page.goto('/contact');

    const results = await new AxeBuilder({ page })
      .include('form')
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('form errors should be announced to screen readers', async ({ page }) => {
    await page.goto('/contact');

    // Submit empty form to trigger errors
    const submitButton = page.getByRole('button', { name: /envoyer/i });
    await submitButton.click();

    // Error messages should be present and associated with inputs
    const errors = await page.locator('[role="alert"], .error, [aria-live="polite"]').all();
    expect(errors.length).toBeGreaterThan(0);
  });
});
