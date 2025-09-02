/**
 * @typedef {Object} Event
 * @property {string} id - Unique identifier for the event
 * @property {number} year - Year when the event occurred
 * @property {string} title - Short title of the event
 * @property {string} description - Full description of the event
 * @property {string} category - Category of the event (event, birth, death, war, discovery, disaster, politics)
 * @property {string} source - Source of the event data (Wikipedia, Deutsche Digitale Bibliothek)
 * @property {Array<Link>} [links] - Related links for the event
 */

/**
 * @typedef {Object} Link
 * @property {string} title - Title of the linked article
 * @property {string} url - URL of the linked article
 */

/**
 * @typedef {Object} EventCategory
 * @property {string} name - Category name
 * @property {string} icon - MaterialIcon name for the category
 * @property {string} color - Color associated with the category
 */

/**
 * @typedef {Object} EventFilter
 * @property {Array<string>} [categories] - Categories to filter by
 * @property {Array<string>} [sources] - Sources to filter by
 * @property {number} [minYear] - Minimum year to include
 * @property {number} [maxYear] - Maximum year to include
 * @property {string} [searchText] - Text to search for in title/description
 */

/**
 * @typedef {Object} EventList
 * @property {Array<Event>} events - Array of events
 * @property {boolean} loading - Whether events are being loaded
 * @property {string|null} error - Error message if loading failed
 * @property {boolean} hasMore - Whether more events are available
 * @property {number} totalCount - Total number of events available
 */

/**
 * Event categories with their properties
 * @type {Object<string, EventCategory>}
 */
export const EVENT_CATEGORIES = {
  event: {
    name: 'General Event',
    icon: 'event',
    color: '#6B7280'
  },
  birth: {
    name: 'Birth',
    icon: 'celebration',
    color: '#10B981'
  },
  death: {
    name: 'Death',
    icon: 'person_off',
    color: '#EF4444'
  },
  war: {
    name: 'War & Conflict',
    icon: 'local_fire_department',
    color: '#F59E0B'
  },
  discovery: {
    name: 'Discovery',
    icon: 'science',
    color: '#8B5CF6'
  },
  disaster: {
    name: 'Disaster',
    icon: 'warning',
    color: '#F97316'
  },
  politics: {
    name: 'Politics',
    icon: 'gavel',
    color: '#3B82F6'
  }
};

/**
 * Validates if an object is a valid Event
 * @param {any} obj - Object to validate
 * @returns {obj is Event} True if object is a valid Event
 */
export const isValidEvent = (obj) => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.year === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.source === 'string' &&
    !isNaN(obj.year) &&
    obj.year >= -3000 &&
    obj.year <= new Date().getFullYear()
  );
};

/**
 * Validates if an object is a valid Link
 * @param {any} obj - Object to validate
 * @returns {obj is Link} True if object is a valid Link
 */
export const isValidLink = (obj) => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.title === 'string' &&
    typeof obj.url === 'string' &&
    obj.url.length > 0
  );
};

/**
 * Creates a new Event object with default values
 * @param {Partial<Event>} eventData - Partial event data
 * @returns {Event} Complete event object
 */
export const createEvent = (eventData = {}) => {
  return {
    id: eventData.id || `event-${Date.now()}`,
    year: eventData.year || new Date().getFullYear(),
    title: eventData.title || 'Untitled Event',
    description: eventData.description || '',
    category: eventData.category || 'event',
    source: eventData.source || 'unknown',
    links: eventData.links || [],
    ...eventData
  };
};

/**
 * Filters events based on provided criteria
 * @param {Array<Event>} events - Events to filter
 * @param {EventFilter} filter - Filter criteria
 * @returns {Array<Event>} Filtered events
 */
export const filterEvents = (events, filter) => {
  if (!Array.isArray(events)) return [];

  return events.filter(event => {
    // Category filter
    if (filter.categories && filter.categories.length > 0) {
      if (!filter.categories.includes(event.category)) return false;
    }

    // Source filter
    if (filter.sources && filter.sources.length > 0) {
      if (!filter.sources.includes(event.source)) return false;
    }

    // Year range filter
    if (filter.minYear && event.year < filter.minYear) return false;
    if (filter.maxYear && event.year > filter.maxYear) return false;

    // Text search filter
    if (filter.searchText && filter.searchText.trim()) {
      const searchTerm = filter.searchText.toLowerCase().trim();
      const titleMatch = event.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = event.description.toLowerCase().includes(searchTerm);

      if (!titleMatch && !descriptionMatch) return false;
    }

    return true;
  });
};

/**
 * Sorts events by specified criteria
 * @param {Array<Event>} events - Events to sort
 * @param {Object} options - Sort options
 * @param {'year'|'title'|'category'|'source'} options.by - Sort by field
 * @param {'asc'|'desc'} options.order - Sort order
 * @returns {Array<Event>} Sorted events
 */
export const sortEvents = (events, options = {}) => {
  if (!Array.isArray(events)) return [];

  const { by = 'year', order = 'desc' } = options;

  return [...events].sort((a, b) => {
    let aValue, bValue;

    switch (by) {
      case 'year':
        aValue = a.year;
        bValue = b.year;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      case 'source':
        aValue = a.source;
        bValue = b.source;
        break;
      default:
        aValue = a.year;
        bValue = b.year;
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
};

export default {
  EVENT_CATEGORIES,
  isValidEvent,
  isValidLink,
  createEvent,
  filterEvents,
  sortEvents,
};
