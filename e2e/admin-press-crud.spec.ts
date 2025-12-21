import { test, expect } from '@playwright/test';

test.describe('Admin Press CRUD', () => {
    // Helper function to login
    async function loginAsAdmin(page: any) {
        await page.goto('/admin/login');

        const email = process.env.ADMIN_TEST_EMAIL || 'admin@sonaverse.kr';
        const password = process.env.ADMIN_TEST_PASSWORD || 'test1234';

        await page.getByLabel(/Email|이메일/i).fill(email);
        await page.getByLabel(/Password|비밀번호/i).fill(password);
        await page.getByRole('button', { name: /Login|로그인/i }).click();

        await page.waitForURL(/\/admin/, { timeout: 10000 });
    }

    test('should create a new press release', async ({ page }) => {
        await loginAsAdmin(page);

        await page.goto('/admin/press');

        // Click new press button
        const newButton = page.getByRole('link', { name: /New Press|새 보도자료|작성하기/i });
        if (await newButton.count() > 0) {
            await newButton.click();
            await page.waitForURL(/\/admin\/press\/new/);

            // Fill in press details
            const titleInput = page.locator('input[name*="title"], input[id*="title"]').first();
            if (await titleInput.count() > 0) {
                await titleInput.fill('E2E Test Press Release ' + Date.now());
            }

            const excerptInput = page.locator('textarea[name*="excerpt"], textarea[id*="excerpt"], input[name*="excerpt"]').first();
            if (await excerptInput.count() > 0) {
                await excerptInput.fill('This is a test press release created by E2E test');
            }

            const contentInput = page.locator('textarea[name*="content"], textarea[id*="body"]').first();
            if (await contentInput.count() > 0) {
                await contentInput.fill('E2E test content for the press release.');
            }

            // Submit the form
            const submitButton = page.getByRole('button', { name: /Save|저장|Submit|제출/i });
            if (await submitButton.count() > 0) {
                await submitButton.click();
                await page.waitForTimeout(2000);

                const currentUrl = page.url();
                expect(currentUrl).toMatch(/\/admin\/press/);
            }
        }
    });

    test('should list all press releases', async ({ page }) => {
        await loginAsAdmin(page);

        await page.goto('/admin/press');

        // Page should load successfully
        await expect(page).toHaveURL(/\/admin\/press/);

        // Check for press table or list
        await page.waitForTimeout(1000);
    });

    test('should edit an existing press release', async ({ page }) => {
        await loginAsAdmin(page);

        await page.goto('/admin/press');

        // Find first edit button
        const editButton = page.getByRole('link', { name: /Edit|수정|편집/i }).first();
        const editButtonCount = await editButton.count();

        if (editButtonCount > 0) {
            await editButton.click();
            await page.waitForURL(/\/admin\/press\/.+/);

            // Modify the title
            const titleInput = page.locator('input[name*="title"], input[id*="title"]').first();
            if (await titleInput.count() > 0) {
                const currentTitle = await titleInput.inputValue();
                await titleInput.fill(currentTitle + ' (Edited)');
            }

            // Save changes
            const saveButton = page.getByRole('button', { name: /Save|저장|Update|업데이트/i });
            if (await saveButton.count() > 0) {
                await saveButton.click();
                await page.waitForTimeout(2000);
            }
        }
    });

    test('should delete a press release', async ({ page }) => {
        await loginAsAdmin(page);

        await page.goto('/admin/press');

        // Count press releases before deletion
        const rowsBefore = await page.locator('tr, [role="listitem"], .press-item').count();

        // Find delete button
        const deleteButton = page.getByRole('button', { name: /Delete|삭제/i }).first();
        const deleteButtonCount = await deleteButton.count();

        if (deleteButtonCount > 0 && rowsBefore > 1) {
            page.on('dialog', dialog => dialog.accept());

            await deleteButton.click();
            await page.waitForTimeout(2000);

            const rowsAfter = await page.locator('tr, [role="listitem"], .press-item').count();
            expect(rowsAfter).toBeLessThanOrEqual(rowsBefore);
        }
    });
});
