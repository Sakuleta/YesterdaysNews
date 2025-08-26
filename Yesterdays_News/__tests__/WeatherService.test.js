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

  it('returns Sunny mapping for code 0 with translation key', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    // Simulate Istanbul coordinates
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 41.0082, longitude: 28.9784 } });
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ current: { weather_code: 0 } }) });

    const result = await getCurrentWeather();
    expect(result).toEqual({ icon: 'weather-sunny', translationKey: 'weather.sunny' });
  });

  it('handles different countries (Tokyo) and maps thunderstorm code 95', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    // Simulate Tokyo coordinates
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 35.6762, longitude: 139.6503 } });
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ current: { weather_code: 95 } }) });

    const result = await getCurrentWeather();
    expect(result).toEqual({ icon: 'weather-lightning', translationKey: 'weather.thunderstorm' });
    // Ensure coordinates were placed into URL
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('latitude=35.6762'),
      expect.objectContaining({ method: 'GET' })
    );
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('longitude=139.6503'), expect.any(Object));
  });

  it('maps rain code 63 to translation key', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 48.8566, longitude: 2.3522 } }); // Paris
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ current: { weather_code: 63 } }) });

    const result = await getCurrentWeather();
    expect(result).toEqual({ icon: 'weather-rainy', translationKey: 'weather.rain' });
  });

  it('returns default when permission is denied', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

    const result = await getCurrentWeather();
    expect(result).toEqual({ icon: 'weather-cloudy', translationKey: 'weather.overcast' });
  });

  it('returns default for unknown weather codes', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 52.52, longitude: 13.405 } }); // Berlin
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ current: { weather_code: 12345 } }) });

    const result = await getCurrentWeather();
    expect(result).toEqual({ icon: 'weather-cloudy', translationKey: 'weather.overcast' });
  });
});


