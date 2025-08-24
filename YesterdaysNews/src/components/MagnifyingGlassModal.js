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
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, SHADOWS, CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/constants';
import DateUtils from '../services/DateUtils';

/**
 * MagnifyingGlassModal Component
 * Shows detailed article view with newspaper styling and magnifying effect
 */
const MagnifyingGlassModal = ({ visible, event, onClose }) => {
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
          duration: 200,
          useNativeDriver: true,
        }),
        // Modal appearance
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 120,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Content slide up and fade in
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // Closing animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          tension: 120,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
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
    links = []
  } = event;

  const formattedYear = DateUtils.formatYear(year);
  const categoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS.event;
  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.event;

  const handleLinkPress = async (link) => {
    try {
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
        {/* Dynamic blur background */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.4)',
            'rgba(20, 20, 20, 0.8)',
            'rgba(0, 0, 0, 0.9)',
          ]}
          style={styles.blurBackground}
        />
        
        {/* Modal container */}
        <Animated.View
          style={[
            styles.magnifyingGlass,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Enhanced paper texture with layers */}
          <LinearGradient
            colors={[
              COLORS.paperBackground,
              COLORS.paperYellow,
              '#f9f7f3',
              COLORS.paperBackground,
            ]}
            style={styles.paperTexture}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          {/* Subtle paper grain overlay */}
          <View style={styles.paperGrain} />
          
          {/* Enhanced close button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[COLORS.paperYellow, '#f0e68c']}
              style={styles.closeButtonGradient}
            >
              <MaterialIcons name="close" size={26} color={COLORS.headlineBlack} />
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Magnifying lens effect */}
          <View style={styles.lensRing}>
            <View style={styles.lensInner} />
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
              {/* Enhanced article header */}
              <View style={styles.fullArticleHeader}>
                <LinearGradient
                  colors={[categoryColor + '20', 'transparent']}
                  style={styles.headerGradient}
                />
                
                <View style={styles.categorySection}>
                  <View style={[styles.categoryIconContainer, { backgroundColor: categoryColor + '20' }]}>
                    <Text style={styles.categoryIconLarge}>{categoryIcon}</Text>
                  </View>
                  <View>
                    <Text style={[styles.categoryNameLarge, { color: categoryColor }]}>
                      {category.toUpperCase()}
                    </Text>
                    <Text style={styles.yearLarge}>{formattedYear}</Text>
                  </View>
                </View>
                
                <View style={[styles.magnifyIcon, { backgroundColor: categoryColor + '15' }]}>
                  <MaterialIcons name="history" size={28} color={categoryColor} />
                </View>
              </View>
            
              {/* Enhanced headline with decorative elements */}
              <View style={styles.headlineContainer}>
                <View style={styles.headlineDecorator} />
                <Text style={styles.fullHeadline} numberOfLines={0}>
                  {title}
                </Text>
                <View style={styles.headlineDecorator} />
              </View>
              
              {/* Enhanced byline */}
              <View style={styles.bylineSection}>
                <LinearGradient
                  colors={[categoryColor + '10', 'transparent']}
                  style={styles.bylineGradient}
                />
                <View style={styles.bylineContent}>
                  <View style={styles.bylineRow}>
                    <MaterialIcons name="edit" size={14} color={categoryColor} />
                    <Text style={styles.bylineText}>Historical Chronicle Desk</Text>
                  </View>
                  <View style={styles.bylineRow}>
                    <MaterialIcons name="schedule" size={14} color={COLORS.inkGray} />
                    <Text style={styles.datelineText}>
                      Originally occurred: {formattedYear}
                    </Text>
                  </View>
                </View>
              </View>
            
              {/* Enhanced article body */}
              <View style={styles.articleBody}>
                <View style={styles.dropcap}>
                  <Text style={styles.dropcapLetter}>
                    {description.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.fullDescription}>
                  {description.substring(1)}
                </Text>
              </View>
              
              {/* Enhanced related links */}
              {links.length > 0 && (
                <View style={styles.linksSection}>
                  <View style={styles.linksSectionHeader}>
                    <MaterialIcons name="library-books" size={20} color={categoryColor} />
                    <Text style={[styles.linksSectionTitle, { color: categoryColor }]}>Related Sources</Text>
                  </View>
                  {links.map((link, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.linkItem, { borderLeftColor: categoryColor }]}
                      onPress={() => handleLinkPress(link)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={[COLORS.paperYellow + '40', COLORS.paperBackground]}
                        style={styles.linkItemGradient}
                      >
                        <MaterialIcons name="article" size={16} color={categoryColor} />
                        <Text style={[styles.linkText, { color: COLORS.headlineBlack }]}>
                          {link.title}
                        </Text>
                        <MaterialIcons name="open-in-new" size={16} color={categoryColor} />
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
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
    padding: LAYOUT.pageMargin,
  },
  
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  magnifyingGlass: {
    width: '96%',
    maxWidth: 450,
    height: '88%',
    maxHeight: 750,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: COLORS.vintage,
    backgroundColor: COLORS.paperBackground,
    position: 'relative',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  
  paperTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  
  paperGrain: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: 'transparent',
    opacity: 0.03,
  },
  
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,
    borderRadius: 25,
    width: 50,
    height: 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  closeButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  lensRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: COLORS.vintage + '40',
    opacity: 0.6,
  },
  
  lensInner: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.foldLine + '30',
    opacity: 0.3,
  },
  
  articleContentWrapper: {
    flex: 1,
  },
  
  articleContent: {
    flex: 1,
    padding: SPACING.xl,
    paddingTop: SPACING.xxl + 15,
  },
  
  fullArticleHeader: {
    position: 'relative',
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.headlineBlack,
  },
  
  headerGradient: {
    position: 'absolute',
    top: -10,
    left: -20,
    right: -20,
    height: 60,
    borderRadius: 15,
  },
  
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  categoryIconLarge: {
    fontSize: 28,
    textAlign: 'center',
  },
  
  categoryNameLarge: {
    ...TYPOGRAPHY.sectionHeader,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  
  yearLarge: {
    ...TYPOGRAPHY.dateHeader,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  
  magnifyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  headlineContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  
  headlineDecorator: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.headlineBlack,
    marginVertical: SPACING.sm,
  },
  
  fullHeadline: {
    ...TYPOGRAPHY.headline,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.headlineBlack,
    ...SHADOWS.textShadow,
  },
  
  bylineSection: {
    position: 'relative',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: LAYOUT.borderRadius,
    overflow: 'hidden',
  },
  
  bylineGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    ...TYPOGRAPHY.byline,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  
  datelineText: {
    ...TYPOGRAPHY.byline,
    fontSize: 12,
    marginLeft: SPACING.sm,
    color: COLORS.inkGray,
  },
  
  articleBody: {
    marginBottom: SPACING.xl,
    flexDirection: 'row',
  },
  
  dropcap: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.headlineBlack,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginTop: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
  dropcapLetter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.paperBackground,
    ...TYPOGRAPHY.headline,
  },
  
  fullDescription: {
    ...TYPOGRAPHY.bodyText,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'left',
    flex: 1,
    paddingTop: 6,
  },
  
  linksSection: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 2,
    borderTopColor: COLORS.foldLine,
  },
  
  linksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.foldLine + '50',
  },
  
  linksSectionTitle: {
    ...TYPOGRAPHY.sectionHeader,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
  
  linkItem: {
    marginBottom: SPACING.md,
    borderRadius: LAYOUT.borderRadius + 2,
    borderLeftWidth: 4,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  
  linkItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  
  linkText: {
    ...TYPOGRAPHY.bodyText,
    fontSize: 14,
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.md,
    fontWeight: '500',
  },
  
  bottomSpacer: {
    height: SPACING.xxl + 10,
  },
});

export default MagnifyingGlassModal;