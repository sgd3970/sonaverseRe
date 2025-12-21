import { test, expect } from '@playwright/test';

test.describe('Stories Page', () => {
    test('should display stories list', async ({ page }) => {
        await page.goto('/stories');

        // Check page title
        await expect(page).toHaveTitle(/Stories|스토리/i);

        // Check for stories section
        const storiesHeading = page.getByRole('heading', { name: /Stories|소나버스 스토리/i });
        await expect(storiesHeading).toBeVisible();
    });

    test('should navigate to story detail if available', async ({ page }) => {
        await page.goto('/stories');

        // Wait for stories to load
        await page.waitForTimeout(1000);

        // Try to click first story link if available
        const firstStoryLink = page.locator('a[href*="/stories/"]').first();
        const count = await firstStoryLink.count();
        
        if (count > 0) {
            await firstStoryLink.click();
            // Should navigate to story detail page
            await expect(page).toHaveURL(/\/stories\/.+/);
        }
    });

    test('should have proper meta tags', async ({ page }) => {
        await page.goto('/stories');

        // Check for meta description
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute('content', /.+/);
    });
});

