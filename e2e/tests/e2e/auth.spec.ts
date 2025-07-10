import { expect, test } from '@playwright/test';
import { testUsers } from '../fixtures/test-data';
import { login } from '../utils/test-helpers';

test.describe('Authentication', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
        await login(page, testUsers.admin);

        // Verify we're on the tasks page
        await expect(page).toHaveURL('/tasks');
        await expect(page.locator('h1')).toContainText('Tasks');
    });
}); 