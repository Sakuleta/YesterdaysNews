import * as Location from 'expo-location';

/**
 * WeatherService - fetches current weather based on device location.
 * Uses Open-Meteo (no API key) and maps weather codes to icon + labels.
 */

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_CODE_MAP = {
  0: { icon: 'weather-sunny', labels: { en: 'Sunny', tr: 'Güneşli' } },
  1: { icon: 'weather-partly-cloudy', labels: { en: 'Mainly clear', tr: 'Genelde açık' } },
  2: { icon: 'weather-partly-cloudy', labels: { en: 'Partly cloudy', tr: 'Parçalı bulutlu' } },
  3: { icon: 'weather-cloudy', labels: { en: 'Overcast', tr: 'Kapalı' } },
  45: { icon: 'weather-fog', labels: { en: 'Fog', tr: 'Sisli' } },
  48: { icon: 'weather-fog', labels: { en: 'Depositing rime fog', tr: 'Kırağı sis' } },
  51: { icon: 'weather-rainy', labels: { en: 'Light drizzle', tr: 'Hafif çise' } },
  53: { icon: 'weather-rainy', labels: { en: 'Moderate drizzle', tr: 'Orta şiddetli çise' } },
  55: { icon: 'weather-rainy', labels: { en: 'Dense drizzle', tr: 'Yoğun çise' } },
  56: { icon: 'weather-rainy', labels: { en: 'Freezing drizzle', tr: 'Dondurucu çise' } },
  57: { icon: 'weather-rainy', labels: { en: 'Freezing drizzle', tr: 'Dondurucu çise' } },
  61: { icon: 'weather-rainy', labels: { en: 'Light rain', tr: 'Hafif yağmur' } },
  63: { icon: 'weather-rainy', labels: { en: 'Rain', tr: 'Yağmur' } },
  65: { icon: 'weather-pouring', labels: { en: 'Heavy rain', tr: 'Şiddetli yağmur' } },
  66: { icon: 'weather-snowy-rainy', labels: { en: 'Freezing rain', tr: 'Dondurucu yağmur' } },
  67: { icon: 'weather-snowy-rainy', labels: { en: 'Freezing rain', tr: 'Dondurucu yağmur' } },
  71: { icon: 'weather-snowy', labels: { en: 'Light snow', tr: 'Hafif kar' } },
  73: { icon: 'weather-snowy', labels: { en: 'Snow', tr: 'Kar' } },
  75: { icon: 'weather-snowy-heavy', labels: { en: 'Heavy snow', tr: 'Yoğun kar' } },
  77: { icon: 'weather-snowy', labels: { en: 'Snow grains', tr: 'Kar taneleri' } },
  80: { icon: 'weather-pouring', labels: { en: 'Rain showers', tr: 'Sağanak' } },
  81: { icon: 'weather-pouring', labels: { en: 'Rain showers', tr: 'Sağanak' } },
  82: { icon: 'weather-pouring', labels: { en: 'Violent showers', tr: 'Kuvvetli sağanak' } },
  85: { icon: 'weather-snowy', labels: { en: 'Snow showers', tr: 'Kar sağanağı' } },
  86: { icon: 'weather-snowy', labels: { en: 'Snow showers', tr: 'Kar sağanağı' } },
  95: { icon: 'weather-lightning', labels: { en: 'Thunderstorm', tr: 'Gök gürültülü' } },
  96: { icon: 'weather-lightning-rainy', labels: { en: 'Thunderstorm with hail', tr: 'Dolu fırtına' } },
  99: { icon: 'weather-lightning-rainy', labels: { en: 'Thunderstorm with hail', tr: 'Dolu fırtına' } },
};

const DEFAULT_WEATHER = { icon: 'weather-cloudy', label: '—' };

export async function getCurrentWeather(preferredLanguage = 'en') {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return DEFAULT_WEATHER;
    }

    const coords = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
    const { latitude, longitude } = coords.coords || {};
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return DEFAULT_WEATHER;
    }

    const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current=weather_code&timezone=auto`;
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) return DEFAULT_WEATHER;
    const json = await resp.json();
    const code = json?.current?.weather_code;
    const map = WEATHER_CODE_MAP[code];
    if (!map) return DEFAULT_WEATHER;
    const lang = preferredLanguage?.startsWith('tr') ? 'tr' : 'en';
    return { icon: map.icon, label: map.labels[lang] };
  } catch (_) {
    return DEFAULT_WEATHER;
  }
}

export default { getCurrentWeather };


