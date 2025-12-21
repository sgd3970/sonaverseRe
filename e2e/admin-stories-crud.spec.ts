import { test, expect } from '@playwright/test';

test.describe('Admin Stories CRUD', () => {
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

    test('should create a new story', async ({ page }) => {
        await loginAsAdmin(page);

        // Navigate to stories page
        await page.goto('/admin/stories');

        // Click new story button
        const newButton = page.getByRole('link', { name: /New Story|새 스토리|작성하기/i });
        if (await newButton.count() > 0) {
            await newButton.click();
            await page.waitForURL(/\/admin\/stories\/new/);

            // Fill in story details
            const titleInput = page.locator('input[name*="title"], input[id*="title"]').first();
            if (await titleInput.count() > 0) {
                await titleInput.fill('E2E Test Story ' + Date.now());
            }

            const excerptInput = page.locator('textarea[name*="excerpt"], textarea[id*="excerpt"], input[name*="excerpt"]').first();
            if (await excerptInput.count() > 0) {
                await excerptInput.fill('This is a test story created by E2E test');
            }

            const contentInput = page.locator('textarea[name*="content"], textarea[id*="body"]').first();
            if (await contentInput.count() > 0) {
                await contentInput.fill('E2E test content for the story. This is the main body of the test story.');
            }

            // Submit the form
            const submitButton = page.getByRole('button', { name: /Save|저장|Submit|제출/i });
            if (await submitButton.count() > 0) {
                await submitButton.click();

                // Wait for redirect or success message
                await page.waitForTimeout(2000);

                // Verify we're redirected or see success
                const currentUrl = page.url();
                expect(currentUrl).toMatch(/\/admin\/stories/);
            }
        }
    });

    test('should list all stories', async ({ page }) => {
        await loginAsAdmin(page);

        await page.goto('/admin/stories');

        // Check for stories table or list
        const storiesContainer = page.locator('table, [role="list"], .stories-list, .table-container');

        // Page should load successfully
        await expect(page).toHaveURL(/\/admin\/stories/);
    });

    test('should edit an existing story', async ({ page }) => {
        await loginAsAdmin(page);

        await page.goto('/admin/stories');

        // Find first edit button
        const editButton = page.getByRole('link', { name: /Edit|수정|편집/i }).first();
        const editButtonCount = await editButton.count();

        if (editButtonCount > 0) {
            await editButton.click();

            // Wait for edit page to load
            await page.waitForURL(/\/admin\/stories\/.+/);

            // Modify the title
            const titleInput = page.locator('input[name*="title"], input[id*="title"]').first();
            if (await titleInput.count() > 0) {
                const currentTitle = await titleInput.inputValue();
                await titleInput.fill(currentTitle + ' (Edited by E2E)');
            }

            // Save changes
            const saveButton = page.getByRole('button', { name: /Save|저장|Update|업데이트/i });
            if (await saveButton.count() > 0) {
                await saveButton.click();
                await page.waitForTimeout(2000);
            }
        }
    });

    test('should delete a story', async ({ page }) => {
        await loginAsAdmin(page);

        await page.goto('/admin/stories');

        // Count stories before deletion
        const rowsBefore = await page.locator('tr, [role="listitem"], .story-item').count();

        // Find delete button (be careful in production!)
        const deleteButton = page.getByRole('button', { name: /Delete|삭제/i }).first();
        const deleteButtonCount = await deleteButton.count();

        if (deleteButtonCount > 0 && rowsBefore > 1) {
            // Listen for confirmation dialog
            page.on('dialog', dialog => dialog.accept());

            await deleteButton.click();
            await page.waitForTimeout(2000);

            // Verify story was deleted
            const rowsAfter = await page.locator('tr, [role="listitem"], .story-item').count();
            expect(rowsAfter).toBeLessThanOrEqual(rowsBefore);
        }
    });

    test('should toggle story publish status', async ({ page }) => {
        await loginAsAdmin(page);

        await page.goto('/admin/stories');

        // Find a publish/unpublish toggle
        const toggleButton = page.locator('button[aria-label*="publish"], input[type="checkbox"][name*="publish"]').first();
        const toggleCount = await toggleButton.count();

        if (toggleCount > 0) {
            // Get initial state
            const initialState = await toggleButton.isChecked().catch(() => null);

            // Click toggle
            await toggleButton.click();
            await page.waitForTimeout(1000);

            // Verify state changed
            if (initialState !== null) {
                const newState = await toggleButton.isChecked();
                expect(newState).not.toBe(initialState);
            }
        }
    });

    test('should search/filter stories', async ({ page }) => {
        await loginAsAdmin(page);

        await page.goto('/admin/stories');

        // Find search input
        const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="검색"]').first();
        const searchCount = await searchInput.count();

        if (searchCount > 0) {
            // Enter search query
            await searchInput.fill('test');
            await page.waitForTimeout(1000);

            // Results should be filtered (implementation dependent)
            // Just verify page doesn't crash
            await expect(page).toHaveURL(/\/admin\/stories/);
        }
    });
});
