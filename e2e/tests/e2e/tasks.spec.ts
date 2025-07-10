import { expect, test } from '@playwright/test';
import { testUrls } from '../fixtures/test-data';
import { clearSelection, createTask, login, searchTasks, selectFirstTask } from '../utils/test-helpers';

test.describe('Task Management', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('should search tasks by URL', async ({ page }) => {
        const testUrl = testUrls.valid(Date.now().toString());

        await createTask(page, testUrl);
        await searchTasks(page, testUrl);

        await expect(page.locator(`text=${testUrl}`)).toBeVisible();

        await searchTasks(page, 'nonexistent');
        await expect(page.locator(`text=${testUrl}`)).not.toBeVisible();
    });

    test('should clear selection', async ({ page }) => {
        const testUrl = testUrls.valid(Date.now().toString());
        await createTask(page, testUrl);


        await selectFirstTask(page);


        await expect(page.locator('[data-testid="bulk-delete-button"]')).toBeVisible();
        await expect(page.locator('[data-testid="bulk-clear-selection-button"]')).toBeVisible();


        await clearSelection(page);


        await expect(page.locator('[data-testid="bulk-delete-button"]')).not.toBeVisible();
        await expect(page.locator('[data-testid="bulk-clear-selection-button"]')).not.toBeVisible();
    });

    test('should delete a task', async ({ page }) => {
        const testUrl = testUrls.valid(Date.now().toString());
        await createTask(page, testUrl);

        await searchTasks(page, testUrl);
        await selectFirstTask(page);

        await page.click('[data-testid="bulk-delete-button"]');
        await expect(page.locator(`text=${testUrl}`)).not.toBeVisible();
    });
}); 