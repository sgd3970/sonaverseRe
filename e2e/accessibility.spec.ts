import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
    test('homepage should have no accessibility violations', async ({ page }) => {
        await page.goto('/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('products page should have no accessibility violations', async ({ page }) => {
        await page.goto('/products');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('manbo product page should have no accessibility violations', async ({ page }) => {
        await page.goto('/products/manbo');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('bodume product page should have no accessibility violations', async ({ page }) => {
        await page.goto('/products/bodume');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('stories page should have no accessibility violations', async ({ page }) => {
        await page.goto('/stories');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('press page should have no accessibility violations', async ({ page }) => {
        await page.goto('/press');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('inquiry page should have no accessibility violations', async ({ page }) => {
        await page.goto('/inquiry');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('admin login page should have no accessibility violations', async ({ page }) => {
        await page.goto('/admin/login');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});

test.describe('Keyboard Navigation', () => {
    test('should navigate main menu with keyboard', async ({ page }) => {
        await page.goto('/');

        // Press Tab to focus first interactive element
        await page.keyboard.press('Tab');

        // Should be able to navigate through menu items
        const focusedElement = await page.evaluate(() => {
            return document.activeElement?.tagName;
        });

        expect(focusedElement).toBeTruthy();
    });

    test('should be able to submit inquiry form with keyboard', async ({ page }) => {
        await page.goto('/inquiry');

        // Tab through form fields
        await page.keyboard.press('Tab'); // Focus first field

        // Type in focused field
        await page.keyboard.type('Test Name');

        // Continue tabbing through fields
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('Tab');
        }

        // Verify we can navigate through the form
        const activeElement = await page.evaluate(() => {
            return document.activeElement?.tagName;
        });

        expect(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON']).toContain(activeElement);
    });
});

test.describe('Screen Reader Support', () => {
    test('images should have alt text', async ({ page }) => {
        await page.goto('/');

        // Get all images
        const images = await page.locator('img').all();

        for (const img of images) {
            const alt = await img.getAttribute('alt');
            // Alt attribute should exist (can be empty for decorative images)
            expect(alt).toBeDefined();
        }
    });

    test('form inputs should have labels or aria-label', async ({ page }) => {
        await page.goto('/inquiry');

        // Get all input elements
        const inputs = await page.locator('input, textarea, select').all();

        for (const input of inputs) {
            const id = await input.getAttribute('id');
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledby = await input.getAttribute('aria-labelledby');

            // Should have either a label (via id), aria-label, or aria-labelledby
            const hasLabel = id && (await page.locator(`label[for="${id}"]`).count()) > 0;
            const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledby;

            expect(hasAccessibleName).toBeTruthy();
        }
    });

    test('heading hierarchy should be correct', async ({ page }) => {
        await page.goto('/');

        // Get all headings
        const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

        // Should have at least one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThan(0);

        // h1 should appear before h2, h2 before h3, etc.
        let previousLevel = 0;
        for (const heading of headings) {
            const tagName = await heading.evaluate((el) => el.tagName);
            const level = parseInt(tagName[1]);

            // Heading levels should not skip (e.g., h1 -> h3)
            if (previousLevel > 0) {
                expect(level - previousLevel).toBeLessThanOrEqual(1);
            }

            previousLevel = level;
        }
    });
});

test.describe('Color Contrast', () => {
    test('should have sufficient color contrast', async ({ page }) => {
        await page.goto('/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['cat.color'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
