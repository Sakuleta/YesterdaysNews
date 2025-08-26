import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, CATEGORY_ICONS, CATEGORY_COLORS, ANIMATIONS } from '../utils/constants';
import { useTranslation } from 'react-i18next';
import { extractDomain } from '../utils/helpers';
import DateUtils from '../services/DateUtils';

/**
 * Modern MagnifyingGlassModal Component
 * Shows detailed article view with contemporary styling and smooth animations
 */
const MagnifyingGlassModal = ({ visible, event, onClose }) => {
  const { t } = useTranslation();
  const [scaleAnim] = useState(new Animated.Value(0));
  const [opacityAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [screenData] = useState(Dimensions.get('window'));
  const [contentOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      slideAnim.setValue(30);
      fadeAnim.setValue(0);
      contentOpacity.setValue(0);
      
      // Opening animation sequence
      Animated.sequence([
        // Background fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATIONS.fast,
          useNativeDriver: true,
        }),
        // Modal appearance
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: ANIMATIONS.spring.tension,
            friction: ANIMATIONS.spring.friction,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: ANIMATIONS.normal,
            useNativeDriver: true,
          }),
        ]),
        // Content slide up and fade in
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: ANIMATIONS.spring.tension,
            friction: ANIMATIONS.spring.friction,
            useNativeDriver: true,
          }),
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: ANIMATIONS.normal,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // Closing animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          tension: ANIMATIONS.spring.tension,
          friction: ANIMATIONS.spring.friction,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: ANIMATIONS.fast,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIMATIONS.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!event) return null;

  const {
    year,
    title,
    description,
    category = 'event',
    links = [],
    source,
  } = event;

  const formattedYear = DateUtils.formatYear(year);
  const categoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS.event;
  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.event;

  const allowedDomains = new Set([
    'en.wikipedia.org',
    'wikipedia.org',
  ]);

  const handleLinkPress = async (link) => {
    try {
      const domain = extractDomain(link.url);
      if (!allowedDomains.has(domain)) {
        Alert.alert('Warning', 'This link cannot be opened for security reasons.');
        return;
      }
      const supported = await Linking.canOpenURL(link.url);
      if (supported) {
        await Linking.openURL(link.url);
      } else {
        Alert.alert('Error', 'Unable to open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open this link');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View 
        style={[
          styles.modalOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Modern blur background */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.3)',
            'rgba(0, 0, 0, 0.6)',
            'rgba(0, 0, 0, 0.8)',
          ]}
          style={styles.blurBackground}
        />
        
        {/* Modal container */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Modern card background */}
          <LinearGradient
            colors={[COLORS.surface, COLORS.surfaceSecondary]}
            style={styles.cardBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={styles.modalHeader}>
            <View style={styles.headerInfo}>
              <MaterialIcons name="calendar-today" size={24} color={COLORS.textPrimary} />
              <Text style={styles.headerTitle}>{t('modal.calendar')}</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          
          {/* Article content with animation */}
          <Animated.View
            style={[
              styles.articleContentWrapper,
              {
                opacity: contentOpacity,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ScrollView
              style={styles.articleContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              {/* Modern headline */}
              <View style={styles.headlineContainer}>
                <Text style={styles.headline} numberOfLines={0}>
                  {title}
                </Text>
              </View>
              
              {/* Modern byline */}
              <View style={styles.bylineSection}>
                <View style={styles.bylineContent}>
                  <View style={styles.bylineRow}>
                    <MaterialIcons name="edit" size={16} color={categoryColor} />
                    <Text style={styles.bylineText}>{t('modal.by')}</Text>
                  </View>
                  <View style={styles.bylineRow}>
                    <MaterialIcons name="schedule" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.datelineText}>
                      {t('modal.originally', { year: formattedYear })}
                    </Text>
                  </View>
                </View>
              </View>
            
              {/* Modern article body */}
              <View style={styles.articleBody}>
                <Text style={styles.description}>
                  {description}
                </Text>
              </View>
              
              {/* Modern related links */}
              <View style={styles.linksSection}>
                <View style={styles.linksSectionHeader}>
                  <MaterialIcons name="library-books" size={20} color={categoryColor} />
                  <Text style={[styles.linksSectionTitle, { color: categoryColor }]}>{t('modal.related')}</Text>
                </View>
                {links.length > 0 ? (
                  links.map((link, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.linkItem, { borderLeftColor: categoryColor }]}
                      onPress={() => handleLinkPress(link)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.linkItemContent}>
                        <MaterialIcons name="article" size={16} color={categoryColor} />
                        <Text style={styles.linkText}>
                          {link.title}
                        </Text>
                        <MaterialIcons name="open-in-new" size={16} color={categoryColor} />
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noLinksContainer}>
                    <MaterialIcons name="info-outline" size={16} color={COLORS.textTertiary} />
                    <Text style={styles.noLinksText}>
                      {source === 'Wikipedia' 
                        ? t('modal.noRelatedSources') 
                        : t('modal.noRelatedSourcesForSource', { source: source || 'this source' })
                      }
                    </Text>
                  </View>
                )}
              </View>

              {/* Attribution Section */}
              {source === 'ZenQuotes' && (
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
              )}
              
              {/* Bottom spacer */}
              <View style={styles.bottomSpacer} />
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.screenPaddingHorizontal,
  },
  
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  modalContainer: {
    width: '95%',
    maxWidth: 450,
    height: '90%',
    maxHeight: 750,
    borderRadius: LAYOUT.cardBorderRadius,
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: LAYOUT.cardBorderRadius,
  },
  
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
  
  articleContentWrapper: {
    flex: 1,
  },
  
  articleContent: {
    flex: 1,
    padding: LAYOUT.cardPadding,
    paddingTop: SPACING.lg,
  },
  
  headlineContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  
  headline: {
    ...TYPOGRAPHY.headlineLarge,
    textAlign: 'center',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  
  bylineSection: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: LAYOUT.borderRadius,
  },
  
  bylineContent: {
    position: 'relative',
  },
  
  bylineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  
  bylineText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
    marginLeft: SPACING.sm,
    color: COLORS.textPrimary,
  },
  
  datelineText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.sm,
    color: COLORS.textSecondary,
  },
  
  articleBody: {
    marginBottom: SPACING.xl,
  },
  
  description: {
    ...TYPOGRAPHY.bodyLarge,
    lineHeight: 24,
    textAlign: 'left',
    color: COLORS.textSecondary,
  },
  
  linksSection: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  
  linksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  linksSectionTitle: {
    ...TYPOGRAPHY.headlineSmall,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  
  linkItem: {
    marginBottom: SPACING.md,
    borderRadius: LAYOUT.borderRadius,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
  },
  
  linkItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  
  linkText: {
    ...TYPOGRAPHY.bodyMedium,
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  attributionSection: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  attributionText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
  },
  attributionLink: {
    textDecorationLine: 'underline',
    color: COLORS.primary,
  },

  bottomSpacer: {
    height: SPACING.xxl,
  },

  noLinksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: LAYOUT.borderRadius,
    marginTop: SPACING.md,
  },
  noLinksText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.sm,
    color: COLORS.textTertiary,
  },
});

export default MagnifyingGlassModal;