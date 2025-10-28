import {
  Alert,
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { secureStorage } from "@/services/secureStorage";
import { showToast } from "@/utils/toast";
import { useLogout } from "@/services/hooks/useAuth";
import { useUser } from "@/services/hooks/userQueries";
import {
  authenticateUser,
  getAuthenticationTypeName,
  isAuthenticationAvailable,
} from "@/utils/authUtils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import ProfileSection from "@/components/ProfileSceenSection";
import DeleteAllPasswordsButton from "@/components/DeleteAllPasswordsButton";
import { useServices } from "@/services/queries/serviceQueries";
import {
  handleDeleteAllPasswords,
  useDeleteAllPasswords,
} from "@/services/hooks/useDeleteAllPasswords";
import ContactSupport from "@/components/ai/ContactSupport";

export default function Settings() {
  const [passwordFeatureEnabled, setPasswordFeatureEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { data: user } = useUser();
  const { mutate: logOut } = useLogout();
  const { actualTheme } = useTheme();
  const { data: services = [] } = useServices();
  const { deleteAllPasswords, isDeleting } = useDeleteAllPasswords();

  const whatsappNumber = "237670242458";
  const message =
    "Hello Fanyi, from WhichEmail App! 👋 I’d love to share some feedback about WhichEmail.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  useEffect(() => {
    checkSettings();
  }, []);

  const openWhatsApp = async () => {
    try {
      showToast.info("Opening WhatsApp...");
      await Linking.openURL(whatsappLink);
    } catch (error) {
      showToast.error(
        "Error Opening Whatsapp!",
        "Please ensure you have whatsapp installed or try again later."
      );
      console.error("Error opening WhatsApp:", error);
    }
  };

  const checkSettings = async () => {
    try {
      // Check if password feature is enabled
      const enabled = await secureStorage.isPasswordFeatureEnabled();
      setPasswordFeatureEnabled(enabled);

      // Check biometric availability
      const authenticationAvailable = await isAuthenticationAvailable();
      setBiometricAvailable(authenticationAvailable);

      if (authenticationAvailable) {
        const authType = await getAuthenticationTypeName();
        setBiometricType(authType);
      }
    } catch (error) {
      console.error("Error checking settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordFeature = async (value: boolean) => {
    if (value) {
      // Enabling - require authentication
      const result = await authenticateUser({
        purpose: "enable-password",
        showSuccessToast: true,
        successMessage: "You can now save passwords securely",
      });

      if (result.success) {
        await secureStorage.setPasswordFeature(true);
        setPasswordFeatureEnabled(true);
      }
    } else {
      // Disabling - show confirmation
      Alert.alert(
        "Disable Password Storage?",
        "This will not delete existing passwords, but you won't be able to add new ones until you enable it again.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disable",
            style: "destructive",
            onPress: async () => {
              await secureStorage.setPasswordFeature(false);
              setPasswordFeatureEnabled(false);
              showToast.info(
                "Password Storage Disabled!",
                "Password temporarily storage disabled"
              );
            },
          },
        ]
      );
    }
  };

  // Handler that includes biometric auth + confirmation
  const onDeleteAll = async () => {
    await handleDeleteAllPasswords(services, deleteAllPasswords);
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar style={actualTheme === "dark" ? "light" : "dark"} />

      {/* Header */}
      <View className="bg-white dark:bg-slate-800 pt-14 pb-4 px-6 border-b border-slate-200 dark:border-slate-700">
        <Text className="text-slate-900 dark:text-slate-100 font-bold text-2xl">
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <ProfileSection user={user ?? null} actualTheme={actualTheme} />

        {/* Security Section */}
        <View className="px-6 pb-4">
          <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-3">
            Security
          </Text>

          {/* Password Storage Toggle */}
          <View className="bg-white dark:bg-slate-800 rounded-2xl mb-3 shadow-sm border border-slate-200 dark:border-slate-700">
            <View className="px-4 py-4 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                  <Ionicons name="lock-closed" size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 dark:text-slate-100 font-semibold">
                    Password Storage
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Save passwords with {biometricType || "biometric"}{" "}
                    protection
                  </Text>
                </View>
              </View>
              <Switch
                value={passwordFeatureEnabled}
                onValueChange={togglePasswordFeature}
                disabled={loading}
                trackColor={{ false: "#cbd5e1", true: "#3b82f6" }}
                thumbColor={passwordFeatureEnabled ? "#ffffff" : "#f1f5f9"}
              />
            </View>

            {/* Biometric Status */}
            {!biometricAvailable && (
              <View className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                <View className="flex-row items-start">
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    color="#f59e0b"
                    style={{ marginTop: 2, marginRight: 6 }}
                  />
                  <Text className="text-amber-600 dark:text-amber-500 text-xs flex-1">
                    Biometric authentication not available. Please enable Face
                    ID or Fingerprint in your device settings.
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Password Management Section */}
          {passwordFeatureEnabled && (
            <View className="py-4">
              {/* Section Title */}
              <Text className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Password Management
              </Text>

              {/* Delete All Passwords - DANGER ZONE */}
              <DeleteAllPasswordsButton
                onPress={onDeleteAll}
                isDeleting={isDeleting}
                actualTheme={actualTheme}
                passwordCount={services.length}
              />

              {/* Warning Text */}
              <View
                className="mt-3 p-3 rounded-xl"
                style={{
                  backgroundColor:
                    actualTheme === "dark"
                      ? "rgba(239, 68, 68, 0.05)"
                      : "#fef2f2",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: actualTheme === "dark" ? "#fca5a5" : "#dc2626",
                    textAlign: "center",
                  }}
                >
                  ⚠️ This action requires biometric authentication and cannot be
                  undone
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Theme Section */}
        <View className="px-6 pb-4">
          <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-3">
            Appearance
          </Text>
          <ThemeToggle />
        </View>

        {/* App Info Section */}
        <View className="px-6 pb-4">
          <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-3">
            Information
          </Text>

          <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            {/* About */}
            <TouchableOpacity
              className="px-4 py-4 flex-row items-center border-b border-slate-200 dark:border-slate-700"
              onPress={() => router.push("/service/about")}
            >
              <View className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2 mr-3">
                <Ionicons name="information-circle" size={20} color="#8b5cf6" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-slate-100 font-semibold">
                  About WhichEmail
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  Learn more about WhichEmail
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={actualTheme === "dark" ? "#94a3b8" : "#9ca3af"}
              />
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity
              className="px-4 py-4 flex-row items-center border-b border-slate-200 dark:border-slate-700"
              onPress={() => showToast.info("Private policy coming soon!")}
            >
              <View className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 mr-3">
                <Ionicons name="shield-checkmark" size={20} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-slate-100 font-semibold">
                  Privacy Policy
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  How we handle your data
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={actualTheme === "dark" ? "#94a3b8" : "#9ca3af"}
              />
            </TouchableOpacity>

            {/* Terms of Service */}
            <TouchableOpacity
              className="px-4 py-4 flex-row items-center border-b border-slate-200 dark:border-slate-700"
              onPress={() => showToast.info("Terms of Service coming soon!")}
            >
              <View className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-2 mr-3">
                <Ionicons name="document-text" size={20} color="#f97316" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-slate-100 font-semibold">
                  Terms of Service
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  Our terms and conditions
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={actualTheme === "dark" ? "#94a3b8" : "#9ca3af"}
              />
            </TouchableOpacity>

            {/* Version */}
            <View className="px-4 py-4 flex-row items-center">
              <View className="bg-slate-100 dark:bg-slate-700 rounded-full p-2 mr-3">
                <Ionicons
                  name="code-slash"
                  size={20}
                  color={actualTheme === "dark" ? "#cbd5e1" : "#6b7280"}
                />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-slate-100 font-semibold">
                  Version
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  1.1.3
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View className="px-6 pb-8">
          <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-3">
            Account
          </Text>

          <TouchableOpacity
            onPress={() => {
              Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Sign Out",
                  style: "destructive",
                  onPress: () => {
                    logOut();
                    router.replace("/(auth)/login");
                  },
                },
              ]);
            }}
            className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-4 flex-row items-center shadow-sm border border-red-200 dark:border-red-900/50"
          >
            <View className="bg-red-100 dark:bg-red-900/30 rounded-full p-2 mr-3">
              <Ionicons name="log-out" size={20} color="#ef4444" />
            </View>
            <View className="flex-1">
              <Text className="text-red-600 dark:text-red-500 font-semibold">
                Sign Out
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* AI help Section */}
        <View className="px-6">
          <ContactSupport actualTheme={actualTheme} />
        </View>

        {/* Creator Credit */}
        <View className="px-6 pb-12 mt-10">
          <View className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-6 border border-blue-100 dark:border-slate-700">
            <View className="flex-row items-center mb-2">
              <Ionicons name="heart" size={16} color="#ef4444" />
              <Text className="text-slate-700 dark:text-slate-300 text-sm ml-2">
                Made with love by
              </Text>
            </View>

            <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg">
              Fanyi Charllson
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Building tools to make life easier, one app at a time.
            </Text>

            {/* WhatsApp Button */}
            <TouchableOpacity
              onPress={openWhatsApp}
              className="mt-5 bg-blue-600 dark:bg-blue-500 py-3 px-5 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text className="text-white font-semibold text-base ml-2">
                Let&apos;s Chat / Feedback
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
