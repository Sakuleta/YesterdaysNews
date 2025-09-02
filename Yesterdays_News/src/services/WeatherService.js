import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * WeatherService - fetches current weather based on device location.
 * Uses Open-Meteo (no API key) and maps weather codes to icon + translation keys.
 * Includes caching to prevent inconsistent weather data on refresh.
 */

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const WEATHER_CACHE_KEY = 'weather_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for better refresh on app open
const INITIAL_LOAD_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for first app load

const WEATHER_CODE_MAP = {
  0: { icon: 'weather-sunny', translationKey: 'weather.sunny' },
  1: { icon: 'weather-partly-cloudy', translationKey: 'weather.mainlyClear' },
  2: { icon: 'weather-partly-cloudy', translationKey: 'weather.partlyCloudy' },
  3: { icon: 'weather-cloudy', translationKey: 'weather.overcast' },
  45: { icon: 'weather-fog', translationKey: 'weather.fog' },
  48: { icon: 'weather-fog', translationKey: 'weather.depositingRimeFog' },
  51: { icon: 'weather-rainy', translationKey: 'weather.lightDrizzle' },
  53: { icon: 'weather-rainy', translationKey: 'weather.moderateDrizzle' },
  55: { icon: 'weather-rainy', translationKey: 'weather.denseDrizzle' },
  56: { icon: 'weather-rainy', translationKey: 'weather.freezingDrizzle' },
  57: { icon: 'weather-rainy', translationKey: 'weather.freezingDrizzle' },
  61: { icon: 'weather-rainy', translationKey: 'weather.lightRain' },
  63: { icon: 'weather-rainy', translationKey: 'weather.rain' },
  65: { icon: 'weather-pouring', translationKey: 'weather.heavyRain' },
  66: { icon: 'weather-snowy-rainy', translationKey: 'weather.freezingRain' },
  67: { icon: 'weather-snowy-rainy', translationKey: 'weather.freezingRain' },
  71: { icon: 'weather-snowy', translationKey: 'weather.lightSnow' },
  73: { icon: 'weather-snowy', translationKey: 'weather.snow' },
  75: { icon: 'weather-snowy-heavy', translationKey: 'weather.heavySnow' },
  77: { icon: 'weather-snowy', translationKey: 'weather.snowGrains' },
  80: { icon: 'weather-pouring', translationKey: 'weather.rainShowers' },
  81: { icon: 'weather-pouring', translationKey: 'weather.rainShowers' },
  82: { icon: 'weather-pouring', translationKey: 'weather.violentShowers' },
  85: { icon: 'weather-snowy', translationKey: 'weather.snowShowers' },
  86: { icon: 'weather-snowy', translationKey: 'weather.snowShowers' },
  95: { icon: 'weather-lightning', translationKey: 'weather.thunderstorm' },
  96: { icon: 'weather-lightning-rainy', translationKey: 'weather.thunderstormWithHail' },
  99: { icon: 'weather-lightning-rainy', translationKey: 'weather.thunderstormWithHail' },
};

const DEFAULT_WEATHER = { icon: 'weather-cloudy', translationKey: 'weather.overcast' };

/**
 * Get cached weather data if available and not expired
 */
async function getCachedWeather(useShortCache = false) {
  try {
    const cached = await AsyncStorage.getItem(WEATHER_CACHE_KEY);
    if (!cached) return null;

    const parsedCache = JSON.parse(cached);
    const now = Date.now();
    const cacheDuration = useShortCache ? INITIAL_LOAD_CACHE_DURATION : CACHE_DURATION;

    // Check if cache is still valid
    if (now - parsedCache.timestamp < cacheDuration) {
      if (__DEV__) console.log('Returning cached weather data (cache duration:', cacheDuration / 1000, 'seconds)');
      return parsedCache.weather;
    }

    if (__DEV__) console.log('Cached weather expired (age:', Math.round((now - parsedCache.timestamp) / 1000), 'seconds)');
    return null;
  } catch (error) {
    console.error('Error reading weather cache:', error);
    return null;
  }
}

/**
 * Cache weather data with timestamp
 */
async function setCachedWeather(weather) {
  try {
    const cacheData = {
      timestamp: Date.now(),
      weather: weather
    };
    await AsyncStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cacheData));
    if (__DEV__) console.log('Cached weather data');
  } catch (error) {
    console.error('Error caching weather:', error);
  }
}

export async function getCurrentWeather(forceRefresh = false, isInitialLoad = false) {
  try {
    if (__DEV__) {
      console.log('WeatherService: getCurrentWeather called with forceRefresh:', forceRefresh, 'isInitialLoad:', isInitialLoad);
    }

    // Check cache first unless force refresh is requested
    // Use shorter cache duration for initial load to ensure fresh data
    if (!forceRefresh) {
      const useShortCache = isInitialLoad;
      const cachedWeather = await getCachedWeather(useShortCache);
      if (cachedWeather) {
        if (__DEV__) console.log('WeatherService: Returning cached weather:', cachedWeather);
        return cachedWeather;
      }
    }

    if (__DEV__) console.log('WeatherService: Requesting location permissions...');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      if (__DEV__) console.log('WeatherService: Location permission denied');
      return DEFAULT_WEATHER;
    }

    if (__DEV__) console.log('WeatherService: Getting current position...');
    const coords = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
    const { latitude, longitude } = coords.coords || {};
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      if (__DEV__) console.log('WeatherService: Invalid coordinates:', { latitude, longitude });
      return DEFAULT_WEATHER;
    }

    if (__DEV__) console.log('WeatherService: Coordinates:', { latitude, longitude });

    const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current=weather_code&timezone=auto`;
    if (__DEV__) console.log('WeatherService: API URL:', url);

    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) {
      if (__DEV__) console.log('WeatherService: API request failed with status:', resp.status);
      return DEFAULT_WEATHER;
    }

    const json = await resp.json();
    if (__DEV__) console.log('WeatherService: API response:', json);

    const code = json?.current?.weather_code;
    if (__DEV__) console.log('WeatherService: Weather code received:', code);

    const map = WEATHER_CODE_MAP[code];
    if (!map) {
      if (__DEV__) console.log('WeatherService: Unknown weather code:', code, 'returning default');
      return DEFAULT_WEATHER;
    }

    const weatherData = { icon: map.icon, translationKey: map.translationKey };
    if (__DEV__) console.log('WeatherService: Mapped weather data:', weatherData);

    // Cache the fresh weather data
    await setCachedWeather(weatherData);

    return weatherData;
  } catch (error) {
    if (__DEV__) console.error('WeatherService: Error fetching weather:', error);

    // Try to return cached weather even if expired when network fails
    const cachedWeather = await getCachedWeather();
    if (cachedWeather) {
      if (__DEV__) console.log('WeatherService: Network error, returning expired cached weather:', cachedWeather);
      return cachedWeather;
    }

    if (__DEV__) console.log('WeatherService: Returning default weather');
    return DEFAULT_WEATHER;
  }
}

export default { getCurrentWeather };


