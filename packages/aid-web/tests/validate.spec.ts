import { test, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';

test.describe('Validator Page', () => {
  const samplesDir = path.join(__dirname, '../../public/samples');

  test.beforeEach(async ({ page }) => {
    await page.goto('/validate');
  });

  test('should load a valid generator config and show a success report', async ({ page }) => {
    // Select "Generator Config" type
    await page.locator('label:has-text("Generator Config")').click();

    // The DropZone component creates a hidden file input. We can use it to set the file.
    const input = await page.locator('input[type="file"]');
    await input.setInputFiles(path.join(samplesDir, 'simple.json'));
    
    // Check that the file name is displayed
    await expect(page.locator('p:has-text("simple.json")')).toBeVisible();

    await page.locator('button:has-text("Validate")').click();

    const successAlert = page.locator('div[role="alert"]:has-text("Validation Passed")');
    await expect(successAlert).toBeVisible();
  });

  test('should validate a pasted TXT record and show a success report', async ({ page }) => {
    await page.locator('button[role="tab"]:has-text("Paste Content")').click();
    await page.locator('label:has-text("DNS TXT")').click();
    
    await page.locator('textarea').fill('v=aid1;uri=https://example.com/api;proto=mcp');

    await page.locator('button:has-text("Validate")').click();
    
    const successAlert = page.locator('div[role="alert"]:has-text("Validation Passed")');
    await expect(successAlert).toBeVisible();
  });

  test('should show errors for an invalid manifest', async ({ page }) => {
    await page.locator('button[role="tab"]:has-text("Paste Content")').click();
    await page.locator('label:has-text("Manifest")').click();
    
    const badManifest = {
      schemaVersion: "2", // Invalid version
      // Missing implementations
      extraUnknownField: "should be flagged"
    };

    await page.locator('textarea').fill(JSON.stringify(badManifest, null, 2));

    await page.locator('button:has-text("Validate")').click();
    
    const failureAlert = page.locator('div[role="alert"]:has-text("Validation Failed")');
    await expect(failureAlert).toBeVisible();

    const errorCount = await failureAlert.locator('li').count();
    expect(errorCount).toBeGreaterThan(0);
  });
});
 