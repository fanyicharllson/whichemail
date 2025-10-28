const { withNativeWind } = require('nativewind/metro');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

let config = getSentryExpoConfig(__dirname);

// Metro may pick ESM 'module' fields from packages which can cause resolution
// issues for some libraries in React Native. Prefer the 'react-native' and
// 'main' entry fields so Metro resolves the CommonJS builds of packages like
// @sentry/core which are known to work with the RN bundler.
config.resolver = Object.assign({}, config.resolver, {
  mainFields: ['react-native', 'main'],
});

module.exports = withNativeWind(config, { input: './app/globals.css' });