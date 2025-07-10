import { Page, expect } from '@playwright/test';
import { testUsers } from '../fixtures/test-data';

export async function login(page: Page, user = testUsers.admin) {
    await page.goto('/login');
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/tasks');
}

export async function createTask(page: Page, url: string) {
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="create-task-url-input"]', url);
    await page.click('[data-testid="create-task-create-button"]');

    // Wait for the task to appear in the list
    await expect(page.locator(`text=${url}`)).toBeVisible();
}

export async function searchTasks(page: Page, searchTerm: string) {
    await page.fill('[data-testid="search-bar-input"]', searchTerm);
    // Wait for search to complete (debounce)
    await page.waitForTimeout(600);
}

export async function selectTask(page: Page, url: string) {
    const taskRow = page.locator('tr').filter({ hasText: url });
    await taskRow.locator('input[type="checkbox"]').check();
}

export async function clearSelection(page: Page) {
    await page.click('[data-testid="bulk-clear-selection-button"]');
} 