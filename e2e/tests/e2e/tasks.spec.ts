import { expect, test } from '@playwright/test';
import { testUrls } from '../fixtures/test-data';
import { clearSelection, createTask, login, searchTasks, selectTask } from '../utils/test-helpers';

test.describe('Task Management', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('should create a new task successfully', async ({ page }) => {
        await createTask(page, testUrls.valid);

        // Verify task appears in the table
        const taskRow = page.locator('tr').filter({ hasText: testUrls.valid });
        await expect(taskRow).toBeVisible();
    });

    test('should search tasks by URL', async ({ page }) => {
        const timestamp = Date.now();
        const url = `https://example-${timestamp}.com`;
        // Create a task first
        await createTask(page, url);

        // Search for the task
        await searchTasks(page, url);

        // Should show the task
        await expect(page.locator(`text=${url}`)).toBeVisible();

        // Search for non-existent task
        await searchTasks(page, 'nonexistent');

        // Should not show the task
        await expect(page.locator(`text=${url}`)).not.toBeVisible();
    });

    test('should clear selection', async ({ page }) => {
        // Create a task
        await createTask(page, testUrls.valid);

        // Select the task
        await selectTask(page, testUrls.valid);

        // Verify bulk action buttons appear
        await expect(page.locator('[data-testid="bulk-delete-button"]')).toBeVisible();
        await expect(page.locator('[data-testid="bulk-clear-selection-button"]')).toBeVisible();

        // Clear selection
        await clearSelection(page);

        // Verify bulk action buttons are hidden
        await expect(page.locator('[data-testid="bulk-delete-button"]')).not.toBeVisible();
        await expect(page.locator('[data-testid="bulk-clear-selection-button"]')).not.toBeVisible();
    });
}); 