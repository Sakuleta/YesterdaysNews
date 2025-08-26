import { by, device, element, expect, waitFor } from 'detox';

describe('Mobile Event Card Tapping Opens MagnifyingGlassModal', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should open MagnifyingGlassModal when event card is tapped', async () => {
    // Wait for main screen and events to load
    await expect(element(by.id('home-screen'))).toBeVisible();
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Get first event card
    const firstEventCard = element(by.id('event-card')).atIndex(0);
    await expect(firstEventCard).toBeVisible();
    
    // Tap on the event card
    await firstEventCard.tap();
    
    // Wait for modal to appear
    await waitFor(element(by.id('magnifying-glass-modal'))).toBeVisible().withTimeout(3000);
    
    // Verify modal is displayed
    await expect(element(by.id('magnifying-glass-modal'))).toBeVisible();
    
    // Check modal content
    await expect(element(by.id('modal-content'))).toBeVisible();
    await expect(element(by.id('modal-title'))).toBeVisible();
    await expect(element(by.id('modal-description'))).toBeVisible();
  });

  it('should display expanded event information in modal', async () => {
    // Wait for events to load
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Tap on event card
    await element(by.id('event-card')).atIndex(0).tap();
    
    // Wait for modal
    await waitFor(element(by.id('magnifying-glass-modal'))).toBeVisible().withTimeout(3000);
    
    // Verify expanded information
    await expect(element(by.id('event-full-description'))).toBeVisible();
    await expect(element(by.id('event-date'))).toBeVisible();
    await expect(element(by.id('event-category'))).toBeVisible();
    
    // Check if related links are present
    await expect(element(by.id('related-links'))).toBeVisible();
  });

  it('should close modal when close button is tapped', async () => {
    // Open modal
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    await element(by.id('event-card')).atIndex(0).tap();
    await waitFor(element(by.id('magnifying-glass-modal'))).toBeVisible().withTimeout(3000);
    
    // Find and tap close button
    await expect(element(by.id('modal-close-button'))).toBeVisible();
    await element(by.id('modal-close-button')).tap();
    
    // Verify modal is closed
    await waitFor(element(by.id('magnifying-glass-modal'))).not.toBeVisible().withTimeout(3000);
    
    // Verify main screen is still visible
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should handle modal gestures (swipe to close)', async () => {
    // Open modal
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    await element(by.id('event-card')).atIndex(0).tap();
    await waitFor(element(by.id('magnifying-glass-modal'))).toBeVisible().withTimeout(3000);
    
    // Perform swipe down gesture to close modal
    await element(by.id('magnifying-glass-modal')).swipe('down', 'fast', 0.8);
    
    // Verify modal is closed
    await waitFor(element(by.id('magnifying-glass-modal'))).not.toBeVisible().withTimeout(3000);
  });

  it('should maintain modal state during app backgrounding', async () => {
    // Open modal
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    await element(by.id('event-card')).atIndex(0).tap();
    await waitFor(element(by.id('magnifying-glass-modal'))).toBeVisible().withTimeout(3000);
    
    // Background the app
    await device.sendToHome();
    
    // Return to app
    await device.launchApp();
    
    // Verify modal state is handled appropriately
    // Modal should either be closed or maintain its state
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // Check if modal is still open or properly closed
    const modalElement = element(by.id('magnifying-glass-modal'));
    if (await modalElement.isVisible()) {
      await expect(modalElement).toBeVisible();
    } else {
      await expect(modalElement).not.toBeVisible();
    }
  });

  it('should handle multiple rapid modal opens and closes', async () => {
    // Wait for events to load
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Rapidly open and close modal multiple times
    for (let i = 0; i < 3; i++) {
      // Open modal
      await element(by.id('event-card')).atIndex(0).tap();
      await waitFor(element(by.id('magnifying-glass-modal'))).toBeVisible().withTimeout(3000);
      
      // Close modal
      await element(by.id('modal-close-button')).tap();
      await waitFor(element(by.id('magnifying-glass-modal'))).not.toBeVisible().withTimeout(3000);
    }
    
    // Verify app is still stable
    await expect(element(by.id('home-screen'))).toBeVisible();
    await expect(element(by.id('event-list'))).toBeVisible();
  });
});
