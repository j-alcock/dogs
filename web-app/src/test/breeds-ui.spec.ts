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
    const uniqueName = `Playwright Test Breed ${Date.now()}-${Math.random()}`;
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

    // Wait for navigation back to the home page
    await expect(page).toHaveURL('/');

    // After submission, search all pages for the created breed
    await page.goto('/');
    
    // Wait for the breed list to load
    await page.waitForSelector('[data-testid="breed-card"]', { timeout: 10000 });
    
    let found = false;
    
    // First check if the breed is on the current page
    if (await page.locator('[data-testid="breed-card"]', { hasText: uniqueName }).isVisible()) {
      found = true;
    } else {
      // If not found on current page, check if pagination exists and search through pages
      const paginationExists = await page.locator('[data-testid="pagination-next"]').isVisible();
      if (paginationExists) {
        while (true) {
          const isNextDisabled = await page.locator('[data-testid="pagination-next"]').isDisabled();
          if (isNextDisabled) break;
          await page.click('[data-testid="pagination-next"]');
          if (await page.locator('[data-testid="breed-card"]', { hasText: uniqueName }).isVisible()) {
            found = true;
            break;
          }
        }
      }
    }
    
    // If still not found, let's check what breeds are actually visible for debugging
    if (!found) {
      const visibleBreeds = await page.locator('[data-testid="breed-card"]').allTextContents();
      console.log('Visible breeds:', visibleBreeds);
      console.log('Looking for breed:', uniqueName);
    }
    
    expect(found).toBeTruthy();
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
    
    // Wait for navigation back to the home page
    await expect(page).toHaveURL('/');
    
    // Wait for the breed list to load and check for the edited breed
    await expect(page.locator('[data-testid="breed-card"]', { hasText: 'Edited Breed' })).toBeVisible();
  });

  test('pagination works when there are more than 12 breeds', async ({ page }) => {
    // Create 13 unique breeds
    const createdNames: string[] = [];
    for (let i = 0; i < 13; i++) {
      await page.goto('/');
      await page.click('[data-testid="add-breed-btn"]');
      const uniqueName = `Playwright Pagination Test Breed ${Date.now()}-${Math.random()}-${i}`;
      createdNames.push(uniqueName);
      await page.fill('input[name="name"]', uniqueName);
      await page.selectOption('select[name="breed_group"]', { label: 'Sporting' });
      await page.fill('input[name="temperament"]', 'Friendly');
      await page.fill('input[name="life_span"]', '10-12 years');
      await page.fill('input[name="height_min"]', '30');
      await page.fill('input[name="height_max"]', '40');
      await page.fill('input[name="weight_min"]', '10');
      await page.fill('input[name="weight_max"]', '20');
      await page.fill('textarea[name="description"]', 'A breed created by Playwright pagination test.');
      await page.fill('input[name="image_url"]', 'https://example.com/test.jpg');
      await page.click('[data-testid="submit-breed-btn"]');
      
      // Wait for navigation back to the home page
      await expect(page).toHaveURL('/');
    }

    // Now verify pagination
    await page.goto('/');
    // Wait for the first page to be full
    await expect(page.locator('[data-testid="breed-card"]')).toHaveCount(12);
    // Determine the number of pages by checking if the Next button is enabled
    let foundOnAnyPage = false;
    let pageNum = 1;
    
    // Check if any created breed is visible on the first page
    for (const name of createdNames) {
      if (await page.locator('[data-testid="breed-card"]', { hasText: name }).isVisible()) {
        foundOnAnyPage = true;
        break;
      }
    }
    
    // If not found on first page, check subsequent pages
    if (!foundOnAnyPage) {
      while (true) {
        // If Next button is disabled, stop
        const isNextDisabled = await page.locator('[data-testid="pagination-next"]').isDisabled();
        if (isNextDisabled) break;
        // Go to next page
        await page.click('[data-testid="pagination-next"]');
        pageNum++;
        
        // Check if any created breed is visible on this page
        for (const name of createdNames) {
          if (await page.locator('[data-testid="breed-card"]', { hasText: name }).isVisible()) {
            foundOnAnyPage = true;
            break;
          }
        }
        if (foundOnAnyPage) break;
      }
    }
    expect(foundOnAnyPage).toBeTruthy();
  });
}); 