import axios from 'axios';
import HistoricalEventsAPI from '../src/services/HistoricalEventsAPI';
import i18n from '../src/i18n';

jest.mock('axios');
jest.mock('expo', () => ({}));
jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en', languageTag: 'en-US' }],
  locale: 'en-US',
}));
jest.mock('expo-constants', () => ({ expoConfig: {}, manifest: {} }));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('HistoricalEventsAPI utility methods', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    i18n.language = 'en';
  });

  it('extractTitle trims long titles and handles null', () => {
    expect(HistoricalEventsAPI.extractTitle(null)).toBe('Untitled Event');
    const long = 'A very long title that should be trimmed because it exceeds the character limit. Therefore it needs truncation.';
    const result = HistoricalEventsAPI.extractTitle(long);
    expect(result.length).toBeLessThanOrEqual(120);
  });

  it('categorizeEvent maps keywords to categories', () => {
    expect(HistoricalEventsAPI.categorizeEvent('He was born in 1900')).toBe('birth');
    expect(HistoricalEventsAPI.categorizeEvent('She died in 2001')).toBe('death');
    expect(HistoricalEventsAPI.categorizeEvent('The battle ended')).toBe('war');
    expect(HistoricalEventsAPI.categorizeEvent('A great discovery happened')).toBe('discovery');
    expect(HistoricalEventsAPI.categorizeEvent('An earthquake destroyed')).toBe('disaster');
    expect(HistoricalEventsAPI.categorizeEvent('The king signed a treaty')).toBe('politics');
    expect(HistoricalEventsAPI.categorizeEvent('Random text')).toBe('event');
  });

  it('transformWikipediaEvents filters and maps correctly', () => {
    const events = [
      { year: '1990', text: 'Event title. More.' },
      { year: null, text: 'No year' },
      { year: '1980', text: '' },
    ];
    const out = HistoricalEventsAPI.transformWikipediaEvents(events);
    expect(out).toHaveLength(1);
    expect(out[0]).toEqual(expect.objectContaining({ year: 1990, source: 'Wikipedia' }));
  });

  it('normalizeCacheKey converts Arabic digits to Latin', () => {
    const key = 'tr-٠٢-۱۵';
    const normalized = HistoricalEventsAPI.normalizeCacheKey(key);
    expect(normalized).toBe('tr-02-15');
  });

  it('getEraForYear buckets years into eras', () => {
    expect(HistoricalEventsAPI.getEraForYear(100)).toBe('ancient');
    expect(HistoricalEventsAPI.getEraForYear(1200)).toBe('medieval');
    expect(HistoricalEventsAPI.getEraForYear(1700)).toBe('early_modern');
    expect(HistoricalEventsAPI.getEraForYear(1850)).toBe('nineteenth');
    expect(HistoricalEventsAPI.getEraForYear(1950)).toBe('twentieth');
    expect(HistoricalEventsAPI.getEraForYear(2020)).toBe('twenty_first');
  });

  it('combineAndDeduplicateEvents removes near-duplicates and caps per decade', () => {
    const make = (year, title, source = 'Wikipedia') => ({ year, title, description: title, links: [], category: 'event', source });
    const list = [
      make(1990, 'Sample Event One.'),
      make(1990, 'Sample Event One!'), // near-duplicate
      make(1991, 'Another Event'),
      make(1992, 'Another Event similar words'), // similar title, different year -> may stay
      make(1993, 'Unique Event'),
      make(1994, 'Unique Event 2'),
      make(1995, 'Unique Event 3'),
      make(1996, 'Unique Event 4'), // decade cap forces some drop
    ];
    const result = HistoricalEventsAPI.combineAndDeduplicateEvents(list, [], []);
    // near-duplicate same year should be deduped
    const n1990 = result.filter(e => e.year === 1990).length;
    expect(n1990).toBe(1);
    // decade cap: at most 3 from 1990s
    const n199x = result.filter(e => e.year >= 1990 && e.year < 2000).length;
    expect(n199x).toBeLessThanOrEqual(3);
  });

  it('getEraTargets scales targets to provided limit', () => {
    const byEra = new Map([
      ['ancient', [{}, {}]],
      ['medieval', [{}, {}, {}]],
      ['early_modern', [{}, {}, {}, {}]],
      ['nineteenth', [{}, {}, {}, {}, {}]],
      ['twentieth', new Array(20).fill({})],
      ['twenty_first', new Array(10).fill({})],
    ]);
    const targets = HistoricalEventsAPI.getEraTargets(30, byEra);
    let sum = 0;
    for (const [, v] of targets) sum += v;
    expect(sum).toBeLessThanOrEqual(30);
  });
});

describe('HistoricalEventsAPI fetch flows (mocked)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    i18n.language = 'en';
  });

  it('fetchWikipediaEvents builds URL with language and transforms', async () => {
    const month = '01';
    const day = '15';
    const epoch = 0;
    axios.get.mockResolvedValue({ data: { events: [{ year: '2000', text: 'Test event.' }] } });
    const out = await HistoricalEventsAPI.fetchWikipediaEvents(month, day, epoch);
    expect(Array.isArray(out)).toBe(true);
    expect(out[0]).toEqual(expect.objectContaining({ year: 2000, source: 'Wikipedia' }));
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('.wikipedia.org/api/rest_v1/feed/onthisday/events/01/15'),
      expect.any(Object)
    );
  });

  it('fetchFallbackEvents returns empty for non-en languages', async () => {
    i18n.language = 'tr';
    const out = await HistoricalEventsAPI.fetchFallbackEvents('01', '01');
    expect(out).toEqual([]);
  });
});


