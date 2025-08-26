import { by, device, element, expect, waitFor } from 'detox';

describe('Mobile Historical Events Data Fetching', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should fetch and display current date historical events successfully', async () => {
    // Wait for main screen to load
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // Wait for events to load (check for loading state first)
    await expect(element(by.id('loading-skeleton'))).toBeVisible();
    
    // Wait for events to appear
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Verify events are displayed
    const eventCards = element(by.id('event-list')).withDescendant(by.id('event-card'));
    await expect(eventCards).toBeVisible();
    
    // Check if multiple events are loaded
    const eventCount = await element(by.id('event-list')).getAttributes();
    expect(eventCount.children.length).toBeGreaterThan(0);
    
    // Verify event card structure
    await expect(element(by.id('event-card')).withDescendant(by.id('event-year'))).toBeVisible();
    await expect(element(by.id('event-card')).withDescendant(by.id('event-title'))).toBeVisible();
    await expect(element(by.id('event-card')).withDescendant(by.id('event-description'))).toBeVisible();
  });

  it('should handle offline mode and cached events', async () => {
    // Enable airplane mode to simulate offline
    await device.setURLBlacklist(['*']);
    
    // Reload app
    await device.reloadReactNative();
    
    // Wait for main screen
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // Check if cached events are displayed
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(5000);
    
    // Verify offline indicator or message
    await expect(element(by.id('offline-indicator'))).toBeVisible();
    
    // Re-enable network
    await device.setURLBlacklist([]);
  });

  it('should refresh events when pull-to-refresh is triggered', async () => {
    // Wait for events to load
    await waitFor(element(by.id('event-list'))).toBeVisible().withTimeout(10000);
    
    // Perform pull-to-refresh gesture
    await element(by.id('event-list')).scrollTo('top');
    
    // Wait for refresh indicator
    await expect(element(by.id('refresh-indicator'))).toBeVisible();
    
    // Wait for refresh to complete
    await waitFor(element(by.id('refresh-indicator'))).not.toBeVisible().withTimeout(5000);
    
    // Verify events are still displayed
    await expect(element(by.id('event-list'))).toBeVisible();
  });
});
