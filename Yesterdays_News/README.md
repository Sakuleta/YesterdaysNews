# Yesterdays News 📱

A modern, elegantly architected React Native mobile application that displays historical events from "yesterday" in history. Built with Expo for cross-platform compatibility (iOS, Android, and Web) following modern software engineering principles.

## 🌟 Features

- **📅 Daily Historical Events**: Discover what happened "yesterday" in history with events from multiple eras
- **📰 Vintage Newspaper Design**: Beautiful retro-style interface with smooth animations
- **🌍 Multi-Language Support**: Available in 8 languages (Turkish, English, Spanish, French, German, Italian, Portuguese, Russian)
- **🔍 Interactive Details**: Tap events to explore detailed information in elegant modal views
- **🌐 Multiple Data Sources**: Aggregates from Wikipedia and Deutsche Digitale Bibliothek with smart failover
- **⚡ Smart Caching**: Intelligent caching with automatic cache management and offline support
- **🔄 Pull-to-Refresh**: Easy refresh with force refresh capability
- **🛡️ Error Boundaries**: Comprehensive error handling with graceful degradation
- **📱 Modern UI/UX**: Smooth animations, responsive design, and accessibility support
- **🏗️ Modular Architecture**: Clean, maintainable code following SOLID principles

## 📱 Screenshots

The app features a single-screen interface with:

- Current date display with day of the week
- Event count indicator
- Scrollable list of historical events
- Each event shows year, title, description, and links to Wikipedia articles
- Category-based color coding and icons (politics 👑, war ⚔️, discovery 🔬, etc.)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (install with `npm install -g expo-cli`)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd YesterdaysNews
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on different platforms**

   ```bash
   # Web browser
   npm run web
   
   # Android (requires Android Studio)
   npm run android
   
   # iOS (requires Xcode on macOS)
   npm run ios
   ```

## 📂 Project Structure

This application follows a modular, scalable architecture with clear separation of concerns:

```text
YesterdaysNews/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Core UI components library
│   │   │   ├── Button.js    # Versatile button component
│   │   │   ├── LoadingIndicator.js # Multiple loading styles
│   │   │   ├── EmptyState.js # Empty state displays
│   │   │   └── ErrorBoundary.js # Error handling wrapper
│   │   ├── EventCard.js     # Historical event card (modularized)
│   │   ├── EventCardHeader.js # Event card header section
│   │   ├── EventCardContent.js # Event card content
│   │   ├── EventCardFooter.js # Event card footer
│   │   ├── MagnifyingGlassModal.js # Event detail modal (modularized)
│   │   ├── ModalHeader.js   # Modal header component
│   │   ├── ArticleContent.js # Article content display
│   │   ├── LinksSection.js  # Related links section
│   │   ├── AttributionSection.js # Attribution display
│   │   └── NewspaperMasthead.js # App header
│   ├── hooks/               # Custom React hooks
│   │   ├── useEventsData.js # Events data management
│   │   ├── useModalManager.js # Modal state management
│   │   ├── useModalAnimations.js # Animation logic
│   │   ├── useScrollHandler.js # Scroll performance
│   │   ├── useFlatListConfig.js # List configuration
│   │   ├── usePerformanceMonitor.js # Performance tracking
│   │   └── useLanguageManager.js # Language switching
│   ├── services/            # Business logic and API services
│   │   ├── ApiClient.js    # HTTP client with interceptors
│   │   ├── EventService.js # Historical events operations
│   │   ├── CacheManager.js # Intelligent caching
│   │   ├── CircuitBreaker.js # Circuit breaker pattern
│   │   ├── EventProcessor.js # Event processing & deduplication
│   │   ├── ApiIntegrations.js # External API integrations
│   │   ├── LinkSecurityManager.js # Link security & validation
│   │   ├── NetworkMonitor.js # Network connectivity monitoring
│   │   └── DateUtils.js     # Date utility functions
│   ├── utils/               # Utility functions and helpers
│   │   ├── errorHandling.js # Error handling utilities
│   │   ├── validation.js    # Data validation helpers
│   │   ├── animations.js    # Animation utilities
│   │   └── constants.js     # App constants (colors, typography)
│   ├── types/               # Type definitions (JSDoc)
│   │   ├── Event.js         # Event-related types
│   │   ├── ApiResponse.js   # API response types
│   │   └── UI.js           # UI component types
│   ├── styles/              # Common style templates
│   │   └── commonStyles.js  # Reusable style patterns
│   └── screens/
│       └── HomeScreen.js    # Main screen (significantly simplified)
├── __tests__/               # Unit tests
├── App.js                   # Root component
└── package.json
```

## 🏗️ Architecture

This application follows modern software engineering principles with a clean, modular architecture that ensures maintainability, scalability, and testability.

### 🎯 Design Principles

- **Single Responsibility Principle**: Each module has one clear, focused purpose
- **Separation of Concerns**: UI, business logic, and data access are cleanly separated
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Open/Closed Principle**: Modules are open for extension but closed for modification
- **DRY (Don't Repeat Yourself)**: Common patterns are extracted into reusable utilities

### 📚 Layered Architecture

#### 1. **Presentation Layer** (`src/components/`)

- **UI Components**: Modular, reusable React components
- **Custom Hooks**: Encapsulated stateful logic
- **Styles**: Centralized style management

#### 2. **Service Layer** (`src/services/`)

- **ApiClient**: HTTP client with interceptors and error handling
- **EventService**: High-level business operations for events
- **CacheManager**: Intelligent caching with TTL and size limits
- **NetworkMonitor**: Network connectivity and quality monitoring
- **CircuitBreaker**: Fault tolerance for external API calls

#### 3. **Utility Layer** (`src/utils/`)

- **errorHandling**: Centralized error handling and user-friendly messages
- **validation**: Data validation and sanitization
- **animations**: Reusable animation patterns
- **constants**: Application-wide constants and configuration

#### 4. **Type Definitions** (`src/types/`)

- **Event.js**: Event-related type definitions and utilities
- **ApiResponse.js**: API response types and validation
- **UI.js**: UI component prop types and validation

### 🔄 Data Flow

1. **User Interaction** → Custom Hook → Service Layer
2. **Service Layer** → ApiClient → External APIs
3. **Response Processing** → Validation → Transformation → Caching
4. **UI Update** → Error Handling → Performance Monitoring

### 📊 Key Components

#### UI Components Library (`src/components/ui/`)

- **Button**: Versatile button with variants (primary, secondary, outline, ghost)
- **LoadingIndicator**: Multiple loading styles (spinner, pulse, dots)
- **EmptyState**: Configurable empty state displays with presets
- **ErrorBoundary**: React Error Boundary with fallback UI and retry options

#### Custom Hooks (`src/hooks/`)

- **useEventsData**: Events fetching, caching, and state management
- **useModalManager**: Modal visibility and content management
- **useModalAnimations**: Modal entrance/exit animations
- **useLanguageManager**: Language switching with cache clearing
- **usePerformanceMonitor**: Component performance tracking
- **useScrollHandler**: Scroll performance optimization

#### Service Layer (`src/services/`)

- **ApiClient**: Axios-based HTTP client with request/response interceptors
- **EventService**: High-level event operations (fetch, process, validate)
- **CacheManager**: LRU cache with TTL, size limits, and compression
- **CircuitBreaker**: Fault tolerance pattern for external services
- **EventProcessor**: Event deduplication, scoring, and curation
- **NetworkMonitor**: Real-time network connectivity monitoring

### 🔧 Technical Features

#### Caching Strategy

- **Multi-layer Caching**: Memory → AsyncStorage → Network
- **TTL-based Expiry**: 24-hour cache expiry with sliding window
- **Size Limits**: Automatic cleanup when cache size exceeds limits
- **Compression**: Data compression for storage efficiency

#### Error Handling

- **Global Error Boundary**: Catches React errors with graceful degradation
- **Network Error Recovery**: Automatic retry with exponential backoff
- **User-Friendly Messages**: Contextual error messages for users
- **Error Logging**: Structured error logging for debugging

#### Performance Optimization

- **Component Memoization**: React.memo for expensive components
- **Virtual Scrolling**: Efficient rendering of large lists
- **Lazy Loading**: On-demand loading of heavy components
- **Performance Monitoring**: Real-time performance metrics tracking

## 🎨 Design System

### Color Scheme

- **Primary**: Deep blue (#1e3a8a)
- **Secondary**: Gold accent (#f59e0b)
- **Background**: Light gray (#f8fafc)
- **Cards**: White with subtle shadows
- **Text**: Various gray shades for hierarchy

### Typography

- **Headers**: Bold, 24px
- **Event Titles**: Semi-bold, 16px
- **Descriptions**: Regular, 14px
- **Years**: Bold, 14px with category colors

### Categories

Events are automatically categorized with specific icons and colors:

- 👑 Politics (blue)
- ⚔️ War (red)
- 🔬 Discovery (purple)
- 🌋 Disaster (orange)
- 👶 Birth (green)
- ⚰️ Death (gray)
- 📅 General Events (gray)

## 📚 API Reference

### Wikipedia On This Day API

The app integrates with Wikipedia's REST API to fetch historical events:

```javascript
// Example API call
const response = await fetch(
  'https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/8/23'
);
```

### Key Functions

- `HistoricalEventsAPI.getEventsForToday()` - Fetch events for current date
- `DateUtils.getCurrentDateFormatted()` - Format current date for display
- `getCachedEvents(dateKey)` - Retrieve cached events
- `setCachedEvents(dateKey, events)` - Cache events for offline use

## 🧪 Testing

The project includes unit tests for core functionality:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

Test coverage includes:

- Date utility functions
- Helper functions
- API data transformation
- Component rendering (structure in place)

## 📱 Platform Support

### Web

- Responsive design for desktop and mobile browsers
- Touch-friendly interface
- Progressive Web App capabilities

### iOS

- Native iOS components through React Native
- iOS-specific styling and behaviors
- App Store ready with proper configuration

### Android

- Material Design components
- Android-specific optimizations
- Google Play Store ready

## 🔄 Application Data Flow

1. **App Launch**: Check current date, attempt to load cached events
2. **API Call**: If cache miss or expired, fetch from Wikipedia API
3. **Data Processing**: Transform raw API data into app format
4. **Caching**: Store processed data for offline access
5. **UI Update**: Display events with loading states and error handling
6. **User Interaction**: Pull-to-refresh, tap for more details

## 🌐 Offline Strategy

- **Cache Duration**: 24 hours per date
- **Storage**: AsyncStorage for persistent local storage
- **Fallback**: Show cached data when network unavailable
- **Cache Management**: Automatic cleanup of old entries (30+ days)

## 🚀 Performance Optimizations

- **Virtual Scrolling**: Efficient rendering of large event lists
- **Image Optimization**: Optimized thumbnail loading from Wikipedia
- **Lazy Loading**: Load additional content on demand
- **Memory Management**: Automatic cleanup of unused components
- **Bundle Optimization**: Code splitting and tree shaking

## 🛠️ Development

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **New Services**: Add to `src/services/`
3. **Styling**: Update `src/utils/constants.js`
4. **Tests**: Add corresponding test files in `__tests__/`

### Code Style

- ESLint configuration for consistent code style
- Prettier for automatic code formatting
- PropTypes for component type checking
- JSDoc comments for function documentation

## 📋 Future Enhancements

### Planned Features

#### Core User Experience (Phase 1)

- **Date Picker**: Browse events for any historical date
- **Event Details**: Dedicated screen for full event information
- **Search**: Search through historical events
- **Categories Filter**: Filter events by type
- **Themes**: Dark/light mode toggle

#### Personalization & Engagement (Phase 2)

- **Favorites**: Save interesting events for later
- **Sharing**: Share events on social media
- **Notifications**: Daily historical event notifications
- **User Profiles & Achievements**: Track stats and earn badges (e.g., "Renaissance Expert," "30-Day Streak")

#### Enhanced Content (Phase 3)

- **Historical Figures Database**: Tappable historical figures with bios and related events
- **Home Screen Widget**: Native widget for iOS/Android to display daily events
- **Music of the Day Integration**: Background music from the era of displayed events

#### Advanced Features (Phase 4)

- **Learning Paths**: Curated collections guiding users through specific topics (e.g., "The Industrial Revolution")
- **Live History Feed**: Dynamic feed showing events from 50, 100, or 200 years ago "right now"
- **Historical Tourism Planner**: Travel guide for discovering historical events and landmarks

#### Immersive Experiences (Phase 5)

- **Time Travel Feature**: Interactive date selection with immersive historical experience
- **Personal Time Tunnel**: Personal memories alongside historical events
- **Historical Connections Map**: Interactive network visualization of historical relationships
- **Data Visualization**: Interactive charts, heat maps, and trend analysis

### Technical Improvements

- **State Management**: Migrate to Redux Toolkit for complex state
- **Testing**: Add integration and E2E tests
- **Performance**: Implement more aggressive caching strategies
- **Accessibility**: Enhanced screen reader support
- **Internationalization**: Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Wikipedia for providing the historical events API
- Expo team for the excellent development platform
- React Native community for the robust ecosystem
- All the historians and editors who maintain Wikipedia's historical records

## 🔗 Links

- [Wikipedia On This Day API](https://en.wikipedia.org/api/rest_v1/#/Feed/onThisDay)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)

---

**Yesterday's News** - Because today's current events are truly yesterday's news when viewed through the lens of history! 📰✨
