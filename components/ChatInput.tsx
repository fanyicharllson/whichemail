import React, { Dispatch, SetStateAction } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ChatInputProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  handleSubmit: () => void;
  actualTheme: "light" | "dark";
  getPlaceholder: () => string;
  isLoading: boolean;
  services: any[];
}

export default function ChatInput({
  input,
  setInput,
  handleSubmit,
  actualTheme,
  getPlaceholder,
  isLoading,
  services,
}: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = React.useState(false);
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (services.length === 0) return null;

  const isDark = actualTheme === "dark";
  const hasText = input.trim().length > 0;

  return (
    <View
      style={{ paddingBottom: insets.bottom || 10 }}
      className={`px-4 pt-3 pb-3 border-t ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
      }`}
    >
      <View className="flex-row items-end gap-2">
        {/* AI Icon - Left side */}
        <View
          className={`w-11 h-11 rounded-full items-center justify-center mb-1 ${
            isFocused
              ? "bg-blue-100 dark:bg-blue-900/40"
              : "bg-slate-100 dark:bg-slate-800"
          }`}
        >
          <Ionicons
            name="sparkles"
            size={22}
            color={
              isFocused
                ? isDark
                  ? "#60a5fa"
                  : "#3b82f6"
                : isDark
                ? "#64748b"
                : "#94a3b8"
            }
          />
        </View>

        {/* Input Container with Border Effect */}
        <View className="flex-1">
          <View
            className={`flex-row items-end rounded-3xl overflow-hidden ${
              isFocused
                ? isDark
                  ? "bg-slate-700 border-2 border-blue-500"
                  : "bg-white border-2 border-blue-500"
                : isDark
                ? "bg-slate-800 border border-slate-700"
                : "bg-slate-100 border border-slate-200"
            }`}
          >
            <View className={`flex-1 flex-row items-end rounded-3xl px-4 py-2`}>
              {/* Magic Icon inside input */}
              <View className="mb-2 mr-2">
                <Ionicons
                  name="bulb-outline"
                  size={20}
                  color={isDark ? "#64748b" : "#94a3b8"}
                />
              </View>

              {/* Text Input */}
              <TextInput
                className="flex-1 text-[15px] text-slate-900 dark:text-slate-100 max-h-[100px] py-2"
                value={input}
                onChangeText={setInput}
                placeholder={getPlaceholder()}
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />

              {/* Character count indicator */}
              {hasText && input.length > 400 && (
                <View className="mb-2 ml-2">
                  <View
                    className={`px-2 py-1 rounded-full ${
                      input.length > 450
                        ? "bg-orange-100 dark:bg-orange-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30"
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-semibold ${
                        input.length > 450
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {input.length}/500
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Send Button - Elevated with Gradient-like styling */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={!hasText || isLoading}
          className="mb-1"
        >
          <View
            className={`w-11 h-11 rounded-full items-center justify-center shadow-lg ${
              !hasText || isLoading
                ? "bg-slate-300 dark:bg-slate-700"
                : "bg-blue-500 dark:bg-blue-600"
            }`}
            style={{
              shadowColor: hasText && !isLoading ? "#3b82f6" : "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: hasText && !isLoading ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: hasText && !isLoading ? 8 : 2,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons
                name={hasText ? "arrow-up" : "send-outline"}
                size={22}
                color="#fff"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Actions / Suggestions - shows when focused, empty, and keyboard hidden */}
      {isFocused && !hasText && !keyboardVisible && (
        <View className="flex-row gap-2 mt-2 flex-wrap">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setInput("Show me all my shopping emails")}
            className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-full border border-blue-200 dark:border-blue-800"
          >
            <Text className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              🛍️ Shopping emails
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setInput("Find my gaming accounts")}
            className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-full border border-blue-200 dark:border-blue-800"
          >
            <Text className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              🎮 Gaming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setInput("Which email did I use for social media?")}
            className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-full border border-blue-200 dark:border-blue-800"
          >
            <Text className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              📱 Social
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
