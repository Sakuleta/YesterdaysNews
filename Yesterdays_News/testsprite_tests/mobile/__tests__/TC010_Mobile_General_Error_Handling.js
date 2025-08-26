import { by, device, element, expect, waitFor } from 'detox';

describe('Mobile General Error Handling with User-friendly Messages', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display appropriate error messages for general errors', async () => {
    // Wait for main screen to load
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // Simulate a general error by triggering an error condition
    // This could be done by manipulating the app state or triggering an error
    await element(by.id('trigger-error-button')).tap();
    
    // Wait for error message to appear
    await waitFor(element(by.id('error-message'))).toBeVisible().withTimeout(5000);
    
    // Verify error message content is user-friendly
    const errorMessage = element(by.id('error-message'));
    await expect(errorMessage).toBeVisible();
    
    // Check if error message contains helpful text (not JavaScript requirement)
    const messageText = await errorMessage.getAttributes();
    expect(messageText.text).not.toContain('JavaScript');
    expect(messageText.text).not.toContain('enable');
    
    // Verify error message has proper styling
    expect(messageText.alpha).toBe(1.0);
    expect(messageText.enabled).toBe(true);
  });

  it('should provide retry options for general errors', async () => {
    // Trigger error condition
    await element(by.id('trigger-error-button')).tap();
    
    // Wait for error message
    await waitFor(element(by.id('error-message'))).toBeVisible().withTimeout(5000);
    
    // Check for retry button
    await expect(element(by.id('retry-button'))).toBeVisible();
    
    // Verify retry button is tappable
    const retryButton = element(by.id('retry-button'));
    await expect(retryButton).toBeVisible();
    
    // Test retry functionality
    await retryButton.tap();
    
    // Wait for retry to complete
    await waitFor(element(by.id('loading-indicator'))).toBeVisible().withTimeout(3000);
    
    // Verify error is resolved
    await waitFor(element(by.id('error-message'))).not.toBeVisible().withTimeout(10000);
  });

  it('should handle different error types appropriately', async () => {
    // Test network error
    await device.setURLBlacklist(['*']);
    await element(by.id('refresh-button')).tap();
    
    await waitFor(element(by.id('error-message'))).toBeVisible().withTimeout(5000);
    const networkError = element(by.id('error-message'));
    await expect(networkError).toBeVisible();
    
    // Re-enable network
    await device.setURLBlacklist([]);
    
    // Test data parsing error
    await element(by.id('trigger-parsing-error')).tap();
    await waitFor(element(by.id('error-message'))).toBeVisible().withTimeout(5000);
    
    // Verify different error types show appropriate messages
    const errorText = await element(by.id('error-message')).getAttributes();
    expect(errorText.text).toBeTruthy();
  });

  it('should maintain error state across app lifecycle', async () => {
    // Trigger error
    await element(by.id('trigger-error-button')).tap();
    await waitFor(element(by.id('error-message'))).toBeVisible().withTimeout(5000);
    
    // Background the app
    await device.sendToHome();
    
    // Return to app
    await device.launchApp();
    
    // Verify error state is maintained or properly handled
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // Check if error message is still appropriate
    const errorElement = element(by.id('error-message'));
    if (await errorElement.isVisible()) {
      const errorText = await errorElement.getAttributes();
      expect(errorText.text).not.toContain('JavaScript');
    }
  });

  it('should provide fallback UI when errors occur', async () => {
    // Trigger error condition
    await element(by.id('trigger-error-button')).tap();
    
    // Wait for error message
    await waitFor(element(by.id('error-message'))).toBeVisible().withTimeout(5000);
    
    // Check for fallback content
    await expect(element(by.id('fallback-content'))).toBeVisible();
    
    // Verify fallback content is functional
    const fallbackContent = element(by.id('fallback-content'));
    await expect(fallbackContent).toBeVisible();
    
    // Check if fallback provides alternative functionality
    await expect(element(by.id('offline-mode-button'))).toBeVisible();
    
    // Test offline mode functionality
    await element(by.id('offline-mode-button')).tap();
    await expect(element(by.id('offline-mode-indicator'))).toBeVisible();
  });
});
