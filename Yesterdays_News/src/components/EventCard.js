import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import usePerformanceMonitor from '../hooks/usePerformanceMonitor';
import { cardStyles } from '../styles/commonStyles';

// Sub-components
import EventCardHeader from './EventCardHeader';
import EventCardContent from './EventCardContent';
import EventCardFooter from './EventCardFooter';

/**
 * EventCard Component - Vintage Newspaper Style
 * Displays an individual historical event as a newspaper clipping.
 * Now modularized using focused sub-components.
 */
const EventCard = ({ event, onPress }) => {
  const { t } = useTranslation();

  // Use performance monitor hook
  usePerformanceMonitor('EventCard');

  const {
    year,
    title,
    description,
    category = 'event',
    source,
    links = [],
  } = event;

  const formattedYear = year; // DateUtils.formatYear will be handled in EventCardHeader

  return (
    <TouchableOpacity
      style={cardStyles.container}
      onPress={() => onPress(event)}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${t('card.readMore')} ${title}`}
      accessibilityHint={`${t('card.readMore')} ${formattedYear} ${category} event`}
    >
      <EventCardHeader year={year} category={category} />
      <EventCardContent title={title} description={description} />
      <EventCardFooter source={source} linkUrl={links[0]?.url} />
    </TouchableOpacity>
  );
};

const areEqual = (prevProps, nextProps) => {
  const a = prevProps.event;
  const b = nextProps.event;
  return (
    a.id === b.id &&
    a.year === b.year &&
    a.title === b.title &&
    a.description === b.description &&
    a.category === b.category &&
    a.source === b.source
  );
};

export default React.memo(EventCard, areEqual);
