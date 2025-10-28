// components/ElegantChatInput.tsx
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  Keyboard,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ElegantChatInputProps {
  input: string;
  setInput: (text: string) => void;
  handleSubmit: () => void;
  actualTheme: "light" | "dark";
  getPlaceholder: () => string;
  isLoading: boolean;
  services: any[];
  mode: string;
  onQuickPrompt: (prompt: string) => void;
  keyboardVisible: boolean;
}

const ElegantChatInput = forwardRef<any, ElegantChatInputProps>(
  (
    {
      input,
      setInput,
      handleSubmit,
      actualTheme,
      getPlaceholder,
      isLoading,
      services,
      mode,
      onQuickPrompt,
      keyboardVisible,
    },
    ref
  ) => {
    const insets = useSafeAreaInsets();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const slideAnim = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    useEffect(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [slideAnim]);

    if (services.length === 0) return null;

    const isDark = actualTheme === "dark";
    const hasText = input.trim().length > 0;

    const quickPrompts = [
      { text: "🛍️ Shopping", prompt: "Show me all my shopping emails" },
      { text: "🎮 Gaming", prompt: "Find my gaming accounts" },
      { text: "📱 Social", prompt: "Which email did I use for social media?" },
      { text: "💼 Work", prompt: "Show my work-related emails" },
      { text: "📧 Recovery", prompt: "Help me recover a lost email account" },
    ];

    const translateY = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -10], // Reduced translation for less space
    });

    const handleQuickPromptPress = (prompt: string) => {
      onQuickPrompt(prompt);
    };

    return (
      <Animated.View
        style={{
          transform: [{ translateY }],
          paddingBottom: Math.max(insets.bottom, 12), // Reduced padding
          paddingHorizontal: 16, // Reduced padding
          paddingTop: 8, // Reduced padding
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#334155" : "#e2e8f0",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 8,
        }}
      >
  {/* Quick Prompts - Show when focused (allow replacing input by clicking prompts) */}
  {/* {isFocused && keyboardVisible && ( */}
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: isDark ? "#94a3b8" : "#64748b",
                marginBottom: 8,
                marginLeft: 4,
              }}
            >
              💡 Quick prompts:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
            >
              {quickPrompts.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  onPress={() => {
                    // Ensure the input receives focus immediately and request the parent to update value
                    inputRef.current?.focus();
                    handleQuickPromptPress(item.prompt);
                  }}
                  style={{
                    backgroundColor: isDark ? "#334155" : "#f1f5f9",
                    paddingHorizontal: 12,
                    paddingVertical: 6, // Reduced padding
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isDark ? "#475569" : "#e2e8f0",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: isDark ? "#cbd5e1" : "#475569",
                      fontWeight: "500",
                    }}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        {/* // )} */}

        {/* Input Container */}
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
          {/* Reduced gap */}
          {/* Main Input */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                backgroundColor: isDark ? "#334155" : "#f8fafc",
                borderRadius: 20, // Slightly smaller border radius
                borderWidth: 2,
                borderColor: isFocused
                  ? "#3b82f6"
                  : isDark
                  ? "#475569"
                  : "#cbd5e1",
                paddingHorizontal: 12, // Reduced padding
                paddingVertical: 8, // Reduced padding
                minHeight: 44, // Reduced min height
              }}
            >
              <TextInput
                ref={inputRef}
                style={{
                  flex: 1,
                  fontSize: 15, // Slightly smaller font
                  color: isDark ? "#f1f5f9" : "#1e293b",
                  maxHeight: 80, // Reduced max height
                  padding: 0,
                  includeFontPadding: false,
                  textAlignVertical: "center",
                }}
                value={input}
                onChangeText={setInput}
                placeholder={getPlaceholder()}
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                multiline
                maxLength={250}
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />

              {/* Character Count */}
              {hasText && (
                <View style={{ marginLeft: 8, marginBottom: 2 }}>
                  <View
                    style={{
                      backgroundColor:
                        input.length > 150
                          ? "#fef2f2"
                          : isDark
                          ? "#475569"
                          : "#e2e8f0",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color:
                          input.length > 150
                            ? "#dc2626"
                            : isDark
                            ? "#94a3b8"
                            : "#64748b",
                      }}
                    >
                      {input.length}/250
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          {/* Send Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={!hasText || isLoading}
            style={{
              width: 44, // Reduced size
              height: 44, // Reduced size
              borderRadius: 22, // Reduced border radius
              backgroundColor:
                !hasText || isLoading
                  ? isDark
                    ? "#334155"
                    : "#cbd5e1"
                  : "#3b82f6",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: hasText && !isLoading ? "#3b82f6" : "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: hasText && !isLoading ? 0.3 : 0.1,
              shadowRadius: 4,
              elevation: hasText && !isLoading ? 4 : 2,
              marginBottom: 2, // Align better with input
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons
                name="send"
                size={18} // Reduced icon size
                color={hasText ? "#ffffff" : isDark ? "#64748b" : "#94a3b8"}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Mode Indicator */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 6, // Reduced margin
          }}
        >
          <Text
            style={{
              fontSize: 10, // Smaller font
              color: isDark ? "#64748b" : "#94a3b8",
              fontWeight: "500",
            }}
          >
            {mode === "smart-search" && "🔍 Smart Search Mode"}
            {mode === "recovery" && "🔑 Recovery Mode"}
            {mode === "chat" && "🤖 AI Chat Mode"}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons
              name="hardware-chip"
              size={10} // Smaller icon
              color={isDark ? "#64748b" : "#94a3b8"}
            />
            <Text
              style={{
                fontSize: 10, // Smaller font
                color: isDark ? "#64748b" : "#94a3b8",
              }}
            >
              Powered by Gemini AI
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }
);
ElegantChatInput.displayName = "ElegantChatInput";
export default ElegantChatInput;
