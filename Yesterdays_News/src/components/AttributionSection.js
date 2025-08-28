import React from 'react';
import { View, Text, Linking } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../utils/constants';

/**
 * AttributionSection Component - Attribution and credits section
 * Displays source attribution and links
 */
const AttributionSection = ({ source }) => {
  // Only show attribution for ZenQuotes (as in original)
  if (source !== 'ZenQuotes') {
    return null;
  }

  return (
    <View style={styles.attributionSection}>
      <Text style={styles.attributionText}>
        Historical data powered by{' '}
        <Text
          style={styles.attributionLink}
          onPress={() => Linking.openURL('https://zenquotes.io/')}
        >
          ZenQuotes.io
        </Text>
      </Text>
    </View>
  );
};

const styles = {
  attributionSection: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    paddingHorizontal: LAYOUT.cardPadding,
  },
  attributionText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
  },
  attributionLink: {
    textDecorationLine: 'underline',
    color: COLORS.primary,
  },
};

export default AttributionSection;
