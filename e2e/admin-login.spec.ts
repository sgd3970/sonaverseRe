import { test, expect } from '@playwright/test';

test('admin login page renders', async ({ page }) => {
    await page.goto('/admin/login');

    // Check for login form
    await expect(page.getByLabel(/Email|이메일/i)).toBeVisible();
    await expect(page.getByLabel(/Password|비밀번호/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Login|로그인/i })).toBeVisible();
});

test('invalid login shows error', async ({ page }) => {
    await page.goto('/admin/login');

    await page.getByLabel(/Email|이메일/i).fill('wrong@example.com');
    await page.getByLabel(/Password|비밀번호/i).fill('wrongpassword');
    await page.getByRole('button', { name: /Login|로그인/i }).click();

    // Check for error message
    // Adjust selector based on actual implementation
    await expect(page.getByRole('alert')).toBeVisible();
});
