import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
    // Helper function to login
    async function loginAsAdmin(page: any) {
        await page.goto('/admin/login');
        
        // Use environment variables or test credentials
        const email = process.env.ADMIN_TEST_EMAIL || 'admin@sonaverse.kr';
        const password = process.env.ADMIN_TEST_PASSWORD || 'test1234';
        
        await page.getByLabel(/Email|이메일/i).fill(email);
        await page.getByLabel(/Password|비밀번호/i).fill(password);
        await page.getByRole('button', { name: /Login|로그인/i }).click();
        
        // Wait for redirect to dashboard
        await page.waitForURL(/\/admin/, { timeout: 5000 });
    }

    test('should require authentication to access dashboard', async ({ page }) => {
        await page.goto('/admin');
        
        // Should redirect to login page
        await expect(page).toHaveURL(/\/admin\/login/);
    });

    test('should display dashboard after login', async ({ page }) => {
        await loginAsAdmin(page);
        
        // Check for dashboard elements
        await expect(page.getByRole('heading', { name: /Dashboard|대시보드/i })).toBeVisible();
    });

    test('should navigate to stories management', async ({ page }) => {
        await loginAsAdmin(page);
        
        // Navigate to stories page
        await page.getByRole('link', { name: /Stories|스토리/i }).click();
        await expect(page).toHaveURL(/\/admin\/stories/);
    });

    test('should navigate to press management', async ({ page }) => {
        await loginAsAdmin(page);
        
        // Navigate to press page
        await page.getByRole('link', { name: /Press|언론보도/i }).click();
        await expect(page).toHaveURL(/\/admin\/press/);
    });

    test('should navigate to inquiries management', async ({ page }) => {
        await loginAsAdmin(page);
        
        // Navigate to inquiries page
        await page.getByRole('link', { name: /Inquiries|문의/i }).click();
        await expect(page).toHaveURL(/\/admin\/inquiries/);
    });

    test('should logout successfully', async ({ page }) => {
        await loginAsAdmin(page);
        
        // Find and click logout button
        const logoutButton = page.getByRole('button', { name: /Logout|로그아웃/i });
        if (await logoutButton.count() > 0) {
            await logoutButton.click();
            // Should redirect to login page
            await expect(page).toHaveURL(/\/admin\/login/);
        }
    });
});

