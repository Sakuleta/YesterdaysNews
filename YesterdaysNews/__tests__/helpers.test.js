import {
  truncateText,
  capitalizeWords,
  formatNumber,
  isEmpty,
  formatErrorMessage,
  isValidHistoricalYear,
  extractDomain,
  safeJsonParse
} from '../src/utils/helpers';

describe('Helper Functions', () => {
  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long...');
    });

    it('should return original text if shorter than max length', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe('Short text');
    });

    it('should handle null/undefined text', () => {
      expect(truncateText(null, 10)).toBe(null);
      expect(truncateText(undefined, 10)).toBe(undefined);
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word', () => {
      const result = capitalizeWords('hello world test');
      expect(result).toBe('Hello World Test');
    });

    it('should handle empty string', () => {
      expect(capitalizeWords('')).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(capitalizeWords(null)).toBe('');
      expect(capitalizeWords(undefined)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format large numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(123)).toBe('123');
    });

    it('should handle zero and null', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(null)).toBe('0');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty/whitespace strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('\\t\n')).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty('  hello  ')).toBe(false);
    });

    it('should handle null/undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });
  });

  describe('formatErrorMessage', () => {
    it('should format string errors', () => {
      expect(formatErrorMessage('Network error')).toBe('Network error');
    });

    it('should format Error objects', () => {
      const error = new Error('Test error');
      expect(formatErrorMessage(error)).toBe('Test error');
    });

    it('should handle unknown error types', () => {
      expect(formatErrorMessage({})).toBe('An unexpected error occurred');
      expect(formatErrorMessage(null)).toBe('An unexpected error occurred');
    });
  });

  describe('isValidHistoricalYear', () => {
    it('should validate reasonable historical years', () => {
      expect(isValidHistoricalYear(2025)).toBe(true);
      expect(isValidHistoricalYear(1969)).toBe(true);
      expect(isValidHistoricalYear(79)).toBe(true);
      expect(isValidHistoricalYear(-500)).toBe(true);
    });

    it('should reject unreasonable years', () => {
      expect(isValidHistoricalYear(-5000)).toBe(false);
      expect(isValidHistoricalYear(3000)).toBe(false);
    });
  });

  describe('extractDomain', () => {
    it('should extract domain from valid URLs', () => {
      expect(extractDomain('https://en.wikipedia.org/wiki/Test')).toBe('en.wikipedia.org');
      expect(extractDomain('http://example.com')).toBe('example.com');
    });

    it('should handle invalid URLs', () => {
      expect(extractDomain('invalid-url')).toBe('');
      expect(extractDomain('')).toBe('');
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const json = '{\"key\": \"value\"}';
      const result = safeJsonParse(json);
      expect(result).toEqual({ key: 'value' });
    });

    it('should return fallback for invalid JSON', () => {
      const result = safeJsonParse('invalid json', { default: true });
      expect(result).toEqual({ default: true });
    });

    it('should return null as default fallback', () => {
      const result = safeJsonParse('invalid json');
      expect(result).toBe(null);
    });
  });
});