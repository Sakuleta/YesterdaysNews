### Historical Events Mobile App

A React Native mobile application that displays historical events that occurred on the current date throughout history. Built with Expo for cross-platform compatibility (iOS, Android, and Web).

## 🌟 Features

- **Daily Historical Events**: Automatically shows events that happened on today's date in previous years
- **Beautiful Card Interface**: Clean, modern design with category icons and color coding
- **Offline Support**: Caches events for offline viewing with automatic cache management
- **Pull-to-Refresh**: Easy refresh functionality to get latest data
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Responsive Design**: Works on phones, tablets, and web browsers
- **Performance Optimized**: Efficient loading and rendering with virtual scrolling

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

```text
YesterdaysNews/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DateHeader.js    # Current date display
│   │   ├── EventCard.js     # Individual event display
│   │   ├── LoadingSpinner.js # Loading states
│   │   └── ErrorMessage.js  # Error handling UI
│   ├── screens/
│   │   └── HomeScreen.js    # Main application screen
│   ├── services/
│   │   ├── HistoricalEventsAPI.js # Wikipedia API integration
│   │   └── DateUtils.js     # Date utility functions
│   └── utils/
│       ├── constants.js     # App constants (colors, typography)
│       └── helpers.js       # Helper functions
├── __tests__/               # Unit tests
├── App.js                   # Root component
└── package.json
```

## 🔧 Architecture

### Components Overview

- **DateHeader**: Displays current date and event count
- **EventCard**: Shows individual historical events with category styling
- **LoadingSpinner**: Various loading indicators for different contexts
- **ErrorMessage**: Error handling with retry functionality
- **HomeScreen**: Main screen with state management and data fetching

### API Integration

The app uses Wikipedia's "On This Day" API:

- **Endpoint**: `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{month}/{day}`
- **Caching**: 24-hour cache expiry with offline fallback
- **Error Handling**: Network error recovery with cached data
- **Data Transformation**: Raw API data processed for consistent display

### State Management

- Local state management using React hooks (`useState`, `useEffect`)
- Persistent storage with AsyncStorage for caching
- Optimistic UI updates with error boundaries

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

## 🔄 Data Flow

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

- **Date Picker**: Browse events for any historical date
- **Event Details**: Dedicated screen for full event information
- **Favorites**: Save interesting events for later
- **Sharing**: Share events on social media
- **Categories Filter**: Filter events by type
- **Search**: Search through historical events
- **Notifications**: Daily historical event notifications
- **Themes**: Dark/light mode toggle

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
