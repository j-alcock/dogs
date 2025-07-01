import { test, expect } from '@playwright/test';

test.describe('Dog Breeds UI', () => {
  test('Breed list loads and displays at least one breed', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="breed-card"]', { timeout: 5000 });
    const count = await page.locator('[data-testid="breed-card"]').count();
    expect(count).toBeGreaterThan(0);
  });

  test('Clicking breed name or image navigates to details page', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('[data-testid="breed-card"]').first();
    const nameLink = firstCard.locator('[data-testid="breed-name-link"]');
    await nameLink.click();
    await expect(page).toHaveURL(/\/breeds\//);
    await expect(page.locator('[data-testid="breed-detail"]')).toBeVisible();
  });

  test('Add new breed form can be opened, filled, and submitted', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="add-breed-btn"]');
    const uniqueName = `Playwright Test Breed ${Date.now()}`;
    await page.fill('input[name="name"]', uniqueName);
    await page.selectOption('select[name="breed_group"]', { label: 'Sporting' });
    await page.fill('input[name="temperament"]', 'Friendly');
    await page.fill('input[name="life_span"]', '10-12 years');
    await page.fill('input[name="height_min"]', '30');
    await page.fill('input[name="height_max"]', '40');
    await page.fill('input[name="weight_min"]', '10');
    await page.fill('input[name="weight_max"]', '20');
    await page.fill('textarea[name="description"]', 'A breed created by Playwright test.');
    await page.fill('input[name="image_url"]', 'https://example.com/test.jpg');
    await page.click('[data-testid="submit-breed-btn"]');
    await expect(page.locator('[data-testid="breed-card"]', { hasText: uniqueName })).toBeVisible();
  });

  test('Search bar filters breeds', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="search-bar"]', 'Retriever');
    await expect(page.locator('[data-testid="breed-card"]')).toContainText(['Retriever']);
  });

  test('Editing a breed updates its details', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('[data-testid="breed-card"]').first();
    await firstCard.locator('[data-testid="edit-breed-btn"]').click();
    await page.fill('input[name="name"]', 'Edited Breed');
    await page.click('[data-testid="submit-breed-btn"]');
    await expect(page.locator('[data-testid="breed-card"]', { hasText: 'Edited Breed' })).toBeVisible();
  });
}); 