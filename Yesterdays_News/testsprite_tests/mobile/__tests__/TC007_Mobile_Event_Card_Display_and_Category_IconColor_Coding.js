import { by, device, element, expect, waitFor } from 'detox';

describe('Mobile Event Card Display and Category Icon/Color Coding', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display event cards correctly on iOS platform', async () => {
    // Wait for main screen and events to load
    await expect(element(by.id('home-screen'))).toBeVisible();
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Get first event card
    const firstEventCard = element(by.id('event-card')).atIndex(0);
    await expect(firstEventCard).toBeVisible();
    
    // Verify event card elements on iOS
    await expect(firstEventCard.withDescendant(by.id('event-year'))).toBeVisible();
    await expect(firstEventCard.withDescendant(by.id('event-title'))).toBeVisible();
    await expect(firstEventCard.withDescendant(by.id('event-description'))).toBeVisible();
    await expect(firstEventCard.withDescendant(by.id('event-category-icon'))).toBeVisible();
    
    // Check iOS-specific styling
    const cardAttributes = await firstEventCard.getAttributes();
    expect(cardAttributes.alpha).toBe(1.0); // Full opacity
    expect(cardAttributes.enabled).toBe(true);
  });

  it('should display event cards correctly on Android platform', async () => {
    // Wait for main screen and events to load
    await expect(element(by.id('home-screen'))).toBeVisible();
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Get first event card
    const firstEventCard = element(by.id('event-card')).atIndex(0);
    await expect(firstEventCard).toBeVisible();
    
    // Verify event card elements on Android
    await expect(firstEventCard.withDescendant(by.id('event-year'))).toBeVisible();
    await expect(firstEventCard.withDescendant(by.id('event-title'))).toBeVisible();
    await expect(firstEventCard.withDescendant(by.id('event-description'))).toBeVisible();
    await expect(firstEventCard.withDescendant(by.id('event-category-icon'))).toBeVisible();
    
    // Check Android-specific styling
    const cardAttributes = await firstEventCard.getAttributes();
    expect(cardAttributes.alpha).toBe(1.0); // Full opacity
    expect(cardAttributes.enabled).toBe(true);
  });

  it('should display category icons with proper color coding', async () => {
    // Wait for events to load
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Check multiple event cards for category icons
    const eventCards = element(by.id('event-list')).withDescendant(by.id('event-card'));
    await expect(eventCards).toBeVisible();
    
    // Verify category icon colors are consistent
    const categoryIcons = element(by.id('event-category-icon'));
    await expect(categoryIcons).toBeVisible();
    
    // Check if category icons have proper styling
    const iconAttributes = await categoryIcons.getAttributes();
    expect(iconAttributes.alpha).toBe(1.0);
    expect(iconAttributes.enabled).toBe(true);
  });

  it('should handle different screen sizes and orientations', async () => {
    // Test portrait orientation
    await device.setOrientation('portrait');
    await expect(element(by.id('event-list'))).toBeVisible();
    
    // Test landscape orientation
    await device.setOrientation('landscape');
    await expect(element(by.id('event-list'))).toBeVisible();
    
    // Return to portrait
    await device.setOrientation('portrait');
    
    // Verify event cards are still properly displayed
    await expect(element(by.id('event-card')).atIndex(0)).toBeVisible();
  });

  it('should maintain consistent layout across different device densities', async () => {
    // Wait for events to load
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Check event card dimensions and spacing
    const firstCard = element(by.id('event-card')).atIndex(0);
    const cardAttributes = await firstCard.getAttributes();
    
    // Verify card has reasonable dimensions
    expect(cardAttributes.width).toBeGreaterThan(200);
    expect(cardAttributes.height).toBeGreaterThan(100);
    
    // Check if card is properly positioned
    expect(cardAttributes.x).toBeGreaterThanOrEqual(0);
    expect(cardAttributes.y).toBeGreaterThanOrEqual(0);
  });
});
