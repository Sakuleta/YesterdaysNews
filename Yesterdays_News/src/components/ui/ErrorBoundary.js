import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../utils/constants';
import usePerformanceMonitor from '../../hooks/usePerformanceMonitor';
import Button from './Button';

/**
 * ErrorBoundary Component - Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the app
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: Date.now(), // Unique ID for this error instance
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console (and could also log to an error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.state.errorId);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });

    // Call onRetry callback if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleReport = () => {
    // Call onReport callback if provided
    if (this.props.onReport) {
      this.props.onReport(this.state.error, this.state.errorInfo, this.state.errorId);
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          retry: this.handleRetry,
          report: this.handleReport,
        });
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onReport={this.handleReport}
          showDetails={this.props.showDetails}
          showReportButton={this.props.showReportButton}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
const ErrorFallback = ({
  error,
  errorInfo,
  onRetry,
  onReport,
  showDetails = false,
  showReportButton = false,
}) => {
  // Use performance monitor
  usePerformanceMonitor('ErrorFallback');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Error Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="error-outline"
            size={64}
            color={COLORS.error || COLORS.primary}
          />
        </View>

        {/* Error Title */}
        <Text style={styles.title}>
          Something Went Wrong
        </Text>

        {/* Error Message */}
        <Text style={styles.message}>
          An unexpected error occurred. Please try again.
        </Text>

        {/* Error Details (if enabled) */}
        {showDetails && error && (
          <ScrollView style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Error Details:</Text>
            <Text style={styles.errorText}>{error.toString()}</Text>

            {errorInfo && errorInfo.componentStack && (
              <>
                <Text style={styles.detailsTitle}>Component Stack:</Text>
                <Text style={styles.stackText}>{errorInfo.componentStack}</Text>
              </>
            )}
          </ScrollView>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {onRetry && (
            <Button
              title="Try Again"
              onPress={onRetry}
              variant="primary"
              size="medium"
              icon="refresh"
            />
          )}

          {showReportButton && onReport && (
            <Button
              title="Report Issue"
              onPress={onReport}
              variant="outline"
              size="medium"
              icon="bug-report"
              style={styles.reportButton}
            />
          )}
        </View>
      </View>
    </View>
  );
};

/**
 * Higher-order component to wrap components with ErrorBoundary
 */
export const withErrorBoundary = (
  WrappedComponent,
  errorBoundaryProps = {}
) => {
  const WithErrorBoundaryComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
  },

  iconContainer: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    ...TYPOGRAPHY.headlineLarge,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },

  message: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },

  detailsContainer: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: LAYOUT.borderRadius,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },

  detailsTitle: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },

  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error || COLORS.primary,
    fontFamily: 'monospace',
    marginBottom: SPACING.sm,
  },

  stackText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    lineHeight: 16,
  },

  buttonContainer: {
    width: '100%',
    gap: SPACING.sm,
  },

  reportButton: {
    marginTop: SPACING.sm,
  },
});

export default ErrorBoundary;
