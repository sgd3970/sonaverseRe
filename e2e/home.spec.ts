import { test, expect } from '@playwright/test';

test('homepage has title and links to products', async ({ page, isMobile }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Sonaverse/);

    // Check hero section
    const heroHeading = page.getByRole('main').getByRole('heading', { level: 1 });
    await expect(heroHeading).toBeVisible();

    // Handle mobile menu
    if (isMobile) {
        await page.getByLabel('Toggle menu').click();
    }

    // Check navigation to stories (Products is a dropdown, so we test Stories which is a direct link)
    // Scope to banner to avoid finding links in footer
    await page.getByRole('banner').getByRole('link', { name: /Stories|스토리/i }).click();
    await expect(page).toHaveURL(/\/stories/);
});
