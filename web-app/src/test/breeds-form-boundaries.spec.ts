import { test, expect } from '@playwright/test';

test.describe('Breed Form Boundary and Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="add-breed-btn"]');
  });

  test('shows error if required fields are empty', async ({ page }) => {
    await page.click('[data-testid="submit-breed-btn"]');
    // Check for invalid required fields (HTML5 validation)
    const invalidInputs = await page.locator('input:invalid, select:invalid, textarea:invalid').count();
    expect(invalidInputs).toBeGreaterThan(0);
  });

  test('shows error if height min > max', async ({ page }) => {
    await page.fill('input[name="name"]', `Boundary Test ${Date.now()}`);
    await page.selectOption('select[name="breed_group"]', { label: 'Sporting' });
    await page.fill('input[name="temperament"]', 'Friendly');
    await page.fill('input[name="life_span"]', '10-12 years');
    await page.fill('input[name="height_min"]', '100');
    await page.fill('input[name="height_max"]', '50');
    await page.fill('input[name="weight_min"]', '10');
    await page.fill('input[name="weight_max"]', '20');
    await page.fill('textarea[name="description"]', 'Boundary test.');
    await page.click('[data-testid="submit-breed-btn"]');
    await expect(page.locator('.text-red-800')).toHaveText(/Height minimum cannot be greater than maximum/);
  });

  test('shows error if weight min > max', async ({ page }) => {
    await page.fill('input[name="name"]', `Boundary Test ${Date.now()}`);
    await page.selectOption('select[name="breed_group"]', { label: 'Sporting' });
    await page.fill('input[name="temperament"]', 'Friendly');
    await page.fill('input[name="life_span"]', '10-12 years');
    await page.fill('input[name="height_min"]', '10');
    await page.fill('input[name="height_max"]', '20');
    await page.fill('input[name="weight_min"]', '30');
    await page.fill('input[name="weight_max"]', '20');
    await page.fill('textarea[name="description"]', 'Boundary test.');
    await page.click('[data-testid="submit-breed-btn"]');
    await expect(page.locator('.text-red-800')).toHaveText(/Weight minimum cannot be greater than maximum/);
  });

  test('shows error for invalid image URL', async ({ page }) => {
    await page.fill('input[name="name"]', `Boundary Test ${Date.now()}`);
    await page.selectOption('select[name="breed_group"]', { label: 'Sporting' });
    await page.fill('input[name="temperament"]', 'Friendly');
    await page.fill('input[name="life_span"]', '10-12 years');
    await page.fill('input[name="height_min"]', '10');
    await page.fill('input[name="height_max"]', '20');
    await page.fill('input[name="weight_min"]', '10');
    await page.fill('input[name="weight_max"]', '20');
    await page.fill('textarea[name="description"]', 'Boundary test.');
    await page.fill('input[name="image_url"]', 'not-a-url');
    await page.click('[data-testid="submit-breed-btn"]');
    // HTML5 validation: field will not submit, so error bubble will show
    await expect(page.locator('input[name="image_url"]:invalid')).toBeVisible();
  });

  test('shows error for too short description', async ({ page }) => {
    await page.fill('input[name="name"]', `Boundary Test ${Date.now()}`);
    await page.selectOption('select[name="breed_group"]', { label: 'Sporting' });
    await page.fill('input[name="temperament"]', 'Friendly');
    await page.fill('input[name="life_span"]', '10-12 years');
    await page.fill('input[name="height_min"]', '10');
    await page.fill('input[name="height_max"]', '20');
    await page.fill('input[name="weight_min"]', '10');
    await page.fill('input[name="weight_max"]', '20');
    await page.fill('textarea[name="description"]', 'Short');
    await page.click('[data-testid="submit-breed-btn"]');
    await expect(page.locator('.text-red-800')).toBeVisible();
  });

  test('shows error for duplicate breed name', async ({ page }) => {
    // Use a known seed name
    await page.fill('input[name="name"]', 'Golden Retriever');
    await page.selectOption('select[name="breed_group"]', { label: 'Sporting' });
    await page.fill('input[name="temperament"]', 'Friendly');
    await page.fill('input[name="life_span"]', '10-12 years');
    await page.fill('input[name="height_min"]', '10');
    await page.fill('input[name="height_max"]', '20');
    await page.fill('input[name="weight_min"]', '10');
    await page.fill('input[name="weight_max"]', '20');
    await page.fill('textarea[name="description"]', 'Boundary test.');
    await page.click('[data-testid="submit-breed-btn"]');
    await expect(page.locator('.text-red-800')).toHaveText('A breed with this name already exists');
  });
}); 