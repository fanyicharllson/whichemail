/* eslint-disable @typescript-eslint/no-unused-vars */
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import "./globals.css";
import Toast from "react-native-toast-message";
import { getToastConfig } from "@/utils/toastConfig";
import { useAppUpdate } from "@/hooks/useAppUpdate";
import { AppUpdateModal } from "@/components/AppUpdateModal";
import { ClipboardMonitorProvider } from "@/components/ClipboardMonitorProvider";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { createURL } from "expo-linking";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://25e0a6978df07d48859aa843db0fb26e@o4508563067699200.ingest.de.sentry.io/4510264738775120',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient();
const prefix = createURL("/");

// Inner App component that uses useTheme (must be inside ThemeProvider)
function App({
  updateAvailable,
  isDownloading,
  reloadApp,
}: {
  updateAvailable: boolean;
  isDownloading: boolean;
  reloadApp: () => void;
}) {
  const { actualTheme } = useTheme(); // Now safe to call here

  return (
    <ClipboardMonitorProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="service" />
      </Stack>
      {/* Toast config */}
      <Toast config={getToastConfig(actualTheme)} />

      {/* Update modal in case any updates */}
      <AppUpdateModal
        visible={updateAvailable}
        isDownloading={isDownloading}
        onReload={reloadApp}
      />
    </ClipboardMonitorProvider>
  );
}

export default Sentry.wrap(function RootLayout() {
  // Call useAppUpdate here (outside providers)
  const { updateAvailable, isDownloading, reloadApp } = useAppUpdate();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* Pass props to App so it can use them */}
        <App
          updateAvailable={updateAvailable}
          isDownloading={isDownloading}
          reloadApp={reloadApp}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
});