import { Linking, Alert } from 'react-native';
import { extractDomain } from '../utils/helpers';

/**
 * LinkSecurityManager - Handles link security and opening
 * Follows Single Responsibility Principle - only handles link security logic
 */
class LinkSecurityManager {
  static allowedDomains = new Set([
    'en.wikipedia.org',
    'wikipedia.org',
  ]);

  /**
   * Check if a domain is allowed to be opened
   * @param {string} domain - Domain to check
   * @returns {boolean} True if domain is allowed
   */
  static isDomainAllowed(domain) {
    return this.allowedDomains.has(domain);
  }

  /**
   * Add a domain to the allowed list
   * @param {string} domain - Domain to add
   */
  static addAllowedDomain(domain) {
    this.allowedDomains.add(domain);
  }

  /**
   * Remove a domain from the allowed list
   * @param {string} domain - Domain to remove
   */
  static removeAllowedDomain(domain) {
    this.allowedDomains.delete(domain);
  }

  /**
   * Get all allowed domains
   * @returns {Set} Set of allowed domains
   */
  static getAllowedDomains() {
    return new Set(this.allowedDomains);
  }

  /**
   * Handle link press with security checks
   * @param {Object} link - Link object with url and title
   * @returns {Promise<void>}
   */
  static async handleLinkPress(link) {
    try {
      const domain = extractDomain(link.url);

      if (!this.isDomainAllowed(domain)) {
        Alert.alert(
          'Warning',
          'This link cannot be opened for security reasons.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add to Allowed',
              onPress: () => {
                this.addAllowedDomain(domain);
                this.handleLinkPress(link); // Retry after adding
              }
            }
          ]
        );
        return;
      }

      const supported = await Linking.canOpenURL(link.url);
      if (supported) {
        await Linking.openURL(link.url);
      } else {
        Alert.alert('Error', 'Unable to open this link');
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert('Error', 'Unable to open this link');
    }
  }

  /**
   * Validate if a URL is safe to open
   * @param {string} url - URL to validate
   * @returns {Promise<boolean>} True if URL is safe
   */
  static async isUrlSafe(url) {
    try {
      const domain = extractDomain(url);
      return this.isDomainAllowed(domain);
    } catch (error) {
      return false;
    }
  }

  /**
   * Show security warning for untrusted domains
   * @param {string} domain - Domain that was blocked
   */
  static showSecurityWarning(domain) {
    Alert.alert(
      'Security Warning',
      `The domain "${domain}" is not in the allowed list. This link cannot be opened for security reasons.`,
      [
        { text: 'OK', style: 'default' }
      ]
    );
  }

  /**
   * Get security statistics
   * @returns {Object} Security statistics
   */
  static getSecurityStats() {
    return {
      allowedDomainsCount: this.allowedDomains.size,
      allowedDomains: Array.from(this.allowedDomains)
    };
  }
}

export default LinkSecurityManager;
