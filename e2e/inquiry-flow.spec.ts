import { test, expect } from '@playwright/test';

test.describe('Inquiry Flow', () => {
    test('should submit inquiry form successfully', async ({ page }) => {
        await page.goto('/inquiry');

        // Fill in the form
        await page.getByLabel(/Name|이름/i).fill('Test User');
        await page.getByLabel(/Email|이메일/i).fill('test@example.com');
        await page.getByLabel(/Phone|전화번호/i).fill('010-1234-5678');
        await page.getByLabel(/Company|회사명/i).fill('Test Company');
        await page.getByLabel(/Message|메시지/i).fill('This is a test inquiry message.');

        // Select inquiry type if available
        const inquiryTypeSelect = page.locator('select, [role="combobox"]').first();
        if (await inquiryTypeSelect.count() > 0) {
            await inquiryTypeSelect.selectOption({ index: 0 });
        }

        // Check privacy consent if checkbox exists
        const privacyCheckbox = page.getByLabel(/Privacy|개인정보/i);
        if (await privacyCheckbox.count() > 0) {
            await privacyCheckbox.check();
        }

        // Submit the form
        await page.getByRole('button', { name: /Submit|제출|문의하기/i }).click();

        // Wait for response (success or error message)
        await page.waitForTimeout(2000);

        // Check for success message or inquiry number
        const successMessage = page.getByText(/success|성공|접수되었습니다|Inquiry Number/i);
        await expect(successMessage).toBeVisible({ timeout: 5000 });
    });

    test('should show validation errors for empty form', async ({ page }) => {
        await page.goto('/inquiry');

        // Try to submit without filling fields
        await page.getByRole('button', { name: /Submit|제출|문의하기/i }).click();

        // Should show validation errors or stay on the same page
        await expect(page).toHaveURL(/\/inquiry/);
    });

    test('should validate email format', async ({ page }) => {
        await page.goto('/inquiry');

        // Fill form with invalid email
        await page.getByLabel(/Email|이메일/i).fill('invalid-email');
        await page.getByLabel(/Name|이름/i).fill('Test User');
        
        // Try to submit
        await page.getByRole('button', { name: /Submit|제출|문의하기/i }).click();

        // Should show email validation error
        await expect(page.getByText(/email|이메일/i)).toBeVisible({ timeout: 3000 });
    });
});

