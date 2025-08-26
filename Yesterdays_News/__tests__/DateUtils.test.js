import DateUtils from '../src/services/DateUtils';
import moment from 'moment';

// Mock moment for consistent testing
jest.mock('moment', () => {
  const originalMoment = jest.requireActual('moment');
  return {
    ...originalMoment,
    __esModule: true,
    default: jest.fn(() => originalMoment('2025-08-23T10:00:00.000Z')),
  };
});

describe('DateUtils', () => {
  beforeEach(() => {
    // Reset moment mock to return August 23, 2025
    const originalMoment = jest.requireActual('moment');
    moment.mockImplementation(() => originalMoment('2025-08-23T10:00:00.000Z'));
  });

  describe('getCurrentDateFormatted', () => {
    it('should return formatted current date', () => {
      const formattedDate = DateUtils.getCurrentDateFormatted();
      expect(formattedDate).toBe('August 23, 2025');
    });
  });

  describe('getCurrentDateForAPI', () => {
    it('should return current date in API format', () => {
      const apiDate = DateUtils.getCurrentDateForAPI();
      expect(apiDate).toEqual({
        month: '08',
        day: '23'
      });
    });
  });

  describe('getCurrentDateCacheKey', () => {
    it('should return cache key for current date', () => {
      const cacheKey = DateUtils.getCurrentDateCacheKey();
      expect(cacheKey).toBe('08-23');
    });
  });

  describe('getDateCacheKey', () => {
    it('should return cache key for given date', () => {
      // Mock moment to return specific date for this test
      const originalMoment = jest.requireActual('moment');
      moment.mockImplementationOnce(() => originalMoment('2025-12-25'));
      
      const testDate = new Date('2025-12-25');
      const cacheKey = DateUtils.getDateCacheKey(testDate);
      expect(cacheKey).toBe('12-25');
    });
  });

  describe('formatYear', () => {
    it('should format BC years correctly', () => {
      expect(DateUtils.formatYear(-79)).toBe('79 BC');
      expect(DateUtils.formatYear(-1)).toBe('1 BC');
    });

    it('should format early AD years correctly', () => {
      expect(DateUtils.formatYear(79)).toBe('79 AD');
      expect(DateUtils.formatYear(999)).toBe('999 AD');
    });

    it('should format recent years correctly', () => {
      expect(DateUtils.formatYear(1969)).toBe('1969');
      expect(DateUtils.formatYear(2025)).toBe('2025');
    });
  });

  describe('getCurrentDayOfWeek', () => {
    it('should return current day of week', () => {
      const dayOfWeek = DateUtils.getCurrentDayOfWeek();
      expect(dayOfWeek).toBe('Saturday'); // August 23, 2025 is a Saturday
    });
  });
});