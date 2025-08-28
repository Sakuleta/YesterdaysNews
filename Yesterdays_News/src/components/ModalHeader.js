import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/constants';
import { useTranslation } from 'react-i18next';

/**
 * ModalHeader Component - Header section for modal
 * Displays modal title and close button
 */
const ModalHeader = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.modalHeader}>
      <View style={styles.headerInfo}>
        <MaterialIcons name="calendar-today" size={24} color={COLORS.textPrimary} />
        <Text style={styles.headerTitle}>{t('modal.calendar')}</Text>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={t('modal.close')}
      >
        <MaterialIcons name="close" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.headlineSmall,
    marginLeft: SPACING.sm,
  },
  closeButton: {
    padding: SPACING.sm,
  },
};

export default ModalHeader;
