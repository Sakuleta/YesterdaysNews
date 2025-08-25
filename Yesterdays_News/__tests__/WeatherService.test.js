import { getCurrentWeather } from '../src/services/WeatherService';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Lowest: 1 },
}));

const Location = require('expo-location');

describe('WeatherService.getCurrentWeather', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  it('returns Sunny/Güneşli mapping for code 0 based on language', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    // Simulate Istanbul coordinates
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 41.0082, longitude: 28.9784 } });
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ current: { weather_code: 0 } }) });

    const trResult = await getCurrentWeather('tr');
    expect(trResult).toEqual({ icon: 'weather-sunny', label: 'Güneşli' });

    const enResult = await getCurrentWeather('en');
    expect(enResult).toEqual({ icon: 'weather-sunny', label: 'Sunny' });
  });

  it('handles different countries (Tokyo) and maps thunderstorm code 95', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    // Simulate Tokyo coordinates
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 35.6762, longitude: 139.6503 } });
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ current: { weather_code: 95 } }) });

    const result = await getCurrentWeather('en');
    expect(result).toEqual({ icon: 'weather-lightning', label: 'Thunderstorm' });
    // Ensure coordinates were placed into URL
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('latitude=35.6762'),
      expect.objectContaining({ method: 'GET' })
    );
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('longitude=139.6503'), expect.any(Object));
  });

  it('maps rain code 63 to localized label in Turkish', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 48.8566, longitude: 2.3522 } }); // Paris
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ current: { weather_code: 63 } }) });

    const result = await getCurrentWeather('tr');
    expect(result).toEqual({ icon: 'weather-rainy', label: 'Yağmur' });
  });

  it('returns default when permission is denied', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

    const result = await getCurrentWeather('en');
    expect(result).toEqual({ icon: 'weather-cloudy', label: '—' });
  });

  it('returns default for unknown weather codes', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 52.52, longitude: 13.405 } }); // Berlin
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ current: { weather_code: 12345 } }) });

    const result = await getCurrentWeather('en');
    expect(result).toEqual({ icon: 'weather-cloudy', label: '—' });
  });
});


