const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add TypeScript support
config.resolver.sourceExts.push('ts', 'tsx');

// Ignore TypeScript errors in node_modules
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Better module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Fix for Metro compatibility issues
config.resolver.unstable_enableSymlinks = false;
config.resolver.unstable_enablePackageExports = false;

// Ensure proper Metro version compatibility
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = config;
