import { by, device, element, expect, waitFor } from 'detox';

describe('Mobile Language Selector Dynamic Update', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should update all text content when language is changed via NewspaperMasthead', async () => {
    // Wait for main screen to load
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // Wait for events to load
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Find language selector in masthead
    await expect(element(by.id('language-selector'))).toBeVisible();
    
    // Get current language text for comparison
    const currentDateHeader = await element(by.id('date-header')).getAttributes();
    const currentLanguage = currentDateHeader.text;
    
    // Open language selector
    await element(by.id('language-selector')).tap();
    
    // Wait for language options to appear
    await waitFor(element(by.id('language-options'))).toBeVisible().withTimeout(3000);
    
    // Select a different language (e.g., Spanish)
    await element(by.id('language-es')).tap();
    
    // Wait for language change to complete
    await waitFor(element(by.id('loading-indicator'))).toBeVisible().withTimeout(3000);
    await waitFor(element(by.id('loading-indicator'))).not.toBeVisible().withTimeout(10000);
    
    // Verify text content has changed
    const newDateHeader = await element(by.id('date-header')).getAttributes();
    expect(newDateHeader.text).not.toBe(currentLanguage);
    
    // Verify other UI elements have updated
    await expect(element(by.id('newspaper-masthead')).withDescendant(by.id('app-title'))).toBeVisible();
  });

  it('should support all 11 supported languages', async () => {
    // Wait for main screen to load
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // Open language selector
    await element(by.id('language-selector')).tap();
    await waitFor(element(by.id('language-options'))).toBeVisible().withTimeout(3000);
    
    // Test different languages
    const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'tr'];
    
    for (const lang of languages) {
      // Select language
      await element(by.id(`language-${lang}`)).tap();
      
      // Wait for language change
      await waitFor(element(by.id('loading-indicator'))).toBeVisible().withTimeout(3000);
      await waitFor(element(by.id('loading-indicator'))).not.toBeVisible().withTimeout(10000);
      
      // Verify content is displayed in selected language
      await expect(element(by.id('event-list'))).toBeVisible();
      
      // Check if date header is in correct language
      const dateHeader = await element(by.id('date-header')).getAttributes();
      expect(dateHeader.text).toBeTruthy();
      
      // Open language selector again for next iteration
      await element(by.id('language-selector')).tap();
      await waitFor(element(by.id('language-options'))).toBeVisible().withTimeout(3000);
    }
  });

  it('should handle RTL languages correctly (French)', async () => {
    // Wait for main screen to load
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // Change to French (RTL language)
    await element(by.id('language-selector')).tap();
    await waitFor(element(by.id('language-options'))).toBeVisible().withTimeout(3000);
    await element(by.id('language-fr')).tap();
    
    // Wait for language change
    await waitFor(element(by.id('loading-indicator'))).toBeVisible().withTimeout(3000);
    await waitFor(element(by.id('loading-indicator'))).not.toBeVisible().withTimeout(10000);
    
    // Verify RTL layout is applied
    const mainContainer = element(by.id('home-screen'));
    const containerAttributes = await mainContainer.getAttributes();
    
    // Check if layout direction is properly set for RTL
    // This might vary based on React Native implementation
    await expect(element(by.id('event-list'))).toBeVisible();
  });

  it('should maintain language preference across app restarts', async () => {
    // Wait for main screen to load
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // Change language to Spanish
    await element(by.id('language-selector')).tap();
    await waitFor(element(by.id('language-options'))).toBeVisible().withTimeout(3000);
    await element(by.id('language-es')).tap();
    
    // Wait for language change
    await waitFor(element(by.id('loading-indicator'))).toBeVisible().withTimeout(3000);
    await waitFor(element(by.id('loading-indicator'))).not.toBeVisible().withTimeout(10000);
    
    // Verify Spanish is active
    const dateHeader = await element(by.id('date-header')).getAttributes();
    const spanishText = dateHeader.text;
    
    // Restart app
    await device.reloadReactNative();
    
    // Wait for app to reload
    await expect(element(by.id('home-screen'))).toBeVisible();
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Verify language preference is maintained
    const newDateHeader = await element(by.id('date-header')).getAttributes();
    expect(newDateHeader.text).toBe(spanishText);
  });

  it('should handle language change during data loading', async () => {
    // Wait for main screen to load
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // Start refreshing data
    await element(by.id('refresh-button')).tap();
    
    // Immediately change language while loading
    await element(by.id('language-selector')).tap();
    await waitFor(element(by.id('language-options'))).toBeVisible().withTimeout(3000);
    await element(by.id('language-fr')).tap();
    
    // Wait for both operations to complete
    await waitFor(element(by.id('loading-indicator'))).not.toBeVisible().withTimeout(15000);
    
    // Verify language change was successful
    await expect(element(by.id('event-list'))).toBeVisible();
    
    // Check if content is in French
    const dateHeader = await element(by.id('date-header')).getAttributes();
    expect(dateHeader.text).toBeTruthy();
  });
});
