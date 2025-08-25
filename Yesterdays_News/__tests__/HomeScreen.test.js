import React from 'react';
import { render, act } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: 'en' } }),
}));

// Avoid pulling in expo-location via DateHeader -> WeatherService in tests
jest.mock('../src/services/WeatherService', () => ({
  getCurrentWeather: jest.fn().mockResolvedValue({ icon: 'weather-sunny', label: 'Sunny' }),
}));

jest.mock('../src/services/HistoricalEventsAPI', () => ({
  __esModule: true,
  default: {
    getEventsForToday: jest.fn().mockResolvedValue([
      { id: '1', year: 2000, title: 'Y2K', description: 'Bug', category: 'event' },
    ]),
    forceRefreshToday: jest.fn().mockResolvedValue([
      { id: '2', year: 2001, title: 'Wikipedia', description: 'Launched', category: 'discovery' },
    ]),
  },
}));

describe('HomeScreen', () => {
  it('loads and renders events', async () => {
    const { findByText } = render(<HomeScreen />);
    const item = await findByText('Y2K');
    expect(item).toBeTruthy();
  });
});


