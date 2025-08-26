import { by, device, element, expect } from 'detox';

describe('Mobile App Launch and Splash Screen Display', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display animated newspaper-themed splash screen with gear animation', async () => {
    // Wait for splash screen to be visible
    await expect(element(by.id('newspaper-splash-screen'))).toBeVisible();
    
    // Verify gear animation is present
    await expect(element(by.id('gear-animation'))).toBeVisible();
    
    // Check for newspaper theme elements
    await expect(element(by.id('newspaper-texture'))).toBeVisible();
    await expect(element(by.id('newspaper-masthead'))).toBeVisible();
    
    // Wait for splash screen animation to complete (typically 3-5 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verify splash screen disappears
    await expect(element(by.id('newspaper-splash-screen'))).not.toBeVisible();
    
    // Confirm main screen loads
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should handle app launch performance on different device types', async () => {
    // Test launch time
    const startTime = Date.now();
    
    await device.reloadReactNative();
    
    // Wait for splash screen
    await expect(element(by.id('newspaper-splash-screen'))).toBeVisible();
    
    // Wait for main screen
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    const launchTime = Date.now() - startTime;
    
    // Launch should complete within reasonable time (adjust based on device performance)
    expect(launchTime).toBeLessThan(10000); // 10 seconds max
  });
});
