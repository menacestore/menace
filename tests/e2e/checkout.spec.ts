import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete checkout successfully', async ({ page }) => {
    await page.goto('/');

    // Navigate to a product
    await page.getByRole('link', { name: /product/i }).first().click();
    await page.waitForURL(/\/product\//);

    // Add to cart
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Go to checkout
    await page.getByRole('link', { name: /cart/i }).click();
    await page.getByRole('button', { name: /checkout/i }).click();
    await page.waitForURL('/checkout');

    // Fill shipping form
    await page.getByLabel(/first name/i).fill('John');
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/address/i).fill('123 Main Street');
    await page.getByLabel(/city/i).fill('Lahore');
    await page.getByLabel(/province/i).fill('Punjab');
    await page.getByLabel(/email/i).fill('john@example.com');

    // Place order
    await page.getByRole('button', { name: /place order/i }).click();

    // Wait for order confirmation
    await page.waitForURL(/\/order\//);
    await expect(page.getByText(/order confirmed/i)).toBeVisible();
  });

  test('should validate checkout form', async ({ page }) => {
    await page.goto('/checkout');

    // Try to submit empty form
    await page.getByRole('button', { name: /place order/i }).click();

    // Should show validation errors
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });

  test('should track order as guest', async ({ page }) => {
    await page.goto('/order/track');

    // Fill tracking form
    await page.getByLabel(/order number/i).fill('ORD-20260518-001');
    await page.getByLabel(/email/i).fill('john@example.com');

    // Submit tracking
    await page.getByRole('button', { name: /track/i }).click();

    // Should show order status or not found
    await expect(page.getByText(/status|not found/i)).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /products/i }).click();
    await page.waitForURL('/products');
    await expect(page).toHaveURL('/products');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /login/i }).click();
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Admin Protection', () => {
  test('should redirect to login when accessing admin without auth', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
  });
});
