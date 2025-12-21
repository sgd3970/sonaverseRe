import { test, expect } from '@playwright/test';

test.describe('Press Page', () => {
    test('should display press releases list', async ({ page }) => {
        await page.goto('/press');

        // Check page title
        await expect(page).toHaveTitle(/Press|언론보도/i);

        // Check for press section
        const pressHeading = page.getByRole('heading', { name: /Press|언론보도/i });
        await expect(pressHeading).toBeVisible();
    });

    test('should navigate to press detail if available', async ({ page }) => {
        await page.goto('/press');

        // Wait for press items to load
        await page.waitForTimeout(1000);

        // Try to click first press link if available
        const firstPressLink = page.locator('a[href*="/press/"]').first();
        const count = await firstPressLink.count();
        
        if (count > 0) {
            await firstPressLink.click();
            // Should navigate to press detail page or external URL
            await expect(page.url()).toMatch(/\/press\/.+/);
        }
    });

    test('should have proper meta tags', async ({ page }) => {
        await page.goto('/press');

        // Check for meta description
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute('content', /.+/);
    });
});

