import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EventCard from '../src/components/EventCard';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => (k === 'card.readMore' ? 'Read More' : k),
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const MockIcon = (props) => React.createElement('Icon', props, null);
  return { MaterialCommunityIcons: MockIcon };
});

describe('EventCard', () => {
  const baseEvent = {
    id: '1',
    year: 1990,
    title: 'Test Title',
    description: 'Test Description',
    category: 'war',
  };

  it('renders title, year and read more', () => {
    const onPress = jest.fn();
    const { getByText } = render(<EventCard event={baseEvent} onPress={onPress} />);
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('1990')).toBeTruthy();
    expect(getByText('Read More')).toBeTruthy();
  });

  it('fires onPress with event when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<EventCard event={baseEvent} onPress={onPress} />);
    fireEvent.press(getByText('Read More'));
    expect(onPress).toHaveBeenCalledWith(baseEvent);
  });
});


