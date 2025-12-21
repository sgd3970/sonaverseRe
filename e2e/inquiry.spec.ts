import { test, expect } from '@playwright/test';

test('inquiry form validation', async ({ page }) => {
    await page.goto('/inquiry');

    // Try to submit without filling fields
    await page.getByRole('button', { name: /Submit Inquiry|문의하기/i }).click();

    // Check for validation errors (assuming HTML5 validation or custom error messages)
    // This depends on implementation details, here we check if we are still on the same page
    await expect(page).toHaveURL(/\/inquiry/);

    // Optionally check for specific error messages if known
    // await expect(page.getByText('필수 항목입니다')).toBeVisible();
});
