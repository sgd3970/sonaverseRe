import { test, expect } from '@playwright/test';

test.describe('Product Pages', () => {
    test('should navigate to Manbo product page', async ({ page }) => {
        await page.goto('/products/manbo');

        // Check for product title - use level 1 heading which is more specific than name regex which might fail on partial matches or encoding
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        // Verify it contains expected text
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Manbo|만보|워크메이트/i);

        // Check for features section or buttons
        await expect(page.getByRole('button', { name: /Consulting|Catalog|상담|카탈로그/i }).first()).toBeVisible();
    });

    test('should navigate to Bodume product page', async ({ page }) => {
        await page.goto('/products/bodume');

        // Check for product title
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Bodume|보듬/i);

        // Check for lineup section or badge
        await expect(page.getByText(/Premium Care|프리미엄/i)).toBeVisible();
    });
});
