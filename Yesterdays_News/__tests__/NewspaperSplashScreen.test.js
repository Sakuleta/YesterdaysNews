import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NewspaperSplashScreen from '../src/components/NewspaperSplashScreen';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: View,
  };
});

describe('NewspaperSplashScreen', () => {
  const mockOnFinish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    const { getByText } = render(<NewspaperSplashScreen onFinish={mockOnFinish} />);
    
    expect(getByText('YESTERDAY\'S NEWS')).toBeTruthy();
    expect(getByText('Today\'s Current Events Are Truly Yesterday\'s News')).toBeTruthy();
    expect(getByText('Est. 2024')).toBeTruthy();
    expect(getByText('Historical Events Daily')).toBeTruthy();
  });

  it('displays historical dates', () => {
    const { getByText } = render(<NewspaperSplashScreen onFinish={mockOnFinish} />);
    
    expect(getByText('1899')).toBeTruthy();
    expect(getByText('1923')).toBeTruthy();
    expect(getByText('1945')).toBeTruthy();
    expect(getByText('1969')).toBeTruthy();
    expect(getByText('1989')).toBeTruthy();
    expect(getByText('2001')).toBeTruthy();
  });

  it('displays news headlines', () => {
    const { getByText } = render(<NewspaperSplashScreen onFinish={mockOnFinish} />);
    
    expect(getByText('BREAKING NEWS')).toBeTruthy();
    expect(getByText('HISTORICAL EVENTS')).toBeTruthy();
    expect(getByText('TODAY IN HISTORY')).toBeTruthy();
  });

  it('calls onFinish after animation completes', () => {
    render(<NewspaperSplashScreen onFinish={mockOnFinish} />);
    
    // Fast-forward time to complete animations
    jest.advanceTimersByTime(3000);
    
    expect(mockOnFinish).toHaveBeenCalledTimes(1);
  });

  it('has correct styling structure', () => {
    const { getByTestId } = render(<NewspaperSplashScreen onFinish={mockOnFinish} />);
    
    // Check if main container exists
    const container = getByTestId('newspaper-splash-container');
    expect(container).toBeTruthy();
  });
});
