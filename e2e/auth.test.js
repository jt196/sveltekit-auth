import { test, expect } from '@playwright/test';
import 'dotenv/config';

const EMAIL = process.env.DEMO_USER_EMAIL || 'demo@example.com';
const PASS = process.env.DEMO_USER_PASSWORD || 'demo1234';

test.describe('Auth flow', () => {
  test.beforeEach(async ({ page }) => {
    // ensure logged out before each test
    await page.goto('/logout');
  });

  test('rejects invalid credentials with alert', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASS + '-wrong');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('.alert-error')).toBeVisible();
    await expect(page.locator('.alert-error')).toContainText('Unable to authenticate');
  });

  test('accepts valid credentials and redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASS);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('h1')).toHaveText('Dashboard');
  });

  test('redirects to /login when visiting /dashboard while logged out', async ({ page }) => {
    await page.goto('/logout');
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('logout clears the session and guard works again', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASS);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard$/);

    // Logout via header link
    await page.click('a[href="/logout"]');
    await expect(page).toHaveURL(/\/$/);

    // Attempt to access dashboard again -> redirected to login
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });
});
