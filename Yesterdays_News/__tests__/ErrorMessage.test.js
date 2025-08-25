import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorMessage, { InlineErrorMessage, ErrorCard } from '../src/components/ErrorMessage';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => (k === 'error.tryAgain' ? 'Try Again' : k === 'error.inlineRetry' ? 'Retry' : k === 'error.tips' ? 'Tips' : k),
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const MockIcon = (props) => React.createElement('Icon', props, null);
  return { MaterialIcons: MockIcon };
});

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  return { LinearGradient: (props) => React.createElement('LinearGradient', props) };
});

describe('ErrorMessage', () => {
  it('renders default error and retry works', () => {
    const onRetry = jest.fn();
    const { getByText } = render(<ErrorMessage message="Oops" onRetry={onRetry} />);
    fireEvent.press(getByText('Try Again'));
    expect(onRetry).toHaveBeenCalled();
  });

  it('renders network type with tips', () => {
    const { getByText } = render(<ErrorMessage message="No internet" type="network" />);
    expect(getByText('Tips')).toBeTruthy();
  });

  it('renders empty type', () => {
    const { getByText } = render(<ErrorMessage message="None" type="empty" />);
    expect(getByText(/Try checking another date/i)).toBeTruthy();
  });
});

describe('InlineErrorMessage', () => {
  it('renders message and fires retry', () => {
    const onRetry = jest.fn();
    const { getByText } = render(<InlineErrorMessage message="Inline" onRetry={onRetry} />);
    fireEvent.press(getByText('Retry'));
    expect(onRetry).toHaveBeenCalled();
  });
});

describe('ErrorCard', () => {
  it('renders card message', () => {
    const { getByText } = render(<ErrorCard message="Card error" />);
    expect(getByText('Card error')).toBeTruthy();
  });
});


