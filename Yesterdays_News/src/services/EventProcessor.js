/**
 * EventProcessor - Handles event processing, deduplication, and scoring
 * Follows Single Responsibility Principle - only handles event processing logic
 */
class EventProcessor {
  /**
   * Combine, deduplicate, score and curate events for balanced feed
   * - Ensures diversity across eras (ancient → modern)
   * - Caps dense decades so one era doesn't dominate
   * - Ranks events by an interest score (recency, category, richness, source diversity)
   * @param {Array} localizedEvents - Events from localized sources
   * @param {Array} apiNinjasEvents - Events from API Ninjas
   * @param {Array} muffinLabsEvents - Events from MuffinLabs
   * @returns {Array} Curated events list
   */
  static combineAndDeduplicateEvents(localizedEvents, apiNinjasEvents, muffinLabsEvents) {
    try {
      const LIMIT = 60;
      const PER_DECADE_CAP = 3; // avoid clusters from the same decade

      // Filter out any null or undefined sources
      const validSources = [localizedEvents, apiNinjasEvents, muffinLabsEvents].filter(source => Array.isArray(source));
      const allEvents = [].concat(...validSources);

      // Filter out any invalid events
      const validEvents = allEvents.filter(event =>
        event &&
        event.year &&
        event.title &&
        typeof event.year === 'number' &&
        !isNaN(event.year) &&
        typeof event.title === 'string' &&
        event.title.trim().length > 0
      );

      // Deduplicate (title/year + fuzzy title)
      const uniqueEvents = [];
      const seenTitles = new Set();
      const seenYearTitle = new Set();

      for (const event of validEvents) {
        const normalizedTitle = event.title.toLowerCase().trim();
        const key = `${event.year}-${normalizedTitle}`;
        if (seenYearTitle.has(key)) continue;

        let duplicate = false;
        for (const t of seenTitles) {
          if (this.isSimilarTitle(normalizedTitle, t)) {
            duplicate = true;
            break;
          }
        }
        if (duplicate) continue;

        seenYearTitle.add(key);
        seenTitles.add(normalizedTitle);
        uniqueEvents.push(event);
      }

      // Score events for interest
      const scored = uniqueEvents.map(e => ({
        ...e,
        _score: this.scoreEventInterest(e)
      }));

      // Group by eras and decide targets
      const byEra = new Map();
      for (const e of scored) {
        const era = this.getEraForYear(e.year);
        if (!byEra.has(era)) byEra.set(era, []);
        byEra.get(era).push(e);
      }
      for (const [, list] of byEra) list.sort((a, b) => b._score - a._score);

      const targets = this.getEraTargets(LIMIT, byEra);

      // Select with per-decade cap inside each era
      const selected = [];
      const decadeCounters = new Map();

      const pickFromEra = (era, count) => {
        const list = byEra.get(era) || [];
        for (const ev of list) {
          if (selected.length >= LIMIT) break;
          if (count <= 0) break;
          const decade = Math.floor(ev.year / 10) * 10;
          const dKey = `${era}-${decade}`;
          const dCount = decadeCounters.get(dKey) || 0;
          if (dCount >= PER_DECADE_CAP) continue;
          // Avoid near-duplicate same-year titles already chosen
          const already = selected.find(s => s.year === ev.year && this.isSimilarTitle(s.title.toLowerCase(), ev.title.toLowerCase()));
          if (already) continue;

          selected.push(ev);
          decadeCounters.set(dKey, dCount + 1);
          count--;
        }
        return count;
      };

      // Primary pass by target allocations
      for (const [era, target] of targets) {
        pickFromEra(era, target);
      }

      // Secondary pass: fill remaining slots by global score with decade cap
      if (selected.length < LIMIT) {
        const remaining = scored
          .filter(e => !selected.includes(e))
          .sort((a, b) => b._score - a._score);
        for (const ev of remaining) {
          if (selected.length >= LIMIT) break;
          const era = this.getEraForYear(ev.year);
          const decade = Math.floor(ev.year / 10) * 10;
          const dKey = `${era}-${decade}`;
          const dCount = decadeCounters.get(dKey) || 0;
          if (dCount >= PER_DECADE_CAP) continue;
          const already = selected.find(s => s.year === ev.year && this.isSimilarTitle(s.title.toLowerCase(), ev.title.toLowerCase()));
          if (already) continue;
          selected.push(ev);
          decadeCounters.set(dKey, dCount + 1);
        }
      }

      // Final ordering: newest first; tie-break on score then title
      const finalList = selected
        .sort((a, b) => (b.year - a.year) || (b._score - a._score) || a.title.localeCompare(b.title))
        .map(({ _score, ...rest }) => rest); // strip score

      const eraCounts = finalList.reduce((acc, e) => {
        const era = this.getEraForYear(e.year);
        acc[era] = (acc[era] || 0) + 1;
        return acc;
      }, {});
      console.log('Era distribution:', eraCounts);

      return finalList;
    } catch (error) {
      console.error('Error combining and deduplicating events:', error);
      return [];
    }
  }

  /**
   * Compute an interest score for an event
   * - Recency gets a mild boost (but not dominant)
   * - Category weights (war/discovery/politics/etc.)
   * - Richness: description length and presence of links
   * - Source diversity bonus for non-Wikipedia sources
   */
  static scoreEventInterest(event) {
    const currentYear = new Date().getFullYear();
    const yearDelta = Math.max(0, currentYear - event.year);

    // Recency: newer gets slightly higher, capped
    const recencyScore = 1 - Math.min(yearDelta / 500, 1); // between 0 and 1

    const categoryWeights = {
      war: 1.0,
      discovery: 0.9,
      politics: 0.85,
      death: 0.5,
      birth: 0.4,
      event: 0.8
    };
    const categoryScore = categoryWeights[event.category] || 0.7;

    const descriptionScore = Math.min(((event.description || '').length) / 280, 1); // up to 1
    const linksScore = Math.min((event.links || []).length / 3, 1); // up to 1

    const sourceBonus = event.source === 'API Ninjas' ? 0.15 : event.source === 'MuffinLabs' ? 0.1 : 0;

    // Weighted sum, final between ~0 and ~4
    return (recencyScore * 0.6) + (categoryScore * 1.2) + (descriptionScore * 0.6) + (linksScore * 0.3) + sourceBonus;
  }

  /**
   * Map year to broad eras for balanced sampling
   */
  static getEraForYear(year) {
    if (year < 500) return 'ancient';
    if (year < 1500) return 'medieval';
    if (year < 1800) return 'early_modern';
    if (year < 1900) return 'nineteenth';
    if (year < 2000) return 'twentieth';
    return 'twenty_first';
  }

  /**
   * Decide target counts per era based on availability and a base template
   */
  static getEraTargets(limit, byEra) {
    // Base template totals ~60
    const base = new Map([
      ['ancient', 5],
      ['medieval', 8],
      ['early_modern', 10],
      ['nineteenth', 12],
      ['twentieth', 17],
      ['twenty_first', 8],
    ]);

    // Scale if limit != 60
    const baseTotal = Array.from(base.values()).reduce((a, b) => a + b, 0);
    const scale = limit / baseTotal;
    for (const [k, v] of base) base.set(k, Math.max(1, Math.floor(v * scale)));

    // Clamp by availability and collect deficits
    let total = 0;
    const deficits = [];
    for (const [era, target] of base) {
      const available = (byEra.get(era) || []).length;
      const capped = Math.min(target, available);
      base.set(era, capped);
      total += capped;
      if (capped < target) deficits.push({ era, missing: target - capped });
    }

    // If we still have room, distribute to eras with surplus proportionally by their availability
    if (total < limit) {
      const surplusPool = limit - total;
      const surplusEras = Array.from(byEra.entries())
        .map(([era, list]) => ({ era, available: list.length - (base.get(era) || 0) }))
        .filter(x => x.available > 0)
        .sort((a, b) => b.available - a.available);

      let remaining = surplusPool;
      for (const s of surplusEras) {
        if (remaining <= 0) break;
        const add = Math.min(s.available, Math.ceil(remaining / surplusEras.length));
        base.set(s.era, (base.get(s.era) || 0) + add);
        remaining -= add;
      }
    }

    return base;
  }

  /**
   * Check if two titles are similar (for better deduplication)
   * @param {string} title1 - First title
   * @param {string} title2 - Second title
   * @returns {boolean} True if titles are similar
   */
  static isSimilarTitle(title1, title2) {
    if (!title1 || !title2) return false;

    // Remove common words and punctuation for comparison
    const cleanTitle1 = title1.replace(/[^\w\s]/g, '').toLowerCase();
    const cleanTitle2 = title2.replace(/[^\w\s]/g, '').toLowerCase();

    // Split into words
    const words1 = cleanTitle1.split(/\s+/).filter(word => word.length > 2);
    const words2 = cleanTitle2.split(/\s+/).filter(word => word.length > 2);

    // Calculate similarity score
    let commonWords = 0;
    for (const word of words1) {
      if (words2.includes(word)) {
        commonWords++;
      }
    }

    // If more than 70% of words are common, consider them similar
    const similarityThreshold = 0.7;
    const maxWords = Math.max(words1.length, words2.length);

    return maxWords > 0 && (commonWords / maxWords) > similarityThreshold;
  }

  /**
   * Extract title from event text
   * @param {string} text - Full event text
   * @returns {string} Extracted title
   */
  static extractTitle(text) {
    // Handle null or undefined text
    if (!text || typeof text !== 'string') {
      return 'Untitled Event';
    }

    const sentences = text.split('.');
    let title = sentences[0] || text;

    if (title.length > 100) {
      const parts = title.split(' – ');
      title = parts[0] || title;
    }

    return title.length > 120 ? title.substring(0, 117) + '...' : title;
  }

  /**
   * Categorize event based on text content
   * @param {string} text - Event text
   * @returns {string} Event category
   */
  static categorizeEvent(text) {
    // Handle null or undefined text
    if (!text || typeof text !== 'string') {
      return 'event';
    }

    const lowerText = text.toLowerCase();

    if (lowerText.includes('born') || lowerText.includes('birth')) {
      return 'birth';
    } else if (lowerText.includes('died') || lowerText.includes('death') || lowerText.includes('executed')) {
      return 'death';
    } else if (lowerText.includes('war') || lowerText.includes('battle') || lowerText.includes('invasion')) {
      return 'war';
    } else if (lowerText.includes('discover') || lowerText.includes('invention') || lowerText.includes('patent')) {
      return 'discovery';
    } else if (lowerText.includes('earthquake') || lowerText.includes('volcano') || lowerText.includes('disaster')) {
      return 'disaster';
    } else if (lowerText.includes('king') || lowerText.includes('queen') || lowerText.includes('emperor') || lowerText.includes('crowned')) {
      return 'politics';
    } else if (lowerText.includes('treaty') || lowerText.includes('independence') || lowerText.includes('revolution')) {
      return 'politics';
    }

    return 'event';
  }

  /**
   * Normalize cache key to use Latin digits and hyphenated MM-DD
   * @param {string} key - Original key
   * @returns {string} Normalized key
   */
  static normalizeCacheKey(key) {
    const arabicIndic = '٠١٢٣٤٥٦٧٨٩';
    const easternArabic = '۰۱۲۳۴۵۶۷۸۹';
    const mapDigit = (ch) => {
      const i1 = arabicIndic.indexOf(ch);
      if (i1 >= 0) return String(i1);
      const i2 = easternArabic.indexOf(ch);
      if (i2 >= 0) return String(i2);
      return ch;
    };
    return key.split('').map(mapDigit).join('');
  }

  /**
   * Validate if a year is reasonable for historical events
   * @param {number} year - Year to validate
   * @returns {boolean} True if valid
   */
  static isValidHistoricalYear(year) {
    const currentYear = new Date().getFullYear();
    return year >= -3000 && year <= currentYear;
  }
}

export default EventProcessor;
