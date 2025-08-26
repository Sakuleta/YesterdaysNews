import DateUtils from '../src/services/DateUtils';

// No moment mocking for this test file - use real timestamps
describe('DateUtils - isCacheValid (Real Time Tests)', () => {
  describe('isCacheValid', () => {
    it('should return true for recent timestamp', () => {
      // Use real timestamps for this test
      const recentTimestamp = Date.now() - (1000 * 60 * 60 * 2); // 2 hours ago
      const isValid = DateUtils.isCacheValid(recentTimestamp);
      expect(isValid).toBe(true);
    });

    it('should return false for old timestamp', () => {
      // Use real timestamps for this test
      const oldTimestamp = Date.now() - (1000 * 60 * 60 * 25); // 25 hours ago
      const isValid = DateUtils.isCacheValid(oldTimestamp);
      expect(isValid).toBe(false);
    });
  });
});
