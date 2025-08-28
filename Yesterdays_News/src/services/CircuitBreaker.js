/**
 * CircuitBreaker - Implements circuit breaker pattern for API calls
 * Follows Single Responsibility Principle - only handles circuit breaker logic
 */
class CircuitBreaker {
  static circuit = new Map(); // sourceKey -> { state: 'closed'|'open'|'half', lastFailure: number, openUntil: number }

  /**
   * Check if request can be made to source
   * @param {string} sourceKey - Source identifier
   * @returns {boolean} True if request can be made
   */
  static canRequest(sourceKey) {
    const entry = this.circuit.get(sourceKey);
    if (!entry) return true;

    if (entry.state === 'open' && Date.now() < entry.openUntil) {
      return false;
    }

    if (entry.state === 'open' && Date.now() >= entry.openUntil) {
      // Move to half-open
      this.circuit.set(sourceKey, {
        state: 'half',
        lastFailure: entry.lastFailure,
        openUntil: 0
      });
      return true;
    }

    return true;
  }

  /**
   * Record a failure for the source
   * @param {string} sourceKey - Source identifier
   */
  static recordFailure(sourceKey) {
    const now = Date.now();
    const backoffMs = 60000; // 60s open window
    this.circuit.set(sourceKey, {
      state: 'open',
      lastFailure: now,
      openUntil: now + backoffMs
    });
  }

  /**
   * Record a success for the source
   * @param {string} sourceKey - Source identifier
   */
  static recordSuccess(sourceKey) {
    this.circuit.set(sourceKey, {
      state: 'closed',
      lastFailure: 0,
      openUntil: 0
    });
  }

  /**
   * Get circuit breaker stats for monitoring
   * @returns {Object} Circuit breaker statistics
   */
  static getStats() {
    const stats = {};
    for (const [sourceKey, entry] of this.circuit) {
      stats[sourceKey] = {
        state: entry.state,
        lastFailure: entry.lastFailure ? new Date(entry.lastFailure).toISOString() : null,
        openUntil: entry.openUntil ? new Date(entry.openUntil).toISOString() : null,
        isOpen: entry.state === 'open' && Date.now() < entry.openUntil
      };
    }
    return stats;
  }

  /**
   * Reset circuit breaker for a source
   * @param {string} sourceKey - Source identifier
   */
  static reset(sourceKey) {
    this.circuit.delete(sourceKey);
  }

  /**
   * Reset all circuit breakers
   */
  static resetAll() {
    this.circuit.clear();
  }

  /**
   * Get sources currently in open state
   * @returns {Array} Array of open source keys
   */
  static getOpenSources() {
    const openSources = [];
    for (const [sourceKey, entry] of this.circuit) {
      if (entry.state === 'open' && Date.now() < entry.openUntil) {
        openSources.push(sourceKey);
      }
    }
    return openSources;
  }

  /**
   * Get sources in half-open state
   * @returns {Array} Array of half-open source keys
   */
  static getHalfOpenSources() {
    const halfOpenSources = [];
    for (const [sourceKey, entry] of this.circuit) {
      if (entry.state === 'half') {
        halfOpenSources.push(sourceKey);
      }
    }
    return halfOpenSources;
  }
}

export default CircuitBreaker;
