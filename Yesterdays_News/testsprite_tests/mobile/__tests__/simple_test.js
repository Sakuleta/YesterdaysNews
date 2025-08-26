import { by, device, element, expect } from 'detox';

describe('Simple Mobile Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should launch app successfully', async () => {
    // Basic test to verify app launches
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should display basic UI elements', async () => {
    // Wait for app to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if basic elements are visible
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
