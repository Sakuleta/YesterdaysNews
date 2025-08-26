// Detox Jest setup file
import { beforeAll, beforeEach } from '@jest/globals';

// Global test setup
beforeAll(async () => {
  // Set longer timeout for mobile tests
  jest.setTimeout(120000);
});

beforeEach(async () => {
  // Reset app state before each test
  // This will be handled by Detox automatically
});

// Platform detection helpers
export const isIOS = () => device.getPlatform() === 'ios';
export const isAndroid = () => device.getPlatform() === 'android';

// Common test utilities
export const waitForElement = async (elementId, timeout = 10000) => {
  return waitFor(element(by.id(elementId))).toBeVisible().withTimeout(timeout);
};

export const tapElement = async (elementId) => {
  await element(by.id(elementId)).tap();
};

export const scrollToElement = async (elementId, direction = 'down') => {
  await element(by.id(elementId)).scrollTo(direction);
};

export const getElementText = async (elementId) => {
  const attributes = await element(by.id(elementId)).getAttributes();
  return attributes.text;
};

export const verifyElementVisible = async (elementId) => {
  await expect(element(by.id(elementId))).toBeVisible();
};

export const verifyElementNotVisible = async (elementId) => {
  await expect(element(by.id(elementId))).not.toBeVisible();
};
